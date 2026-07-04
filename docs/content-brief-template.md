# Content brief template (T-003)

> Copy this file per batch, fill in the bracketed fields, and attach
> [`content-style-guide.md`](./content-style-guide.md) to every writer agent.
> Orchestrator-only: sub-agents must not commit or push.

---

## Batch metadata

| Field | Value |
|---|---|
| **Batch ID** | `[e.g. T-020-retrieval-cluster]` |
| **Owner** | `[Orchestrator name / agent]` |
| **Target branch** | `cursor/[name]-42a0` or `claude/[name]` |
| **Status** | `planned` / `in-progress` / `in-review` / `merged` |
| **Merge approver** | `@rajmahato111` |

---

## Goal (one paragraph)

`[What this batch ships and why now — tie to PRD pillar or content gap.]`

---

## Deliverables

| # | Path | Type | Notes |
|---|---|---|---|
| 1 | `content/concepts/[area]/[slug].mdx` | concept | `[difficulty, est_minutes]` |
| 2 | `content/concepts/[area]/diagrams/[slug]--[name].svg` | diagram | `[required / optional]` |

**Out of scope for this batch:** `[explicit exclusions to prevent scope creep]`

---

## Reference material (facts only)

- Upstream clone path: `[local path to ai-system-design-guide checkout]`
- Upstream chapters to verify (not copy): `[e.g. 04-rag/01-fundamentals.md]`
- Related in-repo chapters: `[e.g. concepts/retrieval/rag-fundamentals]`
- Related questions: `[e.g. Q1–Q10 RAG Architecture]`

**Attribution:** factual basis only — rewrite in our voice per style guide §2.

---

## Constraints (hard)

- [ ] Follow [`content-style-guide.md`](./content-style-guide.md) section order and word counts
- [ ] All required frontmatter fields + `source_attribution`
- [ ] Every diagram passes `scripts/render-diagram.sh` QC loop
- [ ] No edits outside assigned paths
- [ ] `status: draft` until reviewer approves

---

## Writer checklist (self-QC before handoff)

- [ ] 30-second version stands alone
- [ ] One analogy + mapping table
- [ ] Concrete example with real numbers
- [ ] Tradeoffs table present
- [ ] Interview lens + 2–3 follow-ups
- [ ] Go deeper links (≤4)
- [ ] No copied sentences from upstream

---

## Reviewer checklist

Run against style guide §7. Report **APPROVE** or **FIX REQUIRED** per file with line-level notes.

| File | Verdict | Notes |
|---|---|---|
| | | |

---

## Pre-PR QA

- [ ] `npm run validate:frontmatter`
- [ ] `npm run validate:content`
- [ ] `npm run typecheck && npm run lint && npm run build`
- [ ] `npm run test:e2e` (CI has Postgres)
- [ ] Update [`agent-board.md`](./agent-board.md) when merged

---

## Commit message template

```
[agent] T-XXX: [short description]

- [bullet deliverables]
- Review: APPROVE (reviewer agent / human)
```
