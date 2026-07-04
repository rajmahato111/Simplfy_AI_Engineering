# Pre-PR testing plan (binding for orchestrators)

> **No PR is raised until every applicable check below passes.**
> **Only the merge approver (senior/lead engineer) merges to `main`.**
> Implementing agents and reviewer agents prepare PRs and audits; they do not merge.
> See [`pr-merge-governance.md`](./pr-merge-governance.md).

Workflow position:

```
Finish task → automated checks → Cursor Browser QA → commit + push → open PR (base: main)
    → optional reviewer-agent audit → merge approver review → merge to main
```

Cross-tool rules: [`dual-tool-coordination.md`](./dual-tool-coordination.md) · Board: [`agent-board.md`](./agent-board.md)

---

## 1. Who runs what

| Role | Runs testing? | Opens PR? | Merges to `main`? |
|------|---------------|-----------|-------------------|
| **Implementing agent** (Claude Code or Cursor) | Yes — full checklist below | Yes — **only after pre-PR checks pass** | **Never** |
| **Reviewer agent** (optional) | Re-runs §2 + Browser spot-check | No | **Never** |
| **Merge approver** (senior/lead engineer — human) | Final review + spot-check | No | **Yes — only role that merges** |

**Merge approver** is the designated senior/lead engineer (see [`pr-merge-governance.md`](./pr-merge-governance.md)).
Agents do not install dependencies or substitute test runners without explicit human approval in chat.

---

## 2. Automated checks (always, before browser)

Run from repo root after `npm install` (app tasks) or as noted (content-only tasks).

| Check | Command | Required when |
|-------|---------|---------------|
| Typecheck | `npm run typecheck` | Any TS/Next change |
| Lint | `npm run lint` | Any TS/Next change |
| Production build | `npm run build` | Any TS/Next change |
| **Playwright E2E** | `npm run test:e2e` | Any `app/**`, `e2e/**`, or reader-affecting change |
| Content frontmatter | `node scripts/validate-content.mjs` | Any `content/**` change (when script exists) |
| Diagram QC | `bash scripts/render-diagram.sh <svg>` + visual inspect PNG | Any `*.svg` change |
| Style guide §7 | Reviewer checklist | Any MDX change |

**Fail = fix before browser stage.** Do not open a PR on a broken build.

When you add or change front-end behavior, **add or update Playwright tests** in
`e2e/` in the same task. CI runs `npm run test:e2e` on every PR (see
`.github/workflows/ci.yml`).

---

## 3. Browser QA (required for front-end / reader changes)

### 3a. Primary — Cursor built-in Browser (required)

Use **Cursor Browser Automation** — the built-in browser pane (globe icon) that loads
`localhost`. This is the default and required pre-PR gate for any task that touches
`app/**` or the reader.

**Setup (human verifies once per machine):**

- Cursor **Settings → Tools & MCP → Browser Automation** enabled
- Dev server running: `npm run dev` (default port 3000)

**Implementing agent steps:**

1. Add **`@Browser`** to agent context (or open the browser pane).
2. Navigate to `http://localhost:3000`.
3. Execute the **smoke matrix** (§4) — click through routes, verify content, check diagram loads.
4. Fix failures; re-run until clean.
5. Record on board + PR: `Browser QA: Cursor Browser — passed <date>` (note any screenshots).

**Reviewer agent:** re-run the same matrix on the PR branch; post APPROVE / FIX REQUIRED — do not merge.

**Merge approver:** review PR + CI; merge to `main` when satisfied.

### 3b. Cloud / headless sessions (no Browser in tool catalog)

If the agent session **does not expose Browser tools** (e.g. some cloud runs):

1. Complete §2 automated checks.
2. Commit + push to the task branch.
3. Set board status → **`ready_for_browser_qa`** (not `ready_for_review`).
4. **Do not open a PR** until Cursor Browser QA is completed in a desktop session
   (implementing or reviewer agent with `@Browser`).
5. Ask the human only if blocked — do not assume a fallback runner.

### 3c. Playwright E2E (required — local + CI)

Frontend automation lives in **`e2e/`** using `@playwright/test`. Implementing
agents **write or update tests alongside app code** for any UI/route change.

**Local (before PR):**

```bash
npm run test:e2e          # headless; starts production server via playwright.config.ts
npm run test:e2e:ui       # optional interactive runner
```

**CI:** GitHub Actions runs `npm run test:e2e` after typecheck/lint (Chromium +
mobile-chrome projects).

