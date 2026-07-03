# Using Claude Code Optimally — Fewer Tokens, More Value

How we keep token spend low and output value high on this project. Two levers:
**(1) generate less** (Ponytail) and **(2) waste less context** (session hygiene).

---

## 1. Ponytail: generate less code

This repo vendors the [Ponytail](https://github.com/DietrichGebert/ponytail) skill
(MIT © Dietrich Gebert) at [`.claude/skills/ponytail/`](../.claude/skills/ponytail/SKILL.md).
Every Claude Code session in this repo can use it; it triggers on coding tasks and
enforces the **decision ladder** — stop at the first rung that holds:

1. Does this need to exist at all? (YAGNI)
2. Already in this codebase? → reuse it
3. Standard library does it? → use it
4. Native platform feature covers it? → use it
5. Already-installed dependency solves it? → use it
6. Can it be one line? → one line
7. Only then: the minimum code that works

**How to drive it:**

| You say | Effect |
|---|---|
| *(nothing — coding task)* | Skill auto-applies at `full` |
| `/ponytail lite` | Builds what you asked, names the lazier alternative |
| `/ponytail ultra` | YAGNI extremist: challenges the requirement itself |
| `stop ponytail` / `normal mode` | Reverts to default behavior |

Deliberate shortcuts are marked `// ponytail: <ceiling + upgrade path>` so
simplicity reads as intent. Ponytail never trims validation, error handling,
security, or accessibility — and never trims *understanding* (read fully, then
be lazy). Upstream claims on agentic benchmarks: ~54% less code, ~20% cheaper.

**Project rule:** all application code (Phase-0 web app onward) is written with
Ponytail active, and every sub-agent code brief points at the skill. Teaching
content (chapters/walkthroughs) follows the content style guide instead —
terseness must never degrade pedagogy.

## 2. Session hygiene: waste less context

Tokens are mostly spent on *context you carry*, not answers you receive.

- **Point, don't paste.** Reference `path/file.ts:120` and let Claude read the
  slice it needs. Pasting whole files into chat pays for them on every turn after.
- **One task, one thread.** `/clear` between unrelated tasks; long mixed sessions
  re-send dead history forever. Use `/compact` at natural breakpoints of long jobs.
- **Batch related asks** into one message ("fix X, then update its test") instead
  of five round-trips that each re-carry context.
- **Stay inside the 5-minute cache window** for follow-ups when possible: rapid
  iterations reuse the prompt cache; a cold return re-reads the whole conversation.
- **Scope the ask.** "Add a `slug` column + migration" beats "improve the schema."
  Vague asks buy exploration you didn't want.
- **Ask for the diff, not the file.** "Show only what changes" on reviews/edits.
- **Plan mode for big builds** (`shift+tab`): agree on the plan cheaply, spend
  tokens once on the agreed implementation instead of on false starts.
- **Right-size the model.** Chores (renames, boilerplate, lookups) don't need the
  top model — `/model` down or use fast mode; save the big model for architecture
  and hard debugging.
- **Sub-agents are the expensive path.** Each spawn starts cold and re-derives
  context. Spawn for genuinely parallel work streams (as our
  [agent workflow](./agent-workflow.md) does), never to "check something".
- **Keep `CLAUDE.md` lean.** It rides along on every request in the repo. Facts
  and commands only; no essays.

## 3. More value per token

- **Leave a runnable check behind.** Ponytail's rule: non-trivial logic ships with
  the smallest test that fails if it breaks. Verification catches errors while the
  context is warm — re-explaining a bug later costs more than the check.
- **Let Claude verify, not narrate.** "Run it and show the failing case" beats a
  prose explanation of what *should* happen.
- **Reuse the machine's memory.** Progress notes in task lists / docs (like this
  repo's `docs/`) survive sessions; re-briefing from scratch doesn't.
