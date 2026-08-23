import Link from "next/link";
import { SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../lib/site";
import CheckForm from "./CheckForm";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-14">
      <p
        className="select-none text-7xl font-black leading-none tracking-[-0.08em] text-[#b42318] sm:text-8xl"
        aria-label="Skim"
      >
        SKIM
      </p>
      <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
        Five red flags.
        <br />
        A rewrite. A reply.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#3d342c]">
        Any chat will talk about your lease if you keep prompting. Then you
        still have to ask for the flags, then a rewrite, then something you can
        actually send — and copy it out before the thread wanders.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-[#3d342c]">
        Skim is that report, once. Five clauses that can cost you money. A
        replacement for each. A reply ready to paste. Upload the PDF or paste
        the text. No prompt. No account.
      </p>
      <p className="mt-2 text-sm text-[#6b6258]">
        ${SKIM_PRICE_USD}. Up to {SKIMS_PER_PAYMENT} documents. Not legal
        advice.{" "}
        <Link href="/demo" className="font-bold text-[#b42318] underline">
          See a sample
        </Link>
      </p>

      <div id="check" className="mt-10">
        <CheckForm />
      </div>
    </main>
  );
}
