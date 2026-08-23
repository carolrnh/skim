import Link from "next/link";
import { SITE_HOST } from "../lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#d9cfc0]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-5 py-6 text-sm text-[#6b6258]">
        <p className="font-semibold">
          Not legal advice. {SITE_HOST}. $9 covers up to 3 documents.
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
      </div>
    </footer>
  );
}
