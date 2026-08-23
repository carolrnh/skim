import { NextRequest, NextResponse } from "next/server";
import { SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../../../lib/site";
import { consumePaidSession, readPaidSession } from "../../../lib/stripe";

export const maxDuration = 60;

const MODEL = "grok-4.5";
const MAX_CHARS = 20_000;

type Flag = {
  title: string;
  why: string;
  quote: string;
  rewrite: string;
  severity: "high" | "medium" | "low";
};

export async function POST(req: NextRequest) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "XAI_API_KEY is missing. Add it to .env.local." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (text.length < 40) {
    return NextResponse.json(
      { error: "Paste at least a paragraph (40+ characters)." },
      { status: 400 }
    );
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `Too long. Cap is ${MAX_CHARS} characters.` },
      { status: 400 }
    );
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  const paid = await readPaidSession(sessionId);
  if (!paid.ok) {
    return NextResponse.json({ error: paid.error }, { status: paid.status });
  }
  if (paid.remaining <= 0) {
    return NextResponse.json(
      {
        error: `This $${SKIM_PRICE_USD} already covered ${SKIMS_PER_PAYMENT} skims. Pay again for another document.`,
      },
      { status: 402 }
    );
  }

  const system = `You skim contracts, leases, contractor quotes, and terms of service for a regular person.
Return ONLY valid JSON: {"flags":[{"title":"","why":"","quote":"","rewrite":"","severity":"high|medium|low"}],"reply":""}
Rules:
- Exactly 5 flags, worst first.
- title: 6 words max, no legalese.
- why: one or two sentences in plain English. What they could lose.
- quote: a short span copied from the document, or "" if you must paraphrase.
- rewrite: one or two sentences they can ask the other side to put in instead. Plain English. A replacement clause, not a lecture.
- reply: one short first-person message they can paste to the other party. Polite and firm. Names the 2–3 worst issues and asks for those rewrites. No threats. No "I will sue." 80–140 words. Not a lawyer letter.
- Not legal advice. No invented clauses. If the doc is thin, say so in why.
- Never mention being an AI.`;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: text.slice(0, MAX_CHARS) },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[skim] xAI", res.status, errText.slice(0, 400));
    return NextResponse.json(
      { error: "Check failed. Try again in a minute." },
      { status: 502 }
    );
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content || "";
  const { flags, reply } = parseCheck(raw);
  if (flags.length === 0) {
    return NextResponse.json(
      { error: "Could not read flags from this document. Try a longer paste." },
      { status: 422 }
    );
  }

  const consumed = await consumePaidSession(sessionId);
  if (!consumed.ok) {
    console.error("[skim] report delivered but consume failed", consumed.error);
  }

  return NextResponse.json({
    flags,
    reply,
    model: MODEL,
    remaining: consumed.ok ? consumed.remaining : Math.max(0, paid.remaining - 1),
  });
}

function parseCheck(raw: string): { flags: Flag[]; reply: string } {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return { flags: [], reply: "" };
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    const list = Array.isArray(parsed.flags) ? parsed.flags : [];
    const flags = list
      .map(
        (f: {
          title?: string;
          why?: string;
          quote?: string;
          rewrite?: string;
          severity?: string;
        }) => ({
          title: String(f.title || "").slice(0, 80),
          why: String(f.why || "").slice(0, 400),
          quote: String(f.quote || "").slice(0, 240),
          rewrite: String(f.rewrite || "").slice(0, 400),
          severity:
            f.severity === "high" || f.severity === "medium" || f.severity === "low"
              ? f.severity
              : "medium",
        })
      )
      .filter((f: Flag) => f.title && f.why)
      .slice(0, 5);
    const reply = String(parsed.reply || "").slice(0, 1200).trim();
    return { flags, reply };
  } catch {
    return { flags: [], reply: "" };
  }
}
