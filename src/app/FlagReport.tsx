"use client";

import { useState } from "react";
import { SITE_HOST } from "../lib/site";

export type Flag = {
  title: string;
  why: string;
  quote: string;
  rewrite: string;
  severity: "high" | "medium" | "low";
};

function reportToText(flags: Flag[], reply: string) {
  const lines = [
    "SKIM — 5 red flags",
    "Not legal advice.",
    SITE_HOST,
    "",
    ...flags.map((f, i) => {
      const q = f.quote ? `\n   “${f.quote}”` : "";
      const r = f.rewrite ? `\n   Ask for this instead: ${f.rewrite}` : "";
      return `${i + 1}. [${f.severity.toUpperCase()}] ${f.title}\n   ${f.why}${q}${r}`;
    }),
  ];
  if (reply) {
    lines.push("", "Reply to send", reply);
  }
  return lines.join("\n");
}

export default function FlagReport({
  flags,
  reply = "",
  onAgain,
}: {
  flags: Flag[];
  reply?: string;
  onAgain?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [replyCopied, setReplyCopied] = useState(false);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(reportToText(flags, reply));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function copyReply() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setReplyCopied(true);
      window.setTimeout(() => setReplyCopied(false), 1800);
    } catch {
      setReplyCopied(false);
    }
  }

  return (
    <section
      id="skim-report"
      className="rounded-2xl border-2 border-[#1a1410] bg-[#f4efe6] p-6 text-[#1a1410] sm:p-8"
    >
      <p className="select-none text-5xl font-black leading-none tracking-[-0.08em] text-[#b42318] sm:text-6xl">
        SKIM
      </p>
      <button
        type="button"
        onClick={() => void copyAll()}
        className="mt-5 w-full rounded-full bg-[#b42318] px-6 py-3 text-base font-black text-white"
      >
        {copied ? "Copied" : "Copy report"}
      </button>

      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-[#b42318]">
        {flags.length} red flags
      </p>

      <ol className="mt-5 space-y-5">
        {flags.map((f, i) => (
          <li key={`${f.title}-${i}`}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#b42318]">{i + 1}</span>
              <h3 className="text-xl font-black leading-tight">{f.title}</h3>
            </div>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#6b6258]">
              {f.severity}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#3d342c]">{f.why}</p>
            {f.quote ? (
              <blockquote className="mt-2 border-l-2 border-[#b42318] pl-3 text-sm italic text-[#6b6258]">
                “{f.quote}”
              </blockquote>
            ) : null}
            {f.rewrite ? (
              <div className="mt-3 rounded-xl bg-white/70 px-3 py-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#b42318]">
                  Ask for this instead
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-[#1a1410]">
                  {f.rewrite}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      {reply ? (
        <div className="mt-8 rounded-xl border border-[#1a1410] bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#b42318]">
            Reply to send
          </p>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[#1a1410]">
            {reply}
          </p>
          <button
            type="button"
            onClick={() => void copyReply()}
            className="mt-4 w-full rounded-full border-2 border-[#1a1410] bg-[#b42318] px-6 py-3 text-base font-black text-white"
          >
            {replyCopied ? "Copied reply" : "Copy reply"}
          </button>
        </div>
      ) : null}

      <p className="mt-8 text-xs font-semibold text-[#6b6258]">
        Not legal advice. {SITE_HOST}
      </p>

      {onAgain ? (
        <button
          type="button"
          onClick={onAgain}
          className="mt-4 text-sm font-bold text-[#b42318] underline"
        >
          Skim another document
        </button>
      ) : null}
    </section>
  );
}
