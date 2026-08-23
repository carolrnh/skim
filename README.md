# Skim

Upload a PDF or paste a lease, contractor quote, or ToS. Get **5 red flags**, a **rewrite** of each, and a **reply to send back**. **$9 per check.**

This is a new product. It is **not** Forge. No social posts, no 5-platform drafts.

## Why it can make money

People already pay lawyers and “just sign.” Chat is free but you still have to prompt it into flags, a rewrite, and a sendable reply. Skim is that finished report. $9 is an impulse buy the moment they have a PDF. TikTok: screenshot a lease, overlay 3 flags.

## Stack

- Next.js
- Grok (`XAI_API_KEY` → `https://api.x.ai/v1`, model `grok-4.5`)
- Stripe Checkout: **$9** per payment, up to **3 skims**

## Run

```bash
cd /Users/hermes/.openclaw/workspace/skim
cp .env.example .env.local
# XAI_API_KEY=...
# STRIPE_SECRET_KEY=sk_test_...   (or sk_live_...)
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev
```

Open http://localhost:3000

## Not this

- Not legal advice
- Not Forge
- Not a subscription until someone has paid for a single check
