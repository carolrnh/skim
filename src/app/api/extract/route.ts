import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_CHARS = 20_000;
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // %PDF

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a PDF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "PDF is too large. Cap is 8 MB." },
      { status: 413 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isPdf(bytes)) {
    return NextResponse.json({ error: "That file is not a PDF." }, { status: 400 });
  }

  try {
    const pdf = await getDocumentProxy(bytes);
    const extracted = await extractText(pdf, { mergePages: true });
    const raw = Array.isArray(extracted.text)
      ? extracted.text.join("\n")
      : String(extracted.text || "");
    const text = raw.replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n").trim();
    if (text.length < 40) {
      return NextResponse.json(
        {
          error:
            "This PDF has no readable text. If it is a scan, paste the wording instead.",
        },
        { status: 422 }
      );
    }
    return NextResponse.json({
      text: text.slice(0, MAX_CHARS),
      truncated: text.length > MAX_CHARS,
      pages: extracted.totalPages ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    console.error("[skim extract]", msg.slice(0, 400));
    if (/password/i.test(msg)) {
      return NextResponse.json(
        { error: "This PDF is locked. Unlock it, or paste the text." },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: "Could not read that PDF. Try paste." },
      { status: 422 }
    );
  }
}

function isPdf(bytes: Uint8Array) {
  return bytes.length >= 5 && PDF_MAGIC.every((b, i) => bytes[i] === b);
}
