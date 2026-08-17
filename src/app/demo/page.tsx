import FlagReport, { type Flag } from "../FlagReport";

const DEMO_FLAGS: Flag[] = [
  {
    severity: "high",
    title: "You pay before any work",
    why: "Half is due on signing and the rest before they start. If they never show up, that money is already gone.",
    quote: "50% due on signing, remainder due before work begins, non-refundable",
  },
  {
    severity: "high",
    title: "You cannot sue them",
    why: "Signing sends every dispute to arbitration they pick. A court is off the table.",
    quote: "Owner waives the right to sue and agrees to binding arbitration in a venue chosen by Contractor",
  },
  {
    severity: "high",
    title: "They can walk, you cannot",
    why: "Delays are their problem never. Timeline is only an estimate and they owe you nothing if the job sits.",
    quote: "Contractor is not liable for delays of any kind",
  },
  {
    severity: "medium",
    title: "Warranty is almost nothing",
    why: "30 days on labor only. Materials, water, and mold are excluded if they say it was already there.",
    quote: "Warranty is 30 days on labor only and excludes materials, water, mold",
  },
  {
    severity: "medium",
    title: "Cleanup is a surprise bill",
    why: "Dumpster and cleanup are extra, at cost plus 40%, after you already paid the quote.",
    quote: "Dumpster and cleanup billed separately at cost plus 40%",
  },
];

export default function DemoPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-14">
      <p className="mb-6 text-sm font-bold text-[#6b6258]">
        Sample report — no charge. Real skims are $9 at{" "}
        <a href="/" className="text-[#b42318] underline">
          skim.forgeprod.com
        </a>
      </p>
      <FlagReport flags={DEMO_FLAGS} />
    </main>
  );
}
