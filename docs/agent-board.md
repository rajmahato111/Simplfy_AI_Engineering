# Agent board — live task ledger

> **Read this at every session start.** Shipping branch: **`main`**.

---

## Active tasks

| ID | Tool | Branch | Status | Paths (locks) |
|----|------|--------|--------|---------------|
| T-001 | Claude Code | `claude/ai-interview-platform-prd-4si5f9` | `ready_for_browser_qa` | `content/concepts/retrieval/**`, walkthrough pilot |

**T-001 notes (2026-07-04):** pilot batch written by 2 writer sub-agents, audited by
reviewer agent (12 findings), all fixes applied, diagrams re-rendered + visually
verified. `validate:frontmatter` ✓ · `validate:content` ✓ · diagram QC ✓. Cloud
session — no Cursor Browser available, so per pre-pr-testing §3b the smoke matrix is
pending; draft PR opened for merge-approver visibility. Style-guide amendments
proposed in PR body (file is human-approval-only).

---

## Recently merged (Cursor priorities P1–P5 + tiers)

| PR | Task | Merged |
|----|------|--------|
| #7 | P1 Vercel deploy readiness | 2026-07-04 |
| #8 | P2 Reader polish (prev/next, SEO, sitemap) | 2026-07-04 |
| #9 | P3 Auth skeleton | 2026-07-04 |
| #10 | P4 Search | 2026-07-04 |
| #11 | P5 Question bank shell | 2026-07-04 |
| #12 | Tier 1: Postgres progress, question detail, landing polish | 2026-07-04 |
| #13 | Tier 2: Ingest validate, Postgres FTS search, glossary/patterns | 2026-07-04 |
| #14 | Tier 3: SPIDER practice, tutor chat shell, Stripe checkout stub | 2026-07-04 |

---

## Queued

| ID | Tool | Task |
|----|------|------|
| T-003 | Claude Code | Content brief template |
| T-020–T-022 | Claude Code | RAG cluster expansion |
| T-030–T-032 | Claude Code | Agents content batch |
