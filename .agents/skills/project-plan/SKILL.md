---
name: project-plan
description: Plan substantial or ambiguous repository changes with ownership, observable criteria and verification.
---

# Plan

Inspect the request, latest steering, `git status`, nearby code/imports and `package.json`. Select rules through `AGENTS.md`; ask only about unknowns that materially change the result.

Return a compact packet using `.agents/workflow.md`: goal, scope/owners, pre-existing changes, observable ACs, ordered steps, verification and material unknowns. Include relevant update/error/empty cases. Keep small plans in memory; persist only for requested or cross-session continuity.

Planning is read-only. A plan-only request ends with the plan; otherwise continue through `project-develop`.
