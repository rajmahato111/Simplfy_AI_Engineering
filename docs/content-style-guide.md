# Content Style Guide (v1) — binding for all content agents

> Every content sub-agent MUST read this file before producing anything, and the
> Reviewer agent audits against it. Deviations are review failures.
> Product context: [`PRD.md`](./PRD.md) §5–§8. Workflow: [`agent-workflow.md`](./agent-workflow.md).

---

## 1. Mission & voice

We turn AI-engineering knowledge into content a smart engineer **from any background**
can absorb fast — and that prepares them for real interviews (Hello Interview-style).

**Voice:** a confident, friendly coach. Second person ("you"). Short sentences. Active
voice. Zero fluff, zero hype. Every acronym expanded on first use.

**The golden rule:** *analogy first, mechanics second, interview lens always.*

## 2. Originality & attribution (hard rules)

- The MIT-licensed corpus (`ombharatiya/ai-system-design-guide`) is a **factual
  reference only**. Verify facts, numbers, and patterns against it.
- **Never copy sentences or paragraphs** from it. Never lift its analogies or its
  sample-answer prose. Write from understanding, in our voice, with our structure.
- Every content file carries the `source_attribution` frontmatter field and a
  "Go deeper" link to the relevant upstream chapter(s). Root-level attribution lives
  in [`CREDITS.md`](../CREDITS.md).

## 3. File layout & frontmatter

```
content/
  concepts/<area>/<slug>.mdx                 # simplified learning chapters
  concepts/<area>/diagrams/<slug>--<name>.svg
  walkthroughs/<slug>.mdx                    # Hello Interview-style guided breakdowns
  walkthroughs/diagrams/<slug>--<name>.svg
```

Frontmatter (YAML, all fields required unless marked):

```yaml
---
title: "RAG, Explained Simply"
slug: rag-fundamentals
type: concept            # concept | walkthrough
area: retrieval          # retrieval | agents | evals | inference | models | ...
difficulty: beginner     # beginner | intermediate | advanced
tags: [rag, retrieval, vector-search]
diagrams:
  - diagrams/rag-fundamentals--pipeline.svg
est_minutes: 12
source_attribution: "Factual basis: AI System Design Guide (MIT) by Om Bharatiya; rewritten and expanded. See CREDITS.md."
last_reviewed: 2026-07-03
status: draft            # draft | reviewed | approved
---
```

## 4. Concept chapter template (Simplified Learning)

Sections, in order (H2s). Keep chapters 900–1,600 words.

1. **`## The 30-second version`** — 3–5 sentence TL;DR a reader could repeat aloud.
2. **`## The analogy`** — ONE concrete everyday analogy, developed properly (not a
   drive-by simile), followed by a mapping table: analogy element → technical element.
3. **`## How it actually works`** — the mechanics, narrated around the diagram.
   Reference the diagram explicitly ("follow the arrows left to right…").
