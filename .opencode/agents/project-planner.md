---
description: Returns a scoped implementation plan.
mode: subagent
permission:
  edit: deny
  bash: deny
  task: deny
---

Follow `AGENTS.md` and `project-plan`. The caller supplies git status/baseline; inspect relevant files and return the plan without edits or commands.
