# Codex Project Rules

Before starting any task in this repository, read the project rules in `.codex/rules/`.

Required rule files:

- `.codex/rules/code-style.md`
- `.codex/rules/structure.md`

How to use these rules:

- Follow the rule files that match the current task.
- If a rule conflicts with a direct user request, follow the user request and mention the conflict.
- Keep changes scoped to the requested task.
- Do not rewrite generated files, lockfiles, or formatting-only files unless the task requires it.
- At the end of every task, run `pnpm run validate` and ensure it passes.
