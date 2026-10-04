import type { Metadata } from "next";
import { SITE_URL, SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "./site";

export const HOME_TITLE = "Skim — flags, a rewrite, and a reply";
export const HOME_DESCRIPTION =
  "Chat will discuss your contract if you keep prompting. Skim is the finished report: five red flags, a rewrite of each, and a reply to paste back. $9 once covers up to 3 documents. No account. Not a subscription. Not legal advice.";

export const HOME_FAQ = [
  {
    question: "How much does Skim cost?",
    answer:
      "$9 once covers up to 3 documents — five red flags, a rewrite per flag, and a paste-ready reply. Not $9/month. Not unlimited.\n\nPay once in Stripe. No account. No subscription. Not legal advice.",
  },
  {
    question: "Is Skim a $9/month subscription?",
    answer:
      "No. Skim is not $9 a month and not unlimited documents. One $9 payment covers up to 3 documents. Each document gets five red flags, a rewrite for each flag, and a reply ready to paste.",
  },
  {
    question: "What do I get for $9?",
    answer:
      "Up to 3 documents. For each one: five clauses that can cost you money, a replacement for each, and a reply you can paste. Upload a PDF or paste the text. No prompt. No account. Not legal advice.",
  },
  {
    question: "Do I need an account or a credit card on file?",
    answer:
      "No account. Pay $9 once at checkout. That payment covers up to 3 documents. Not a subscription.",
  },
  {
    question: "Can I see a sample before I pay?",
    answer:
      "Yes. Open the sample on the site — a finished skim, no charge — then pay $9 if you want up to 3 of your own documents.",
  },
] as const;

export const DEMO_TITLE = "Sample report — Skim";
export const DEMO_DESCRIPTION =
  "Free sample Skim of a contractor quote: five red flags, a rewrite of each, and a reply ready to send. Not legal advice.";

export const PRIVACY_TITLE = "Privacy — Skim";
export const PRIVACY_DESCRIPTION =
  "Skim has no accounts. A PDF is read for its text and is not saved. The document is sent to xAI only when a paid check runs. Payment runs through Stripe. We do not keep a database of your documents.";

export const TERMS_TITLE = "Terms — Skim";
export const TERMS_DESCRIPTION = `Skim is a $${SKIM_PRICE_USD} document check covering up to ${SKIMS_PER_PAYMENT} reports. Output is not legal advice. The service is provided as-is.`;

const SITE_OG = {
  siteName: "Skim",
  type: "website" as const,
  locale: "en_US",
};

export function pageUrl(path: string = "/"): string {
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = pageUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...SITE_OG,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Skim",
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Skim",
        description: HOME_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function checkOfferJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#check`,
    name: "Skim",
    url: `${SITE_URL}/#check`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: HOME_DESCRIPTION,
    offers: {
      "@type": "Offer",
      name: `Skim — up to ${SKIMS_PER_PAYMENT} documents`,
      price: String(SKIM_PRICE_USD),
      priceCurrency: "USD",
      description: `$${SKIM_PRICE_USD} once covers up to ${SKIMS_PER_PAYMENT} documents. Not $${SKIM_PRICE_USD}/month. Not unlimited.`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    url: SITE_URL,
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
