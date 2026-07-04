# Content render QA

> How we verify that MDX **tables**, **diagrams**, and **images** render correctly
> in the reader — the manual QA loop, automated.

Pairs with diagram SVG QC in [content-style-guide.md](./content-style-guide.md) §6.
Workflow: [pre-pr-testing.md](./pre-pr-testing.md).

---

## The problem

Content authors write Markdown tables and reference diagrams in frontmatter. The reader
must:

1. Parse **GFM tables** into HTML `<table>` (not flat paragraph text).
2. Show **every declared diagram** — either embedded in the MDX body or injected from
   `frontmatter.diagrams` at render time.
3. Resolve **image paths** relative to the MDX file directory.

When any of these fail, the page looks broken even though the source MDX is fine.

---

## Two-layer QA (like manual review)

| Layer | What it checks | Command |
|-------|----------------|---------|
| **Static** | Files exist, refs valid, table/image inventory | `npm run validate:content` |
| **Rendered** | Live page has `<table>` count + visible `<img>` | `npm run test:e2e` (includes `content-rendering.spec.ts`) |

Run both before opening a PR that touches `content/**` or reader code.

---

## Static QA — `npm run validate:content`

Script: [`scripts/content-render-qc.ts`](../scripts/content-render-qc.ts)  
Library: [`lib/content-audit.ts`](../lib/content-audit.ts)

Per MDX file it reports:

- **`markdownTables`** — pipe tables in source (must match rendered `<table>` count).
- **`frontmatterDiagrams`** — paths from YAML `diagrams:`.
- **`bodyImageRefs`** — `![](...)` in the body.
- **`expectedRenderedImages`** — union of body refs + frontmatter diagrams not already in body.
- **Failures:** missing diagram files, broken image paths.

```bash
npm run validate:content
npm run validate:content -- --json   # machine-readable report
```

---

## Rendered QA — Playwright

Spec: [`e2e/content-rendering.spec.ts`](../e2e/content-rendering.spec.ts)

For **each** content slug, on the live reader page:

1. `article table` count equals `markdownTables` from the audit.
2. Each `expectedRenderedImages` entry is visible with width > 100px.

Included in `npm run test:e2e` (CI).

---

## Optional visual QA (human or Cursor Browser)

Same motion as diagram PNG QC, but for full pages:

1. `npm run dev`
2. Open each `/learn/...` route in **Cursor Browser** (`@Browser`).
3. Scroll every section with a table — confirm columns align, horizontal scroll on mobile.
4. Confirm every diagram is visible where the prose references it.

Record on the agent board:

```markdown
**Content render QA:** validate:content pass · e2e content-rendering pass · @Browser spot-check <date>
```

---

## When to run

| Change | Static | Rendered e2e | Browser spot-check |
|--------|--------|----------------|-------------------|
| New/edited MDX | Required | Required | Required for new chapters |
| Reader / MDX pipeline | Required | Required | Spot-check one table + one diagram page |
| SVG only (no MDX) | Diagram QC §6 | If referenced in MDX | Optional |

---

## Reviewer checklist (add to §7)

- [ ] `npm run validate:content` passes
- [ ] `content-rendering` e2e tests pass
- [ ] Tables readable (not pipe text); diagrams visible on concept + walkthrough samples
