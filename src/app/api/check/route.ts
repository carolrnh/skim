import { NextRequest, NextResponse } from "next/server";
import { consumePaidSession } from "../../../lib/stripe";

const MODEL = "grok-4.5";
const MAX_CHARS = 20_000;

type Flag = {
  title: string;
  why: string;
  quote: string;
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
  const paid = await consumePaidSession(sessionId);
  if (!paid.ok) {
    return NextResponse.json({ error: paid.error }, { status: paid.status });
  }

  const system = `You skim contracts, leases, contractor quotes, and terms of service for a regular person.
Return ONLY valid JSON: {"flags":[{"title":"","why":"","quote":"","severity":"high|medium|low"}]}
Rules:
- Exactly 5 flags, worst first.
- title: 6 words max, no legalese.
- why: one or two sentences in plain English. What they could lose.
- quote: a short span copied from the document, or "" if you must paraphrase.
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
  const flags = parseFlags(raw);
  if (flags.length === 0) {
    return NextResponse.json(
      { error: "Could not read flags from this document. Try a longer paste." },
      { status: 422 }
    );
  }

  return NextResponse.json({ flags, model: MODEL });
}

function parseFlags(raw: string): Flag[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    const list = Array.isArray(parsed.flags) ? parsed.flags : [];
    return list
      .map((f: { title?: string; why?: string; quote?: string; severity?: string }) => ({
        title: String(f.title || "").slice(0, 80),
        why: String(f.why || "").slice(0, 400),
        quote: String(f.quote || "").slice(0, 240),
        severity:
          f.severity === "high" || f.severity === "medium" || f.severity === "low"
            ? f.severity
            : "medium",
      }))
      .filter((f: Flag) => f.title && f.why)
      .slice(0, 5);
  } catch {
    return [];
  }
}
