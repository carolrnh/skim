import Stripe from "stripe";
import { SKIM_PRICE_USD, SKIMS_PER_PAYMENT } from "./site";

export { SKIMS_PER_PAYMENT };
export const SKIM_PRICE_CENTS = SKIM_PRICE_USD * 100;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }
  return new Stripe(key);
}

export type PaidSession =
  | { ok: true; id: string; used: number; remaining: number }
  | { ok: false; error: string; status: number };

function usedCount(raw: string | undefined) {
  const used = Number(raw || 0);
  if (!Number.isFinite(used) || used < 0) return 0;
  return Math.floor(used);
}

export async function readPaidSession(sessionId: string): Promise<PaidSession> {
  if (!sessionId.startsWith("cs_")) {
    return {
      ok: false,
      error: `Pay $${SKIM_PRICE_USD} first to run a skim.`,
      status: 402,
    };
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
    const used = usedCount(session.metadata?.skims);
    return {
      ok: true,
      id: session.id,
      used,
      remaining: Math.max(0, SKIMS_PER_PAYMENT - used),
    };
  } catch (e) {
    console.error("[skim pay]", e instanceof Error ? e.message : e);
    return { ok: false, error: "Could not verify payment.", status: 503 };
  }
}

export async function consumePaidSession(sessionId: string): Promise<PaidSession> {
  const state = await readPaidSession(sessionId);
  if (!state.ok) return state;
  if (state.remaining <= 0) {
    return {
      ok: false,
      error: `This $${SKIM_PRICE_USD} already covered ${SKIMS_PER_PAYMENT} skims. Pay again for another document.`,
      status: 402,
    };
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const used = usedCount(session.metadata?.skims);
    if (used >= SKIMS_PER_PAYMENT) {
      return {
        ok: false,
        error: `This $${SKIM_PRICE_USD} already covered ${SKIMS_PER_PAYMENT} skims. Pay again for another document.`,
        status: 402,
      };
    }
    const next = used + 1;
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        product: "skim",
        skims: String(next),
      },
    });
    return {
      ok: true,
      id: session.id,
      used: next,
      remaining: Math.max(0, SKIMS_PER_PAYMENT - next),
    };
  } catch (e) {
    console.error("[skim pay]", e instanceof Error ? e.message : e);
    return { ok: false, error: "Could not verify payment.", status: 503 };
  }
}

export function publicOrigin(req: { headers: Headers }): string {
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "";
  if (host) {
    const proto =
      req.headers.get("x-forwarded-proto") ||
      (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host.split(",")[0].trim()}`;
  }
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/$/, "");
  if (/^https?:\/\/[a-z0-9.-]+/i.test(fromEnv)) return fromEnv;
  return "https://skim-nine.vercel.app";
}
