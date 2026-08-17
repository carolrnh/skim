import { NextRequest, NextResponse } from "next/server";
import { getStripe, publicOrigin, SKIM_PRICE_CENTS } from "../../../lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const origin = publicOrigin(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      allow_promotion_codes: true,
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: SKIM_PRICE_CENTS,
            product_data: {
              name: "Skim — 5 red flags",
              description: "One document check. Not legal advice.",
            },
          },
        },
      ],
      metadata: { product: "skim", skims: "0" },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout did not return a URL" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    console.error("[skim checkout]", msg);
    return NextResponse.json(
      { error: msg.includes("STRIPE") ? "Stripe is not configured. Add STRIPE_SECRET_KEY." : "Checkout failed." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("session_id") || "";
  if (!id.startsWith("cs_")) {
    return NextResponse.json({ paid: false });
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(id);
    const paid = session.payment_status === "paid" && session.amount_total === SKIM_PRICE_CENTS;
    return NextResponse.json({ paid, id: session.id });
  } catch {
    return NextResponse.json({ paid: false });
  }
}
