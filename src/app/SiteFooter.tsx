import Link from "next/link";
import { SITE_HOST, SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#d9cfc0]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-5 py-6 text-sm text-[#6b6258]">
        <p className="font-semibold">
          Not legal advice. {SITE_HOST}. ${SKIM_PRICE_USD} covers up to{" "}
          {SKIMS_PER_PAYMENT} documents.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 font-bold">
          <Link href="/demo" className="text-[#1a1410]">
            Sample
          </Link>
          <Link href="/privacy" className="text-[#1a1410]">
            Privacy
          </Link>
          <Link href="/terms" className="text-[#1a1410]">
            Terms
          </Link>
        </nav>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <a
            href="https://openhunts.com"
            target="_blank"
            rel="noopener"
            title="OpenHunts Club"
            className="mt-1 w-fit"
          >
            {/* Plain img keeps the OpenHunts CDN URL in the HTML. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="OpenHunts Club Member"
              height={105}
              src="https://cdn.openhunts.com/badges/club.webp"
              style={{ width: "195px", height: "auto" }}
              width={486}
            />
          </a>
          <a href="https://twelve.tools" target="_blank" className="mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Featured on Twelve Tools"
              height={54}
              src="https://twelve.tools/badge0-light.svg"
              style={{ height: "48px", width: "auto" }}
              width={200}
            />
          </a>
          <a
            href="https://dang.ai"
            target="_blank"
            rel="dofollow noopener"
            className="mt-1"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Verified on DANG!"
              height={94}
              src="https://assets.dang.ai/badges/dang-verified-light.png"
              style={{
                display: "block",
                width: "auto",
                maxWidth: "100%",
                height: "48px",
                border: 0,
                outline: "none",
                textDecoration: "none",
              }}
              width={260}
            />
          </a>
          <a
            href="https://startupbase.io/products/skim?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-light"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Launched on StartupBase"
              height={55}
              src="https://statics.startupbase.io/site/badges/launched-on-sb.svg"
              style={{ height: "48px", width: "auto" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
