# Deploy to Vercel

> Production hosting for the Next.js app. Content ships as MDX in the repo — no DB required for the reader MVP.

## One-time setup

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Root directory: `.` (default).
4. Add environment variables (Production + Preview):

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://your-app.vercel.app` |
| `AUTH_SECRET` | Yes (auth) | `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | Optional OAuth | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | Optional OAuth | GitHub OAuth app secret |

5. Deploy. Vercel runs `npm run build` (see `vercel.json`).

## Git integration

Every push to `main` triggers a production deploy. Pull requests get preview URLs automatically.

## Pre-deploy checklist

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run validate:frontmatter
npm run validate:content
npm run test:e2e
```

## Custom domain

Vercel → Project → Settings → Domains. Update `NEXT_PUBLIC_SITE_URL` to match.
