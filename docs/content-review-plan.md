# Content review program (T-052+)

> Aligns with [`PRD.md`](./PRD.md) E1/E2, [`content-style-guide.md`](./content-style-guide.md), and [`agent-workflow.md`](./agent-workflow.md).
> **Goal:** every published chapter and question is accurate, original, and correctly labeled.

---

## What went wrong (audit findings, 2026-07-04)

| Layer | Issue | Fix |
|-------|--------|-----|
| **MDX chapters** | Bulk `enhance:mdx` shipped placeholder prose + identical SVGs as `reviewed` | Demoted to `draft`; rewrite to pilot standard (6 done in retrieval) |
| **Metadata** | `est_minutes` / `difficulty` inferred from upstream file size or filename heuristics — not from finished reader text | `npm run sync:mdx-metadata` recomputes from MDX body |
| **Questions** | `difficulty` over-used `intermediate`; only advanced cohort had `cohort` | Re-ingest with topic-aware difficulty map |
| **UI** | Draft chapters looked finished (no status badge) | Show `Draft` badge until `reviewed` / `approved` |
| **Diagrams** | 119 generic `520×100` overview SVGs | Delete on rewrite; hand-author per §6 style guide |

**Pilot quality bar** (do not ship below this): `rag-fundamentals`, `chunking-strategies`, `design-a-production-rag-system`, plus rewritten retrieval siblings in PR #26.

---

## Review phases

### Phase 1 — Inventory & metadata (automated)

```bash
npm run audit:content      # report: status, placeholders, est_minutes drift, diagrams
npm run sync:mdx-metadata  # fix est_minutes on draft MDX from word count
npm run ingest:questions   # refresh question bank + difficulty/cohort
```

### Phase 2 — Section-by-section rewrite (human + writer agent)

Order matches interview prep value and existing pilots:

1. **Retrieval** (06) — 12 chapters remaining + walkthroughs
2. **Agents** (07) — 13 chapters
3. **Interview prep meta** — frameworks, pitfalls, whiteboard (already ingested; prose review)
4. **Foundations → Inference** (01–04)
5. **Prompting, Evals, MLOps, Security, Reliability** (05, 14, 11–13)
6. **Frameworks, Tool use, Voice, Multimodal** (09, 17–19)
7. **Case study walkthroughs** (16) — full SPIDER template per style guide §5

Per chapter checklist (style guide §7):

- [ ] All template sections present, in order
- [ ] Chapter-specific analogy + mapping table
- [ ] Concrete example with real numbers
- [ ] Interview lens: sound bite + 2–3 follow-ups (not pasted upstream Q&A)
- [ ] Hand-authored SVG passes `scripts/render-diagram.sh` QC
- [ ] `grep` originality check — no verbatim upstream sentences
- [ ] `status: reviewed` only after reviewer sign-off

### Phase 3 — Question bank review

For each of 121 questions:

- [ ] `interviewer_looks_for` matches upstream intent
- [ ] `strong_answer_covers` are bullets, not prose dumps
- [ ] `sample_answer_md` is interview-ready (our voice; may start from upstream facts)
- [ ] `difficulty` matches seniority (see parser map in `parse-questions.ts`)
- [ ] `cohort` set for Q50+ only (`2025-12`, `2026-03`, `2026-05`, `2026-06`)
- [ ] `status: approved` only after spot-check of 3 random questions per topic

### Phase 4 — Ship gates

- `npm run validate:frontmatter`
- `npm run validate:content`
- `npm run test:e2e` (content-rendering specs)
- Learn index: only `reviewed`/`approved` chapters promoted to top (optional P1)

---

## Status semantics

| `status` | Meaning in UI |
|----------|----------------|
| `draft` | Scaffold or placeholder — **Draft** badge shown |
| `reviewed` | Passed style-guide review — no badge |
| `approved` | Reviewed + orchestrator sign-off — ready for `main` |

Questions use the same enum; default remains `draft` until Phase 3 completes.

---

## Commands

| Script | Purpose |
|--------|---------|
| `npm run audit:content` | Full quality report (stdout + optional JSON) |
| `npm run sync:mdx-metadata` | Recompute `est_minutes`; optional difficulty sync for drafts |
| `npm run demote:auto-enhanced` | Reset falsely-reviewed placeholder MDX to draft |
| `npm run ingest:questions` | Refresh `data/questions.json` from upstream |
