import type { Metadata } from "next";
import { SITE_URL, SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "./site";

export const HOME_TITLE = "Skim — flags, a rewrite, and a reply";
export const HOME_DESCRIPTION =
  "Chat will discuss your contract if you keep prompting. Skim is the finished report: five red flags, a rewrite of each, and a reply to paste back. $9. No account. Not legal advice.";

export const DEMO_TITLE = "Sample report — Skim";
export const DEMO_DESCRIPTION =
  "Free sample Skim of a contractor quote: five red flags, a rewrite of each, and a reply ready to send. Not legal advice.";

export const PRIVACY_TITLE = "Privacy — Skim";
export const PRIVACY_DESCRIPTION =
  "Skim has no accounts. Uploaded text goes to xAI to build your report. Payment runs through Stripe. We do not keep a user database of your documents.";

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
      price: String(SKIM_PRICE_USD),
      priceCurrency: "USD",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
