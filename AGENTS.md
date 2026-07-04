# Agent instructions — Simplify AI Engineering

> Read at **every session start** (Claude Code and Cursor). GitHub is the only
> source of truth for this project.

## 1. Coordination

1. Read [`docs/agent-board.md`](docs/agent-board.md) — do not edit locked paths.
2. Read [`docs/dual-tool-coordination.md`](docs/dual-tool-coordination.md) for branch and lock rules.
3. Update the board while working; commit messages: `[claude] T-00N:` or `[cursor] T-00N:`.
4. **Before opening a PR:** complete [`docs/pre-pr-testing.md`](docs/pre-pr-testing.md) — automated checks + **Cursor Browser** QA (`@Browser`). Do not ask the human to merge — the reviewer agent merges. Do not install tools or assume fallbacks without human approval.

## 2. Product

- [`docs/PRD.md`](docs/PRD.md) — single source of truth for product, content model, roadmap.
- [`docs/source-analysis.md`](docs/source-analysis.md) — upstream corpus inventory.

## 3. Content work (`content/**`)

- [`docs/content-style-guide.md`](docs/content-style-guide.md) — binding templates, voice, diagrams, QC.
- [`docs/agent-workflow.md`](docs/agent-workflow.md) — produce → review → approve → ship.
- [`CREDITS.md`](CREDITS.md) — attribution; never copy upstream prose.

## 4. Code work (`app/**`, `lib/**`, scripts, CI)

- [`.claude/skills/ponytail/SKILL.md`](.claude/skills/ponytail/SKILL.md) — minimal working code (default: full).
- [`docs/claude-code-efficiency.md`](docs/claude-code-efficiency.md) — token hygiene.

## 5. Do not edit without human approval

`docs/PRD.md`, `docs/content-style-guide.md`, `docs/source-analysis.md`, `CREDITS.md`

## 6. Integration branch

`claude/ai-interview-platform-prd-4si5f9` until promoted to `main`.
