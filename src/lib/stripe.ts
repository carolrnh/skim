import Stripe from "stripe";

export const SKIM_PRICE_CENTS = 900;
export const SKIMS_PER_PAYMENT = 3;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }
  return new Stripe(key);
}

export async function consumePaidSession(
  sessionId: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  if (!sessionId.startsWith("cs_")) {
    return { ok: false, error: "Pay $9 first to run a skim.", status: 402 };
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return { ok: false, error: "Payment is not complete.", status: 402 };
    }
    if (session.amount_total !== SKIM_PRICE_CENTS) {
      return { ok: false, error: "This payment is not a Skim check.", status: 402 };
    }
    const used = Number(session.metadata?.skims || 0);
    if (!Number.isFinite(used) || used >= SKIMS_PER_PAYMENT) {
      return {
        ok: false,
        error: "This $9 already covered 3 skims. Pay again for another document.",
        status: 402,
      };
    }
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        product: "skim",
        skims: String(used + 1),
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("[skim pay]", e instanceof Error ? e.message : e);
    return { ok: false, error: "Could not verify payment.", status: 503 };
  }
}

export function publicOrigin(req: { headers: Headers }): string {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
