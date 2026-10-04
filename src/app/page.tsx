import Link from "next/link";
import {
  checkOfferJsonLd,
  faqPageJsonLd,
  HOME_DESCRIPTION,
  HOME_FAQ,
  HOME_TITLE,
  pageMetadata,
} from "../lib/seo";
import { SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "../lib/site";
import CheckForm from "./CheckForm";
import JsonLd from "./JsonLd";
import SkimWordmark from "./SkimWordmark";

export const metadata = pageMetadata({
  path: "/",
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
});

const SAMPLE_LINK_LABEL = "Open the sample on the site";

function FaqAnswer({ answer }: { answer: string }) {
  return (
    <dd className="mt-1 space-y-2">
      {answer.split("\n\n").map((paragraph) => {
        const i = paragraph.indexOf(SAMPLE_LINK_LABEL);
        return (
          <p key={paragraph}>
            {i === -1 ? (
              paragraph
            ) : (
              <>
                {paragraph.slice(0, i)}
                <Link
                  href="/demo"
                  className="font-bold text-[#b42318] underline"
                >
                  {SAMPLE_LINK_LABEL}
                </Link>
                {paragraph.slice(i + SAMPLE_LINK_LABEL.length)}
              </>
            )}
          </p>
        );
      })}
    </dd>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-14">
      <JsonLd data={checkOfferJsonLd()} />
      <JsonLd data={faqPageJsonLd()} />
      <SkimWordmark className="h-20 sm:h-24" priority />
      <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
        Five red flags.
        <br />
        A rewrite. A reply.
      </h1>

      <div id="check" className="mt-8">
        <CheckForm />
      </div>

      <p className="mt-10 text-lg leading-relaxed text-[#3d342c]">
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
        ${SKIM_PRICE_USD} once. Up to {SKIMS_PER_PAYMENT} documents. Not legal
        advice.{" "}
        <Link href="/demo" className="font-bold text-[#b42318] underline">
          See a sample
        </Link>
      </p>

      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mt-12 border-t border-[#d9cfc0] pt-8"
      >
        <h2 id="faq-heading" className="text-xl font-black tracking-tight">
          Before you pay
        </h2>
        <dl className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#3d342c]">
          {HOME_FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-bold text-[#1a1410]">{item.question}</dt>
              <FaqAnswer answer={item.answer} />
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
