import type { Metadata } from "next";
import { SITE_HOST, SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../../lib/site";

export const metadata: Metadata = {
  title: "Terms — Skim",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-14">
      <h1 className="text-4xl font-black tracking-tight">Terms</h1>
      <p className="mt-2 text-sm text-[#6b6258]">Last updated: August 23, 2026</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[#3d342c]">
        <p>
          Skim is a ${SKIM_PRICE_USD} document check. You get up to{" "}
          {SKIMS_PER_PAYMENT} skims per payment: five
          red flags, a plain-English rewrite of each, and a reply you can send.
          It is not legal advice and not a lawyer. Do not treat the output as
          counsel.
        </p>
        <p>
          You must have the right to submit the text you upload or paste. The
          report is for you. We may refuse or stop a check that looks like
          abuse.
        </p>
        <p>
          The check is delivered on the site after payment. The service is
          provided as-is. Site: {SITE_HOST}.
        </p>
      </div>
    </main>
  );
}
