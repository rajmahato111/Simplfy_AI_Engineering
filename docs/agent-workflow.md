# Multi-Agent Content Workflow (v1)

How content gets produced for Simplify AI Engineering. This encodes the operating
model: **Orchestrator → Sub-agents → Reviewer → Orchestrator approval → GitHub**.

```
                 ┌─────────────────────────────────────────────┐
                 │              ORCHESTRATOR                    │
                 │  plans batches · writes agent briefs ·       │
                 │  final approval · ONLY role that commits/    │
                 │  pushes to GitHub                            │
                 └───────┬─────────────────────────▲───────────┘
                         │ briefs                  │ verdicts
             ┌───────────┴───────────┐   ┌─────────┴──────────┐
             │      SUB-AGENTS       │   │   REVIEWER AGENT    │
             │  produce MDX + SVG    │──▶│  audits vs style     │
             │  per style guide;     │   │  guide checklist;    │
             │  self-QC diagrams     │   │  re-renders diagrams │
             └───────────────────────┘   └─────────────────────┘
```

## Roles

| Role | Who | Responsibilities | Forbidden |
|---|---|---|---|
| **Orchestrator** | Main session | Task list, agent briefs, arbitration, fixes, final approval, `git commit` + `git push` | Skipping review |
| **Sub-agent** (writer) | Spawned per batch | Produce content exactly per brief + [style guide](./content-style-guide.md); self-QC every diagram (render → view → fix); report files + status back | `git commit`/`push`; touching files outside its brief; copying source prose |
| **Reviewer** | Spawned after writers finish | Full checklist audit (style guide §7), independent diagram re-render + visual inspection, findings report with APPROVE / FIX REQUIRED per file | Rewriting content wholesale (reports findings; orchestrator decides) |

## Pipeline (per content batch)

1. **Plan** — orchestrator picks the batch, creates tasks, writes one brief per sub-agent
   (deliverable paths, reference material, constraints).
2. **Produce** — sub-agents run in parallel in the shared working tree, writing only to
   their assigned paths. Every diagram passes the §6 QC loop *before* the agent reports done.
3. **Review** — reviewer agent audits everything against the §7 checklist and returns a
   findings report.
4. **Approve** — orchestrator applies/delegates fixes, re-checks the specific findings,
   flips `status: draft → reviewed`.
5. **Ship** — orchestrator commits with a descriptive message and pushes to the
   designated branch. Nothing reaches GitHub without steps 3–4.
6. **Pre-PR QA** — [`pre-pr-testing.md`](./pre-pr-testing.md): automated checks +
   Playwright E2E (`npm run test:e2e`) + **Cursor Browser** (`@Browser`) before PR.
7. **PR + merge** — implementing agent opens PR; **reviewer agent** re-runs checks,
   merges to integration branch. Human is not asked to merge.

## Conventions

- **Content contract:** file layout, frontmatter, templates, diagram spec, QC — all in
  [`content-style-guide.md`](./content-style-guide.md). The guide wins over any brief.
- **Reference corpus:** the MIT-licensed `ombharatiya/ai-system-design-guide` clone
  (facts only; see attribution rules). Briefs contain the local path.
- **Diagram QC:** `scripts/render-diagram.sh <svg>` → view the `.qc.png` (gitignored).
- **Parallel safety:** briefs assign disjoint paths; two agents never write the same file.
- **Escalation:** an agent that is blocked or must deviate from the guide reports back
  with the question instead of improvising.

## Efficiency rules (Ponytail)

All agents writing **code** in this repo run under the vendored
[Ponytail skill](../.claude/skills/ponytail/SKILL.md) (MIT © Dietrich Gebert): climb
the ladder — question the need, reuse before writing, stdlib/native/installed-dep
before new code, one line before fifty — ship the minimum that works, mark deliberate
shortcuts with `ponytail:` comments, and keep replies code-first with ≤3 lines of
commentary. Orchestrator briefs for code tasks must point agents at the skill.
Teaching **content** (chapters, walkthroughs) is governed by the
[content style guide](./content-style-guide.md), not Ponytail — never let terseness
degrade pedagogy. See [claude-code-efficiency.md](./claude-code-efficiency.md) for
the full token-efficiency playbook.
