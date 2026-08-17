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
        Then you decide.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#3d342c]">
        Paste a lease, contractor quote, or terms of service. Skim pulls the
        clauses that can cost you money — in English, not lawyer.
      </p>
      <p className="mt-2 text-sm text-[#6b6258]">$9 per check. No account. Not legal advice.</p>

      <div className="mt-10">
        <CheckForm />
      </div>
    </main>
  );
}
