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
      <p className="mt-2 text-sm text-[#6b6258]">Last updated: August 23, 2026</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[#3d342c]">
        <p>
          Skim has no accounts. We do not ask for your name or email. Payment
          goes through Stripe.
        </p>
        <p>
          If you upload a PDF or paste text, that document is sent to xAI so we
          can return flags, rewrites, and a reply. We do not keep a user
          database of your documents. A draft may sit in your browser
          (sessionStorage) so Stripe can send you back to the same text.
        </p>
        <p>
          Stripe sees your card and billing email. We see a Checkout session id
          and how many of the {SKIMS_PER_PAYMENT} skims on that ${SKIM_PRICE_USD} have
          been used.
        </p>
        <p>
          We do not sell your document or your payment data. Payment questions:
          use the email on your Stripe receipt. Site: {SITE_HOST}.
        </p>
      </div>
    </main>
  );
}
