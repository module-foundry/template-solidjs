# AI workflow

`AGENTS.md` routes context and owns verification policy. Rules own conventions; skills describe actions; `.opencode` contains host adapters. Load only relevant files and reuse context already read. Consult `sources.md` only when maintaining rules.

One developer owns implementation, verification and the final report. Use `project-plan` before substantial/ambiguous work; small edits go directly to `project-develop`. There is no automatic reviewer or finalizer stage.

For substantial work or a fresh context, keep a compact packet:

```text
Goal and latest user steering
Scope, owners and pre-existing user changes
AC1: observable outcome -> verification
Rules, ordered steps, checks and material unknowns
Results: changed paths, AC evidence and actual command outcomes
```

Keep it in the conversation; persist under `.agents/tasks` only for cross-session continuity or on request. Preserve the historical migration record `task.md`. Pass current criteria and evidence when handing off; omit raw logs and exploration transcripts.

Correct concrete failures while making progress. Stop and explain the blocker when the same failure repeats without new evidence, the required scope changes, or a missing user decision prevents progress. Optional improvements do not block completion or trigger another cycle.

OpenCode uses `project-developer` by default and `/implement <request>`. It may ask the read-only planner for a focused plan. Restart OpenCode after configuration changes. Codex discovers `.agents/skills`; OpenCode wrappers do not configure Codex agents. Skills guide decisions; existing tools provide deterministic checks.
