import FlagReport, { type Flag } from "../FlagReport";

const DEMO_FLAGS: Flag[] = [
  {
    severity: "high",
    title: "You pay before any work",
    why: "Half is due on signing and the rest before they start. If they never show up, that money is already gone.",
    quote: "50% due on signing, remainder due before work begins, non-refundable",
    rewrite:
      "Deposit is 20% to book the date. The rest is due when the work is finished and I have walked the job.",
  },
  {
    severity: "high",
    title: "You cannot sue them",
    why: "Signing sends every dispute to arbitration they pick. A court is off the table.",
    quote: "Owner waives the right to sue and agrees to binding arbitration in a venue chosen by Contractor",
    rewrite:
      "Disputes go to small claims or mediation in my county. Neither of us waives the right to go to court.",
  },
  {
    severity: "high",
    title: "They can walk, you cannot",
    why: "Delays are their problem never. Timeline is only an estimate and they owe you nothing if the job sits.",
    quote: "Contractor is not liable for delays of any kind",
    rewrite:
      "If the job sits more than 14 days without weather or a written change from me, I can cancel and get unused money back.",
  },
  {
    severity: "medium",
    title: "Warranty is almost nothing",
    why: "30 days on labor only. Materials, water, and mold are excluded if they say it was already there.",
    quote: "Warranty is 30 days on labor only and excludes materials, water, mold",
    rewrite:
      "Labor and workmanship are warranted for one year. Materials follow the manufacturer warranty.",
  },
  {
    severity: "medium",
    title: "Cleanup is a surprise bill",
    why: "Dumpster and cleanup are extra, at cost plus 40%, after you already paid the quote.",
    quote: "Dumpster and cleanup billed separately at cost plus 40%",
    rewrite:
      "The quoted price includes dumpster, haul-away, and leaving the site broom-clean. No cleanup extras.",
  },
];

const DEMO_REPLY = `Thanks for the quote. Before I sign, I need a few changes in writing:

1. Deposit 20% to book, balance when the job is done and I’ve walked it — not non-refundable payment before you start.
2. If work stops for more than 14 days (other than weather or a change I asked for), I can cancel and get unused money back.
3. Disputes stay in my county. I’m not waiving court.
4. One-year labor warranty, and cleanup included in the quote.

If you can send a revised version with those points, I’m ready to move.`;

export default function DemoPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-14">
      <p className="mb-6 text-sm font-bold text-[#6b6258]">
        Sample report — no charge. Real skims are $9 at{" "}
        <a href="/" className="text-[#b42318] underline">
          skim.forgeprod.com
        </a>
      </p>
      <FlagReport flags={DEMO_FLAGS} reply={DEMO_REPLY} />
    </main>
  );
}
