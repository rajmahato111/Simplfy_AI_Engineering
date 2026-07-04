# Pre-PR testing plan (binding for orchestrators)

> **No PR is raised until every applicable check below passes.**
> The human does not merge — a **reviewer agent** reviews the PR and merges
> after code + browser QA sign-off. Neither orchestrator asks the human to
> merge.

Workflow position:

```
Finish task → automated checks → browser QA → commit + push → open PR → reviewer agent → merge
```

Cross-tool rules: [`dual-tool-coordination.md`](./dual-tool-coordination.md) · Board: [`agent-board.md`](./agent-board.md)

---

## 1. Who runs what

| Role | Runs testing? | Opens PR? | Merges? |
|------|---------------|-----------|---------|
| **Implementing agent** (Claude Code or Cursor) | Yes — full checklist below | Yes — after browser QA passes | No |
| **Reviewer agent** | Re-runs spot checks + browser smoke on PR branch | No | Yes — if checklist + code review pass |
| **Human** | Optional spot-check in desktop browser | No | No (unless emergency) |

---

## 2. Automated checks (always, before browser)

Run from repo root after `npm install` (app tasks) or as noted (content-only tasks).

| Check | Command | Required when |
|-------|---------|---------------|
| Typecheck | `npm run typecheck` | Any TS/Next change |
| Lint | `npm run lint` | Any TS/Next change |
| Production build | `npm run build` | Any TS/Next change |
| Content frontmatter | `node scripts/validate-content.mjs` | Any `content/**` change (when script exists) |
| Diagram QC | `bash scripts/render-diagram.sh <svg>` + visual inspect PNG | Any `*.svg` change |
| Style guide §7 | Reviewer checklist | Any MDX change |

**Fail = fix before browser stage.** Do not open a PR on a broken build.

---

## 3. Browser QA (required for front-end / reader changes)

### 3a. Primary: Cursor native browser MCP (desktop)

When the **Cursor native browser MCP** is available (desktop IDE):

1. Start dev server: `npm run dev` (note port, default 3000).
2. Connect browser MCP to `http://localhost:3000`.
3. Execute the **smoke matrix** (§4) manually in the native browser.
4. Capture screenshots of any failure; fix and re-run until clean.
5. Record in PR body: `Browser QA: Cursor MCP — passed <date>`.

### 3b. Fallback: headless Playwright smoke (cloud / CI)

When browser MCP is **not** available (e.g. cloud agent):

1. Start dev server in background on a fixed port.
2. Run: `node scripts/browser-smoke.mjs --base-url http://127.0.0.1:3000`
3. Script must exit 0. On failure, read console output + saved screenshots under `.qa/` (gitignored).
4. Record in PR body: `Browser QA: Playwright smoke — passed <date>`.

Both paths must hit the **same smoke matrix**. MCP is not a shortcut — same coverage.

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
| C2 | If reader exists | Re-run B3–B6 for changed slugs only |

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
- [ ] Browser smoke matrix (§4) passed — MCP or Playwright
- [ ] Screenshots / notes attached if UI changed
- [ ] agent-board.md updated → `ready_for_review`
```

**Do not @-mention the human to merge.** PR is for the reviewer agent.

---

## 6. Reviewer agent checklist (on PR)

1. Check out PR branch locally or via CI artifact.
2. Re-run §2 automated checks.
3. Re-run `node scripts/browser-smoke.mjs` OR spot-check MCP matrix.
4. Code review: Ponytail (code) / style guide (content) / no Tier A doc drift.
5. If pass → merge to integration branch; update agent-board → `merged`.
6. If fail → `FIX REQUIRED` comment with file/line findings; do not merge.

---

## 7. Recording results on the board

When browser QA completes, add to the task block in `agent-board.md`:

```markdown
**Browser QA:** Playwright smoke passed 2026-07-04 — B1–B8, S1–S5 green
```

Or:

```markdown
**Browser QA:** Cursor MCP passed 2026-07-04 — screenshots in PR #N
```

---

## 8. When browser QA is skipped

Only with explicit human approval in chat, documented on the board:

- Docs-only changes with **zero** UI surface (`docs/*.md` only, no `app/`).
- Pure content MDX with **no** running reader in repo yet *(not the case after T-010)*.

If the reader exists and content changed, run at least C2 before PR.
