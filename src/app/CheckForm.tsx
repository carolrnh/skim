"use client";

import { useEffect, useState } from "react";

type Flag = {
  title: string;
  why: string;
  quote: string;
  severity: "high" | "medium" | "low";
};

const DRAFT_KEY = "skim-draft";

export default function CheckForm() {
  const [text, setText] = useState("");
  const [flags, setFlags] = useState<Flag[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id") || "";
    const saved = sessionStorage.getItem(DRAFT_KEY) || "";
    if (saved) setText(saved);
    if (!sid.startsWith("cs_")) return;

    setSessionId(sid);
    setLoading(true);
    fetch(`/api/checkout?session_id=${encodeURIComponent(sid)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.paid) {
          setError("Payment not found. Pay $9 to skim.");
          return;
        }
        setPaid(true);
        if (saved.trim().length >= 40) return runCheck(saved, sid);
      })
      .catch(() => setError("Could not verify payment."))
      .finally(() => setLoading(false));
  }, []);

  async function runCheck(doc: string, sid: string) {
    setError("");
    setFlags(null);
    setLoading(true);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: doc, sessionId: sid }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Check failed");
        return;
      }
      setFlags(data.flags || []);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (text.trim().length < 40) {
      setError("Paste at least a paragraph (40+ characters).");
      return;
    }
    sessionStorage.setItem(DRAFT_KEY, text);

    if (paid && sessionId) {
      await runCheck(text, sessionId);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout failed");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a lease, contractor quote, gym contract, or terms…"
          rows={10}
          className="w-full rounded-xl border border-[#d9cfc0] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#1a1410] outline-none focus:border-[#b42318]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#b42318] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading
            ? paid
              ? "Skimming…"
              : "Sending you to Stripe…"
            : paid
              ? "Run this skim"
              : "Pay $9 — then see 5 flags"}
        </button>
        <p className="text-xs text-[#6b6258]">
          {paid
            ? "Payment received. This $9 covers up to 3 skims. Not legal advice."
            : "Stripe Checkout. $9 USD. This payment covers up to 3 documents. Not legal advice."}
        </p>
      </form>

      {error ? (
        <p className="mt-4 text-sm font-semibold text-[#b42318]">{error}</p>
      ) : null}

      {flags && flags.length > 0 ? (
        <ol className="mt-8 space-y-4">
          {flags.map((f, i) => (
            <li
              key={`${f.title}-${i}`}
              className="rounded-xl border border-[#eadfd0] bg-white p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[#b42318]">
                  {f.severity}
                </span>
                <span className="text-xs text-[#6b6258]">#{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3d342c]">{f.why}</p>
              {f.quote ? (
                <blockquote className="mt-3 border-l-2 border-[#b42318] pl-3 text-sm italic text-[#6b6258]">
                  “{f.quote}”
                </blockquote>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