Tests must cover the same smoke matrix as §4 (or a focused subset when the task
touches only specific routes — never leave changed routes untested).

Record on board + PR: `Playwright E2E: passed locally <date>` when run before PR.

---

## 4. Smoke matrix (minimum)

Adapt rows to the task; **never skip rows that touch changed routes**.

### App shell (T-010+)

| # | Action | Pass criteria |
|---|--------|---------------|
| B1 | Load `/` | Title visible; primary CTA links to `/learn`; nav shows all PRD items |
| B2 | Click each nav link | Route resolves (200); no console errors |
| B3 | Load `/learn` | Lists every committed MDX slug; links clickable |
| B4 | Open each MDX route | Title + body render; no MDX compile error page |
| B5 | MDX with diagram | Image loads (200); visible width > 0 |
| B6 | Internal MDX link | Click `.mdx` link → correct `/learn/...` page |
| B7 | `/credits` | CREDITS content visible |
| B8 | Unknown route | 404, not 500 |

### Content-only tasks (no app change)

| # | Action | Pass criteria |
|---|--------|---------------|
| C1 | Render diagram QC PNG | Style guide §6 visual check |
| C2 | If reader exists | Re-run B3–B6 for changed slugs in Cursor Browser |

### Stress / regression (before PR on reader changes)

| # | Action | Pass criteria |
|---|--------|---------------|
| S1 | Hard refresh on deepest `/learn/...` slug | Still 200 |
| S2 | Open 3 learn pages in sequence (cold navigation) | No hydration/console errors |
| S3 | Resize viewport 375px wide | Nav usable; prose not overflowing |
| S4 | Resize viewport 1280px wide | Layout intact |
| S5 | Request invalid asset URL | 404, not 500 |

---

## 5. PR gate checklist (implementing agent)

Copy into PR description; all boxes must be true before opening/updating PR:

```markdown
## Pre-PR testing

- [ ] Task ID(s) on agent-board: T-___
- [ ] Path locks respected; no edits outside assignment
- [ ] `npm run typecheck` passed
- [ ] `npm run lint` passed
- [ ] `npm run build` passed
- [ ] `npm run test:e2e` passed (or CI green on PR)
- [ ] Playwright tests added/updated for changed routes
- [ ] Browser smoke matrix (§4) passed in **Cursor Browser** (@Browser)
- [ ] Screenshots / notes attached if UI changed
- [ ] agent-board.md updated → `ready_for_review`
- [ ] PR targets **`main`** (see pr-merge-governance.md)
```

**Do not merge.** PR is for the merge approver.

---

## 6. Reviewer agent checklist (on PR)

1. Check out PR branch.
2. Re-run §2 automated checks (including `npm run test:e2e`).
3. Re-run smoke matrix (§4) in **Cursor Browser** (`@Browser`) if UI/content changed.
4. Code review: Ponytail (code) / style guide (content) / no Tier A doc drift.
5. Post review comment: **APPROVE** or **FIX REQUIRED** with file/line findings.
6. **Do not merge** — hand off to merge approver per [`pr-merge-governance.md`](./pr-merge-governance.md).

---

## 7. Merge approver checklist (human — only role that merges)

1. Confirm CI green on the PR.
2. Read reviewer-agent findings (if any) and PR description.
3. Spot-check changed routes in Browser or locally when UI/content changed.
4. Merge to **`main`** (squash recommended).
5. Update agent-board → **Recently merged**; note `merged to main <date>`.

Playwright re-run is required in CI; approver may re-run locally if CI is pending.

---

## 8. Recording results on the board

When browser QA completes, add to the task block in `agent-board.md`:

```markdown
**Browser QA:** Cursor Browser passed 2026-07-04 — B1–B8, S1–S5 green (@Browser)
```

```markdown
**Playwright E2E:** passed locally 2026-07-04 — npm run test:e2e green
```

If waiting on desktop Browser from a cloud session:

```markdown
**Browser QA:** pending — status ready_for_browser_qa; §2 automated checks passed
```

When the merge approver merges:

```markdown
**Merge:** merged to main 2026-07-04 by @rajmahato111 — PR #N
```

---

## 9. When browser QA is skipped

Only with **explicit human approval** in chat, documented on the board:

- Docs-only changes with **zero** UI surface (`docs/*.md` only, no `app/`).
- Other exceptions the human defines.

If the reader exists and content changed, run at least C2 in Cursor Browser before PR.
