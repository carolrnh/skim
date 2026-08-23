"use client";

import { useEffect, useState } from "react";
import { SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../lib/site";
import FlagReport, { type Flag } from "./FlagReport";

const DRAFT_KEY = "skim-draft";

export default function CheckForm() {
  const [text, setText] = useState("");
  const [flags, setFlags] = useState<Flag[] | null>(null);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [paid, setPaid] = useState(false);
  const [reading, setReading] = useState(false);
  const [fileName, setFileName] = useState("");

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
          setError(`Payment not found. Pay $${SKIM_PRICE_USD} to skim.`);
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
    setReply("");
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
      setReply(typeof data.reply === "string" ? data.reply : "");
      window.setTimeout(() => {
        document.getElementById("skim-report")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setReading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setFileName("");
        setError(data.error || "Could not read that PDF.");
        return;
      }
      const next = typeof data.text === "string" ? data.text : "";
      setText(next);
      setFileName(file.name);
      sessionStorage.setItem(DRAFT_KEY, next);
      if (data.truncated) {
        setError("Read the first part of this PDF (20,000 character cap).");
      }
    } catch {
      setFileName("");
      setError("Could not read that PDF.");
    } finally {
      setReading(false);
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
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-[#d9cfc0] bg-white px-4 py-3 text-sm font-bold text-[#1a1410]">
          <span>{reading ? "Reading PDF…" : "Upload a PDF"}</span>
          <span className="truncate text-xs font-semibold text-[#6b6258]">
            {fileName || "or paste below"}
          </span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => void onPdf(e)}
            disabled={loading || reading}
            className="sr-only"
          />
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (fileName) setFileName("");
          }}
          placeholder="Paste a lease, contractor quote, gym contract, or terms…"
          rows={10}
          className="w-full rounded-xl border border-[#d9cfc0] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#1a1410] outline-none focus:border-[#b42318]"
        />
        <button
          type="submit"
          disabled={loading || reading}
          className="rounded-full bg-[#b42318] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading
            ? paid
              ? "Skimming…"
              : "Sending you to Stripe…"
            : paid
              ? "Run this skim"
              : `Pay $${SKIM_PRICE_USD} — up to ${SKIMS_PER_PAYMENT} documents`}
        </button>
        <p className="text-xs text-[#6b6258]">
          {paid
            ? `Payment received. This $${SKIM_PRICE_USD} covers up to ${SKIMS_PER_PAYMENT} skims. Not legal advice.`
            : `Stripe Checkout. $${SKIM_PRICE_USD} USD. This payment covers up to ${SKIMS_PER_PAYMENT} documents. Not legal advice.`}
        </p>
      </form>

      {error ? (
        <p className="mt-4 text-sm font-semibold text-[#b42318]">{error}</p>
      ) : null}

      {flags && flags.length > 0 ? (
        <div className="mt-10">
          <FlagReport
            flags={flags}
            reply={reply}
            onAgain={() => {
              setFlags(null);
              setReply("");
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
