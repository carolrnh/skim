import Link from "next/link";
import { SKIM_PRICE_USD } from "../lib/site";
import SkimWordmark from "./SkimWordmark";

export default function SiteHeader() {
  return (
    <header className="border-b border-[#d9cfc0]">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4">
        <Link href="/" className="block shrink-0" aria-label="Skim home">
          <SkimWordmark className="h-8 w-auto sm:h-9" priority />
        </Link>
        <nav className="flex items-center gap-5 text-sm font-bold">
          <Link href="/demo" className="text-[#1a1410]">
            Sample
          </Link>
          <Link href="/#check" className="text-[#b42318]">
            ${SKIM_PRICE_USD} check
          </Link>
        </nav>
      </div>
    </header>
  );
}
