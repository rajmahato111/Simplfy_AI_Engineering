# Agent board — live task ledger

> **Read this at every session start.** No agent edits a path unless it is
> listed under their active task with an open lock. **Shipping branch: `main`.**
> Only the merge approver merges — see [`pr-merge-governance.md`](./pr-merge-governance.md).

Coordination rules: [`dual-tool-coordination.md`](./dual-tool-coordination.md)

---

## Active tasks

| ID | Tool | Branch | Status | Paths (locks) |
|----|------|--------|--------|---------------|
| T-001 | Claude Code | `claude/ai-interview-platform-prd-4si5f9` | `in_progress` | `content/concepts/retrieval/**`, `content/walkthroughs/design-a-production-rag-system.mdx`, `content/walkthroughs/diagrams/design-a-production-rag-system--architecture.svg` |

---

## Task details

### T-001 — Claude Code — in_progress

**Requirement:** Close pilot RAG content batch.

**Do not touch (Cursor / others):** entire retrieval pilot cluster (see paths above).

**Done when:**

- [ ] `chunking-strategies--comparison.svg` passes style guide §6 QC
- [ ] Reviewer pass on all 3 MDX + 3 SVG files
- [ ] `status: draft → reviewed` in frontmatter
- [ ] Committed and pushed to `main` (or integration branch until rebased)

**Progress:** Chunking comparison diagram QC in progress (see commit `1e674a6`).

---

## Queued (unclaimed)

| ID | Tool | Task | Blocked by |
|----|------|------|------------|
| T-003 | Claude Code | Content brief template (`docs/briefs/`) | — |
| T-020–T-022 | Claude Code | RAG cluster expansion (hybrid search, reranking, embeddings) | T-001 merge |
| T-030–T-032 | Claude Code | Agents content batch | — (disjoint paths) |

---

## Blocked / questions

*(none)*

---

## Recently merged

| ID | PR | Merged to `main` | Notes |
|----|-----|------------------|-------|
| T-002 | #5 | 2026-07-04 | Agent coordination |
| T-010 | #5 | 2026-07-04 | Next.js reader skeleton + CI + Playwright |
| T-012 | #5 | 2026-07-04 | Hello Interview UI + content render QA |
| T-011 | #5 | 2026-07-04 | Frontmatter schema |
| T-051 | #5 | 2026-07-04 | Frontmatter validator |

**Merge:** PR #5 merged to `main` 2026-07-04 by merge approver (@rajmahato111).

**Branch cleanup:** All `cursor/*-42a0` shipping branches deleted from remote.

**Superseded drafts:** PRs #1–#4 may still show as open on GitHub — close manually if needed.
