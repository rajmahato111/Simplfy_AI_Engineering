# Ingest meta-content — review package (T-040–T-043)

> **Branch:** `cursor/ingest-meta-content-42a0`  
> **Scope:** Glossary (99 terms) · Patterns (52) · Question bank (121) from upstream MIT corpus

---

## 1. Architecture (how this follows the platform design)

### 1.1 Data flow

```mermaid
flowchart TB
  subgraph upstream [Upstream MIT corpus]
    GLOSSARY[GLOSSARY.md]
    PATTERNS[PATTERNS.md]
    QB[01-question-bank.md]
  end

  subgraph ingest [Ingest scripts — E11]
    LOCK[data/upstream-lock.json]
    IG[ingest-glossary.ts]
    IP[ingest-patterns.ts]
    IQ[ingest-questions.ts]
    IV[ingest-validate.ts]
  end

  subgraph data [Committed JSON — runtime source]
    GJ[data/glossary.json]
    PJ[data/patterns.json]
    QJ[data/questions.json]
  end

  subgraph lib [Loaders]
    GL[lib/glossary.ts]
    PL[lib/patterns.ts]
    QL[lib/questions.ts]
    SR[lib/search.ts]
  end

  subgraph app [Next.js App Router]
    GP[/glossary]
    PP[/patterns]
    QP[/questions]
    SP[/search]
  end

  LOCK --> IG & IP & IQ
  GLOSSARY --> IG --> GJ --> GL --> GP
  PATTERNS --> IP --> PJ --> PL --> PP
  QB --> IQ --> QJ --> QL --> QP
  GJ & PJ & QJ --> SR --> SP
  GJ & PJ & QJ --> IV
```

### 1.2 Alignment with PRD §6 / §8

| PRD epic | This work |
|----------|-----------|
| **E1 Learn** — glossary, patterns | `/glossary`, `/patterns` backed by real upstream data |
| **E2 Question bank** | 121 structured records with `interviewer_looks_for`, signals, excerpts |
| **E11 Content ops** | Pinned upstream, ingest scripts, manifest validation in CI |
| **Search** | Keyword index includes chapters + questions + glossary terms |

### 1.3 Intentional boundaries

- **MDX chapters** remain Claude Code (`content/**`) — not touched here
- **Full sample answers** stored as excerpts only; full prose stays upstream until editorial review
- **Postgres FTS** still indexes MDX chunks only; meta JSON searched via in-memory keyword index

---

## 2. Code standards checklist

| Standard | Status |
|----------|--------|
| TypeScript strict — `npm run typecheck` | Required in CI |
| ESLint — `npm run lint` | Required in CI |
| Schemas in `lib/*-schema.ts`, loaders in `lib/*.ts` | Done |
| Ingest scripts in `scripts/`, shared utils in `scripts/lib/` | Done |
| No new npm dependencies | Done |
| Attribution — upstream MIT, `source: "upstream"` on records | Done |
| Path locks — no edits to `content/**` | Respected |
| E2E updated for new counts/slugs | Done |

---

## 3. Frontend check-in (automated smoke)

Playwright matrix (run in CI):

| Route | Check |
|-------|-------|
| `/glossary` | 99 terms, RAG term visible, A–Z nav |
| `/patterns` | 52 patterns, Hybrid Search visible |
| `/questions` | 121 questions, filters work |
| `/questions/walk-me-through-…` | Q1 detail, signals + Q1 badge |
| `/search?q=RAG` | Returns chapter and/or question hits |

**Manual browser QA (recommended before merge):** spot-check glossary letter filter, patterns category filter, question topic filter.

---

## 4. Code review summary

### Strengths
- Reproducible ingest via pinned `data/upstream-lock.json`
- Parser handles Q1–Q116 + 5 scenarios; 121 records produced
- Pages are thin — JSON loaders + server components
- CI validates minimum record counts

### Known limitations (acceptable v1)
- `strong_answer_covers` sparse when upstream uses prose-only **Strong answer:**
- Pattern ASCII diagrams not imported (tables only)
- Glossary `chapter_refs` captured but not linked in UI yet
- Question `id` uses parse order, not strictly Q-number for scenarios

### Files changed (summary)
- **Data:** `data/glossary.json`, `data/patterns.json`, `data/questions.json`, `data/upstream-lock.json`
- **Ingest:** `scripts/ingest-*.ts`, `scripts/lib/*`
- **Lib:** `lib/glossary*.ts`, `lib/pattern*.ts`, extended `question-schema`, `search.ts`
- **UI:** `app/glossary`, `app/patterns`, `app/questions/[slug]`, `app/search`
- **CI:** `scripts/ingest-validate.ts`, `data/ingest-manifest.example.json`

---

## 5. Deploy

After merge approver sign-off on this review:

1. Merge PR to `main`
2. CI runs full suite on `main`
3. **Vercel** auto-deploys on push to `main` (if repo connected)
4. Post-deploy smoke: `/glossary`, `/patterns`, `/questions`, `/search?q=hybrid`

Env vars unchanged — meta JSON needs no database.

---

## 6. Re-ingest upstream

```bash
# Bump ref in data/upstream-lock.json, then:
npm run ingest:all
npm run ingest:validate
npm run typecheck && npm run test:e2e
git add data/*.json && git commit -m "chore: refresh meta ingest from upstream"
```
