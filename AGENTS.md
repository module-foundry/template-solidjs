# Project AI entry point

SolidJS, strict TypeScript 7, SCSS Modules, pnpm. Read `package.json` for versions and commands. Biome, Stylelint and Steiger own their configured checks; Kubb generates native-fetch operations without TanStack Query.

## Invariants

- Preserve user changes and accepted behavior; keep the scope narrow.
- Preserve `src/widgets`, `src/features`, `src/entities`, `src/shared/ui` and their `.gitkeep` files unless removal is explicitly requested. Create no speculative slices or empty barrels.
- Never hand-edit `src/shared/api/generated`, patch dependency manifests, or add custom lint/AST/path checkers. Change the lockfile only through pnpm for intentional dependencies.
- Use existing checks; do not add tests, test dependencies/scripts, or test infrastructure. Report actual results and blockers; never weaken rules to pass checks.

## Load only matching context

Read `.agents/rules/code-style.md` before code/config edits, then select:

| Task                         | Rules                                    |
| ---------------------------- | ---------------------------------------- |
| JS/TS or configuration       | `.agents/rules/javascript-typescript.md` |
| Solid/JSX/reactivity         | Above + `.agents/rules/solid-jsx.md`     |
| CSS/SCSS or styled UI        | `.agents/rules/styles.md`                |
| Ownership/imports/assets/API | `.agents/rules/structure.md`             |
| AI workflow/skills           | `.agents/workflow.md`                    |

Fetch current official docs only for APIs/configuration being changed; prefer Context7 when available. `project-develop` owns implementation and its final report; use `project-plan` for substantial or ambiguous work. Small edits need only an in-memory plan. Informational and plan-only requests do not authorize implementation.

## Verification

- After code/config changes, run the complete read-only `pnpm run validate` once. Documentation-only changes do not need the suite.
- Use `pnpm run fix` explicitly for fixes. After corrections, rerun failed checks and previously successful checks affected by those corrections; do not repeat unaffected checks.
- Verify affected behavior in the UI when relevant. For a production build after validation, use `pnpm exec vite build` to avoid the validating `prebuild` hook; use `pnpm exec cross-env BUILD_COMPRESS=true vite build` for compression.
