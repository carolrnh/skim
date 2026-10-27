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
      </div>
    </footer>
  );
}
