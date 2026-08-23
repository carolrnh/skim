import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[#d9cfc0]">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="select-none text-2xl font-black leading-none tracking-[-0.08em] text-[#b42318]"
        >
          SKIM
        </Link>
        <nav className="flex items-center gap-5 text-sm font-bold">
          <Link href="/demo" className="text-[#1a1410]">
            Sample
          </Link>
          <Link href="/#check" className="text-[#b42318]">
            $9 check
          </Link>
        </nav>
      </div>
    </header>
  );
}
