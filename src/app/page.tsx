import Link from "next/link";
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
        Upload a PDF or paste a lease, contractor quote, or terms. Skim pulls
        the clauses that can cost you money, a plain-English rewrite of each,
        and a message you can send back.
      </p>
      <p className="mt-2 text-sm text-[#6b6258]">
        $9 per check. No account. Not legal advice.{" "}
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
