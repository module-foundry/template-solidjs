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

## Mandatory architecture rules

- Use Feature-Sliced Design with the pages-first strategy documented in [`docs/architecture/fsd.md`](docs/architecture/fsd.md).
- Dependencies point only downward: `app -> pages -> widgets -> features -> entities -> shared`.
- Keep route-specific code in its page until real reuse or independent ownership justifies extraction.
- Do not create empty or speculative layers, slices, segments, barrels, or placeholder files.
- Import other slices through their public API; use relative imports inside the current slice.
- Do not introduce same-layer slice imports, external deep imports, or business dependencies in `shared`.
- Never edit generated files under `src/shared/api/generated`.
