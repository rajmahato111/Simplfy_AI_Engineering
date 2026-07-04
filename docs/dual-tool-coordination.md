# Dual-tool coordination — Claude Code + Cursor

> How two agents work on one repo without conflicts. Extends
> [`agent-workflow.md`](./agent-workflow.md) (single-session orchestrator model) to
> cross-tool sessions. **The human assigns tasks; the board enforces locks.**

---

## Principles

1. **GitHub is the only source of truth** — no local-only config.
2. **`docs/agent-board.md` is the live contract** — who owns what, right now.
3. **Disjoint path locks** — two agents never edit the same file at the same time.
4. **Standards are shared** — both tools read the same skills and docs (see [`AGENTS.md`](../AGENTS.md)).
5. **Integration via branches + PRs** — not direct pushes to the integration branch from two agents at once.

---

## Branch conventions

| Tool | Branch pattern | PR target |
|------|----------------|-----------|
| Claude Code | `claude/<task-slug>` | **`main`** |
| Cursor | `cursor/<task-slug>-42a0` | **`main`** |

**Rules:** one agent per branch; `git fetch` at session start; push often; never force-push a shared branch. **Do not start new features until prior PRs are merged to `main`** unless the merge approver approves on the board. Merge policy: [`pr-merge-governance.md`](./pr-merge-governance.md).

---

## Protection tiers

### Tier A — immutable without human approval

- `docs/PRD.md`
- `docs/content-style-guide.md`
- `docs/source-analysis.md`
- `CREDITS.md`

### Tier B — content status gates

| `status` | Rule |
|----------|------|
| `draft` | Only the assigned agent on the assigned branch |
| `reviewed` | Read-only unless human unlocks |
| `approved` | Read-only for everyone |

### Tier C — default ownership

| Work | Default tool | Paths |
|------|--------------|-------|
| Content batches | Claude Code | `content/**` |
| App / infra / CI | Cursor | `app/**`, `lib/**`, `.github/**`, root config |
| Shared scripts | Whoever is assigned on the board | e.g. `scripts/**` |

---

## Session ritual (both tools)

**Start:** read `agent-board.md` → read task-specific docs (style guide / Ponytail) → `git fetch` → confirm locks → checkout your branch.

**During:** update task **Progress** on the board; commit with `[claude] T-00N:` or `[cursor] T-00N:`.

**End:** push branch; set status `ready_for_review` when done; open/update PR; note handoff for the other tool.

---

## Conflict recovery

| Situation | Action |
|-----------|--------|
| Path locked by other tool | Do not edit; wait or ask human |
| Both touched same file | Human picks keeper; loser rebases scoped changes only |
| Unclear ownership | Neither agent proceeds until board is updated |

---

## Requirements stack (priority)

1. Human directive (chat / board task)
2. [`PRD.md`](./PRD.md)
3. [`content-style-guide.md`](./content-style-guide.md) (content) or [Ponytail](../.claude/skills/ponytail/SKILL.md) (code)
4. Optional [`briefs/T-00N.md`](./briefs/) for scoped deliverables
