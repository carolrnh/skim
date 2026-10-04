import {
  pageMetadata,
  PRIVACY_DESCRIPTION,
  PRIVACY_TITLE,
} from "../../lib/seo";
import { SITE_HOST, SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../../lib/site";

export const metadata = pageMetadata({
  path: "/privacy",
  title: PRIVACY_TITLE,
  description: PRIVACY_DESCRIPTION,
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-14">
      <h1 className="text-4xl font-black tracking-tight">Privacy</h1>
      <p className="mt-2 text-sm text-[#6b6258]">Last updated: October 4, 2026</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[#3d342c]">
        <p>
          Skim has no accounts. This site does not ask for your name or email.
        </p>
        <p>
          If you upload a PDF, the file is sent to this site only so the text
          can be read. The cap is 8 MB and the first 20,000 characters. The PDF
          is not saved. The text is returned to your browser. A scan with no
          readable text is rejected.
        </p>
        <p>
          If you paste text, it stays in your browser until you run a check. A
          draft of that text, the Stripe Checkout session id, and whether that
          draft was already skimmed can sit in sessionStorage so a return from
          Stripe uses the same text. That storage clears when the tab session
          ends.
        </p>
        <p>
          Uploading or pasting does not charge you. Payment starts only when
          you press pay. That opens Stripe Checkout for a one-time ${SKIM_PRICE_USD}{" "}
          payment, which covers up to {SKIMS_PER_PAYMENT} documents. Stripe
          collects the card and the billing email. The
          document is not sent to Stripe. What we keep from Checkout is the
          session id and a count of how many of those {SKIMS_PER_PAYMENT} skims
          have been used. That count is stored on the Stripe session. There is
          no Skim database of documents or customers.
        </p>
        <p>
          After you have paid, running the check sends the document text to xAI
          (api.x.ai) to produce five flags, a rewrite for each, and a reply. We
          do not keep a copy of the document after that request finishes. We do
          not control how long xAI keeps the text it receives.
        </p>
        <p>
          We do not sell your document or your payment data. Payment questions
          go to the email on your Stripe receipt. Site: {SITE_HOST}.
        </p>
      </div>
    </main>
  );
}
