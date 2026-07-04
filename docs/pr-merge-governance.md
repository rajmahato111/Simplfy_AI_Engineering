# PR merge governance

> **Binding for all agents and humans.** No feature work proceeds until the
> current PR stack is reviewed and merged to `main`.

Related: [`pre-pr-testing.md`](./pre-pr-testing.md) · [`agent-board.md`](./agent-board.md)

---

## Who merges

| Role | Opens PR? | Reviews? | Merges to `main`? |
|------|-----------|----------|-------------------|
| **Implementing agent** (Claude Code, Cursor) | Yes — after pre-PR checks | No | **Never** |
| **Reviewer agent** (optional) | No | Yes — code + checklist audit | **Never** (unless human explicitly delegates merge in chat) |
| **Merge approver** (senior / lead engineer — human) | No | Yes — final authority | **Yes — only this role** |

The **merge approver** is the project's designated senior or lead software engineer
(owner: [`PRD.md`](./PRD.md)). Today that is the repo owner (`@rajmahato111`). Add
co-approvers in [`.github/CODEOWNERS`](../.github/CODEOWNERS) when the team grows.

Agents **must not** merge PRs, push to `main`, or ask the merge approver to merge
until automated checks and the pre-PR checklist are complete. The approver merges
after their own review — not on agent request alone.

---

## Target branch

All shipping PRs target **`main`**.

The branch `claude/ai-interview-platform-prd-4si5f9` was a temporary integration
branch during early bootstrap. **Retire it** once open PRs land on `main`. New PRs
must use `main` as `base_branch`.

---

## End-to-end flow

```
Implement → automated checks → Browser QA → open PR (base: main)
    → optional reviewer-agent audit → merge approver review → merge to main
    → update agent-board → next feature may start
```

### 1. Implementing agent (before PR)

Complete every applicable item in [`pre-pr-testing.md`](./pre-pr-testing.md):

- CI checks green locally (`typecheck`, `lint`, `build`, `test:e2e`, content validators)
- Playwright tests added/updated for changed routes
- Cursor Browser smoke matrix where applicable
- Agent board task → `ready_for_review`

Open a **draft PR** targeting `main`. Do not stack new feature branches on unmerged work
unless the human approves an exception on the board.

### 2. Reviewer agent (optional, recommended)

A separate agent session may:

- Re-run automated checks on the PR branch
- Run the smoke matrix in Cursor Browser
- Audit code (Ponytail) or content (style guide §7)
- Post a structured review: **APPROVE** or **FIX REQUIRED** with file/line findings

The reviewer agent **does not merge**. Findings go to the merge approver.

### 3. Merge approver (required)

The human merge approver:

1. Reads the PR description and reviewer findings (if any)
2. Spot-checks the app in Browser or locally if UI/content changed
3. Confirms CI is green on the PR
4. **Merges to `main`** (squash or merge commit — team preference; default: squash)
5. Records on the agent board: `merged to main <date> by <approver>`

If the approver requests changes, the implementing agent fixes and re-requests review.
**Do not start unrelated feature work while fixes are pending.**

---

## Hard gate — no parallel features on unmerged work

> **Rule:** Do not claim or start a new feature task until every PR that the
> current work depends on is **merged to `main`**.

| Situation | Allowed? |
|-----------|----------|
| Fix comments on an open PR for your task | Yes |
| Open a stacked PR on top of another open PR | Only with human approval on the board |
| Start T-011 while T-010 PR is still open | **No** — wait for merge to `main` |
| Claude Code content batch while app PRs unmerged | Yes **only if** paths are disjoint and human approved |

When a PR merges, update [`agent-board.md`](./agent-board.md) → **Recently merged**
and clear the task from **Active tasks**.

---

## GitHub settings (merge approver configures once)

Enable on the `main` branch in GitHub **Settings → Branches → Branch protection**:

- [ ] Require a pull request before merging
- [ ] Require approvals: **1** (merge approver or CODEOWNERS)
- [ ] Require status checks: CI workflow (`check`)
- [ ] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings
- [ ] Restrict who can push to `main` (merge approvers only)

[`.github/CODEOWNERS`](../.github/CODEOWNERS) routes review requests to the merge approver.

---

## Current open PRs (bootstrap stack)

Merge **in order** after human review (oldest/foundation first):

| Order | PR | Branch | Merge approver action |
|-------|-----|--------|------------------------|
| 1 | Foundation + coordination | `cursor/coordination-and-foundation-42a0` | Review → merge to `main` |
| 2 | Hello Interview UI | `cursor/hello-interview-ui-42a0` | Rebase on `main` if needed → review → merge |
| 3 | Content render QA | `cursor/content-render-qa-42a0` | Rebase on `main` → review → merge |
| 4 | Frontmatter schema | `cursor/content-schema-42a0` | Rebase on `main` → review → merge |

After PR #5 merges to `main`, delete these remote branches (local copies too):

```bash
git checkout main && git pull origin main
git push origin --delete \
  cursor/coordination-and-foundation-42a0 \
  cursor/hello-interview-ui-42a0 \
  cursor/content-render-qa-42a0 \
  cursor/content-schema-42a0 \
  cursor/pr-merge-governance-42a0 \
  cursor/shipping-bootstrap-42a0
git branch -D cursor/coordination-and-foundation-42a0 cursor/hello-interview-ui-42a0 \
  cursor/content-render-qa-42a0 cursor/content-schema-42a0 cursor/pr-merge-governance-42a0 \
  cursor/shipping-bootstrap-42a0 2>/dev/null || true
```

Close superseded draft PRs #1–#4 on GitHub after merge.

---

## Recording merges

Add to the task block in `agent-board.md`:

```markdown
**Merge:** merged to main 2026-07-04 by @rajmahato111 — PR #N
```

Move the task to **Recently merged**.
