# Code style rules

## Language and framework

- Use strict TypeScript and SolidJS idioms.
- Keep components in `.tsx` files and non-rendering logic in `.ts` files.
- Component files use a single default export; slice public APIs re-export components under intentional names.
- Use `import type` or inline `type` imports for type-only dependencies.
- Do not add `any`, `as any`, `@ts-ignore`, or broad type assertions to bypass the compiler.
- Prefer schema-inferred types when Valibot already defines a runtime contract.

## Components and reactivity

- Keep components focused on rendering and interaction wiring.
- Keep reactive reads inside tracked Solid scopes; do not destructure reactive props when that would break tracking.
- Use local signals for local UI state and TanStack Solid Query for server state.
- Move non-trivial pure transformations out of JSX into a clearly named local function or the owning slice's `lib` segment.
- Preserve accessibility semantics and forward HTML attributes only when the component contract requires it.

## Imports and exports

- Follow the FSD import rules in `structure.md`.
- Use relative imports within one slice or module and `@/*` across architectural boundaries.
- Keep exports explicit. Avoid wildcard barrels and empty `index.ts` files.
- Follow the import ordering produced by the repository ESLint and Prettier configuration.

## Naming

- Use kebab-case for files, folders, and FSD slices.
- Use PascalCase for components and types, camelCase for values/functions, and SCREAMING_SNAKE_CASE for true constants.
- Name files by responsibility; do not create generic `helpers`, `utils`, `common`, or `data` dumping grounds.

## Validation and errors

- Validate untrusted external values with Valibot where a runtime boundary exists.
- Preserve useful error context and use normalized transport errors from `shared/api` for HTTP failures.
- Do not silently swallow errors or disable lint rules without a narrow explanation.

## Styles and generated code

- Keep global styles under `src/app/styles` and colocate slice-specific styles with their UI owner.
- Follow Stylelint and the existing SCSS conventions.
- Never manually edit `src/shared/api/generated`, lockfiles, build output, or other generated artifacts.

## Required checks

Run `pnpm run validate` after every task. For code or architecture changes, also run `pnpm run build` and all test scripts available in `package.json`.
