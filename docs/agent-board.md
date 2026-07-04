# Agent board — live task ledger

> **Read this at every session start.** No agent edits a path unless it is
> listed under their active task with an open lock. Integration branch:
> `claude/ai-interview-platform-prd-4si5f9` (until promoted to `main`).

Coordination rules: [`dual-tool-coordination.md`](./dual-tool-coordination.md)

---

## Active tasks

| ID | Tool | Branch | Status | Paths (locks) |
|----|------|--------|--------|---------------|
| T-001 | Claude Code | `claude/ai-interview-platform-prd-4si5f9` | `in_progress` | `content/concepts/retrieval/**`, `content/walkthroughs/design-a-production-rag-system.mdx`, `content/walkthroughs/diagrams/design-a-production-rag-system--architecture.svg` |
| T-002 | Cursor | `cursor/coordination-and-foundation-42a0` | `ready_for_review` | `docs/agent-board.md`, `docs/dual-tool-coordination.md`, `AGENTS.md`, `docs/pre-pr-testing.md` |
| T-010 | Cursor | `cursor/coordination-and-foundation-42a0` | `ready_for_review` | `app/**`, `components/**`, `lib/**`, `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.github/workflows/ci.yml` |

---

## Task details

### T-001 — Claude Code — in_progress

**Requirement:** Close pilot RAG content batch.

**Do not touch (Cursor / others):** entire retrieval pilot cluster (see paths above).

**Done when:**

- [ ] `chunking-strategies--comparison.svg` passes style guide §6 QC
- [ ] Reviewer pass on all 3 MDX + 3 SVG files
- [ ] `status: draft → reviewed` in frontmatter
- [ ] Committed and pushed to integration branch

**Progress:** Chunking comparison diagram QC in progress (see commit `1e674a6`).

---

### T-002 — Cursor — ready_for_review

**Requirement:** Add cross-tool coordination files so Claude Code and Cursor share one assignment ledger.

**Do not touch:** `content/**`, Tier A docs (`PRD.md`, `content-style-guide.md`, `source-analysis.md`, `CREDITS.md`).

**Done when:**

- [x] `docs/agent-board.md` (this file)
- [x] `docs/dual-tool-coordination.md`
- [x] `AGENTS.md` at repo root
- [x] Committed and pushed

---

### T-010 — Cursor — ready_for_review

**Requirement:** P0 app skeleton per PRD §10 — Next.js App Router, TypeScript, Tailwind, basic IA shell.

**Do not touch:** existing MDX/SVG under `content/` (read-only for the reader).

**Done when:**

- [x] `npm run dev` / `npm run build` runs
- [x] Landing page with PRD top-level nav stubs
- [x] `/learn/[...slug]` renders MDX from `content/` without modifying source files
- [x] Ponytail-minimal; CI typecheck + lint stub
- [x] Committed and pushed

**Playwright E2E:** passed locally 2026-07-04 — 40/40 tests (chromium + mobile-chrome)

**Browser QA:** pending Cursor Browser (@Browser) re-verify before reviewer merge

---

## Queued (unclaimed)

| ID | Tool | Task | Blocked by |
|----|------|------|------------|
| T-003 | Claude Code | Content brief template (`docs/briefs/`) | — |
| T-011 | Cursor | Content schema types (`lib/content-schema.ts`) | T-010 |
| T-020–T-022 | Claude Code | RAG cluster expansion (hybrid search, reranking, embeddings) | T-001 merge |
| T-030–T-032 | Claude Code | Agents content batch | — (disjoint paths) |
| T-051 | Cursor | MDX frontmatter validator script | T-010 |

---

## Blocked / questions

*(none)*

---

## Recently merged

*(none yet)*
