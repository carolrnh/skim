"use client";

import { useState } from "react";

export type Flag = {
  title: string;
  why: string;
  quote: string;
  severity: "high" | "medium" | "low";
};

function flagsToText(flags: Flag[]) {
  const lines = [
    "SKIM — 5 red flags",
    "Not legal advice.",
    "skim.forgeprod.com",
    "",
    ...flags.map((f, i) => {
      const q = f.quote ? `\n   “${f.quote}”` : "";
      return `${i + 1}. [${f.severity.toUpperCase()}] ${f.title}\n   ${f.why}${q}`;
    }),
  ];
  return lines.join("\n");
}

export default function FlagReport({
  flags,
  onAgain,
}: {
  flags: Flag[];
  onAgain: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(flagsToText(flags));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
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
        {copied ? "Copied" : "Copy all 5 flags"}
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
          </li>
        ))}
      </ol>

      <p className="mt-8 text-xs font-semibold text-[#6b6258]">
        Not legal advice. skim.forgeprod.com
      </p>

      <button
        type="button"
        onClick={onAgain}
        className="mt-4 text-sm font-bold text-[#b42318] underline"
      >
        Skim another document
      </button>
    </section>
  );
}
