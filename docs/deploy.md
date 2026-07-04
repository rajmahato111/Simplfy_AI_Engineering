# Deploy to Vercel

> Production hosting for the Next.js app. Postgres required for progress, mocks, and Pro status.

## Local `.env`

```bash
npm run setup:env   # copies .env.example → .env with fresh AUTH_SECRET
```

Fill in keys in `.env` (gitignored):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres |
| `AUTH_SECRET` | Auth.js |
| `ANTHROPIC_API_KEY` | LLM tutor, grader, whiteboard critique |
| `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` | Live checkout |
| `STRIPE_WEBHOOK_SECRET` | Grant Pro after payment |
| `PRO_ACCESS=all` | Dev only — skip paywall |

## One-time Vercel setup

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (Production + Preview) — same as `.env.example`.
4. Use **Neon** or **Supabase** for `DATABASE_URL`; run migrations via CI or `npm run db:push` locally against prod once.
5. Deploy. Vercel runs `npm run build` (see `vercel.json`).

## Stripe webhook

Point Stripe webhook to `https://your-domain/api/stripe/webhook` for `checkout.session.completed`. Set `STRIPE_WEBHOOK_SECRET`.

## Pre-deploy checklist

```bash
npm ci
npm run db:push
npm run db:reindex
npm run typecheck
npm run lint
npm run build
npm run validate:frontmatter
npm run validate:content
npm run test:e2e
```

## Custom domain

Vercel → Project → Settings → Domains. Update `NEXT_PUBLIC_SITE_URL` to match.