4. **`## A concrete example`** — small worked example **with real numbers** (e.g., "a
   200-page PDF → ~480 chunks of 512 tokens → 480 embedding calls ≈ $0.01").
5. **`## The tradeoffs that matter`** — a table + short narrative. Tradeoffs are the
   soul of senior interviews; never present a choice without its cost.
6. **`## Where people go wrong`** — 3–5 misconceptions/failure modes, bluntly stated.
7. **`## The interview lens`** — how interviewers probe this topic, one short
   "sound bite" a strong candidate would say, and 2–3 likely follow-up questions.
8. **`## Go deeper`** — links: related concepts, the relevant walkthrough, upstream
   chapter (attribution), at most 4 links.

## 5. Walkthrough template (Hello Interview-style guided breakdown)

A walkthrough simulates the full interview motion for one question, ~35–45 min of
interview time. Sections, in order:

1. **`## The question`** — the prompt verbatim, plus round/level context.
2. **`## What the interviewer is actually testing`** — the hidden rubric, 4–6 bullets.
3. **`## Step 1 — Clarify and scope (≈5 min)`** — sample candidate↔interviewer
   dialogue (4–6 clarifying questions with the interviewer's answers, formatted as a
   short script).
4. **`## Step 2 — Requirements (≈3 min)`** — functional + non-functional, prioritized;
   an explicit "out of scope" line.
5. **`## Step 3 — Core entities and API (≈4 min)`** — the data objects and 2–4 API
   sketches (concise, realistic).
6. **`## Step 4 — High-level design (≈10 min)`** — THE architecture diagram + a
   "60-second narration" script of how you'd talk through it at the whiteboard.
7. **`## Step 5 — Deep dives (≈15 min)`** — 2–3 areas. Each: *why the interviewer
   probes here* → *the strong move* → *tradeoff table* → *likely follow-up*.
8. **`## Step 6 — Evals, reliability, and scale (≈5 min)`** — never skip; this is the
   AI-specific differentiator (eval strategy, failure modes, cost/latency).
9. **`## The bar`** — table: what a mid-level vs senior vs staff answer looks like.
10. **`## Pitfalls that sink candidates`** — specific and brutal.
11. **`## Rapid-fire follow-ups`** — 5–8 self-test questions (no answers).

## 6. Diagram spec (SVG) — professional or it doesn't ship

Diagrams are hand-authored SVG committed next to the content. No screenshots of other
tools, no ASCII art in final content.

### Canvas
- Root: `<svg xmlns="http://www.w3.org/2000/svg" width="W" height="H" viewBox="0 0 W H" font-family="system-ui, -apple-system, 'Segoe UI', 'DejaVu Sans', sans-serif">`
  — **integer** W/H, max width 1200.
- First element: white background `<rect width="W" height="H" fill="#ffffff"/>`.
- 24px padding on all sides; all coordinates on an **8px grid**.
- Title: 16px, weight 600, `#0F172A`, centered near the top (when the diagram needs one).

### Nodes
- `<rect rx="10">`, stroke-width 1.5, min size 120×48. Keep ≥16px between text and box
  edge (DejaVu is wide — if it fits in QC it fits in production fonts).
- Labels: 14px, `text-anchor="middle"`, vertically centered (baseline ≈ center + 5);
  ≤3 words per line, wrap with `tspan`.
- **Palette by role** (use these exact values):

| Role | Fill | Stroke | Text |
|---|---|---|---|
| User / client / external | `#FFF7ED` | `#EA580C` | `#7C2D12` |
| Service / process | `#EEF2FF` | `#4F46E5` | `#1E1B4B` |
| LLM / AI component | `#F5F3FF` | `#7C3AED` | `#2E1065` |
| Data store / index | `#ECFDF5` | `#059669` | `#064E3B` |
| Queue / pipeline stage | `#FEFCE8` | `#CA8A04` | `#713F12` |
| Guardrail / security | `#FEF2F2` | `#DC2626` | `#7F1D1D` |
| Neutral / note | `#F8FAFC` | `#64748B` | `#334155` |

### Arrows
- Single marker def, used everywhere:
  ```xml
  <defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
    orient="auto" markerUnits="userSpaceOnUse">
    <path d="M0,0 L9,4.5 L0,9 z" fill="#475569"/></marker></defs>
  ```
- Lines: stroke `#475569`, width 1.5, `marker-end="url(#arrow)"`.
- **Orthogonal only** (horizontal/vertical segments; one L-bend max per arrow, drawn as
  a `<polyline fill="none">`). Arrows leave/enter at **edge midpoints**; end lines 2px
  before the target edge so the arrowhead tip lands on it. Arrows never cross nodes.
- Arrow labels: 12px `#475569`, with a white backing rect behind the text.

### Layout
- Main flow **left → right** (top → bottom only for layered stacks).
- Min gaps: 64px between columns, 32px between rows. Align box centers per row/column.
- Group related nodes with containers: dashed `#CBD5E1` rounded rect + 12px caption
  (`#64748B`) at top-left (e.g., "Ingestion pipeline", "Query path").
- Plan coordinates BEFORE writing the SVG: put a coordinate table in an XML comment at
  the top of the file. This is what keeps arrows perfectly aligned.

### Mandatory visual QC loop (no exceptions)
1. Render: `bash scripts/render-diagram.sh <file>.svg` (produces `<file>.qc.png`;
   handles a headless-Chromium truncation bug — never screenshot small windows directly).
2. **View the PNG with the Read tool.** Actually look at it.
3. Check: arrowheads touch target edges · nothing overlaps · no text overflow ·
   consistent spacing/alignment · palette respected · reads left-to-right.
4. Fix and re-render until clean. `.qc.png` files are gitignored — never commit them.

## 7. Review checklist (Reviewer agent)

- [ ] Frontmatter valid and complete; paths in `diagrams:` exist.
- [ ] Template sections present, in order, correctly named.
- [ ] **Originality:** pick 3 distinctive phrases per file, `grep -ri` them in the source
      corpus — zero verbatim hits allowed.
- [ ] **Technical correctness:** claims/numbers spot-checked against the corpus.
- [ ] Analogy test: would a backend engineer with zero AI exposure get it?
- [ ] Interview realism: dialogue/bar/pitfalls match how loops actually run (corpus
      `00-interview-prep/` is the reference).
- [ ] **Diagrams:** re-render every SVG yourself, view the PNG, verify against §6. Do
      not trust the author agent's claim.
- [ ] Tone: no hype, no filler, acronyms expanded, sentences short.

Verdict per file: **APPROVE** or **FIX REQUIRED** with a concrete, file-and-line-level
finding list.
