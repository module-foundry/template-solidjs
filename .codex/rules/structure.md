# Architecture and structure rules

## Source of truth

This repository uses Feature-Sliced Design with a **pages-first, extract-by-real-responsibility** strategy. Read `docs/architecture/fsd.md` before structural changes. That document is the detailed source of truth; this file is the operational checklist for day-to-day work.

## Active architecture

The currently active dependency chain is:

```text
app -> pages -> shared
```

The complete set of allowed layers is:

```text
app -> pages -> widgets -> features -> entities -> shared
```

`widgets`, `features`, and `entities` are optional. Do not create them, their slices, or placeholder directories until the codebase has a real owner for them. Never add a `processes` layer.

Dependencies only point from a higher layer to a lower layer. `shared` must never import from a business layer. Slices on the same layer are independent by default.

## Classify before creating or moving code

Ask these questions in order:

1. Is it application startup, routing, providers, global styles, or build-time app configuration? Put it in `app`.
2. Is it specific to one route or screen? Keep it in `pages/<page>`.
3. Is it a large, independently meaningful UI composition reused on several pages, or one of several autonomous blocks on a page? Consider `widgets/<widget>`.
4. Is it a meaningful user-facing business capability with its own logic, state, validation, API, or lifecycle? Consider `features/<feature>`.
5. Is it a stable domain concept with independent ownership or genuine reuse? Consider `entities/<entity>`.
6. Is it domain-agnostic infrastructure, UI, configuration, or a technical primitive? Put it in `shared`.

If ownership is unclear, keep the code at the current page or usage site. A large file, a business-sounding noun, local state, or hypothetical future reuse is not enough reason to extract a slice.

## Layer responsibilities

### `app`

Use for application composition only:

- entry point and root component;
- router configuration;
- providers and initialization;
- global styles;
- application-wide boundaries.

Do not place page UI, domain models, or business actions in `app`.

### `pages`

Each slice represents one route or screen. A page may own route-specific `ui`, `model`, `api`, `lib`, and `config` code. Keep that code local even when it is large or contains state, requests, or hooks.

Extract code only after a stable lower-layer responsibility exists. Page-local API code must not be reused by another page; move reusable domain reads to an entity and meaningful reusable mutations to a feature.

### `widgets`

Create a widget only for a large autonomous UI composition that is reused across pages, or is one of several independently meaningful blocks on a complex page. Buttons, fields, avatars, titles, and one-page sections are not widgets by default.

### `features`

Create a feature for a meaningful user capability such as sign-in, add-to-cart, or change-password when it has independent logic/lifecycle or real reuse. Do not create features for generic clicks, modal visibility, tabs, toggles, or callbacks.

### `entities`

Create an entity for a stable domain concept such as user, product, or order when it has independent ownership, reusable domain logic, API, state, or UI representation. Do not create an entity merely because a noun appears in the UI.

### `shared`

Keep `shared` domain-agnostic. Valid responsibilities in this repository include:

- `shared/api`: transport, authentication, normalized errors, generated transport code;
- `shared/config`: environment and cross-cutting static configuration;
- `shared/i18n`: generic localization runtime and dictionaries;
- `shared/ui`: genuinely reusable UI primitives, when any exist;
- `shared/lib`: focused technical utilities, when any exist.

Do not use generic dump directories such as `helpers`, `utils`, `hooks`, `types`, `components`, or `constants` without a focused responsibility.

## Slices and segments

Use kebab-case for slice names. A slice may contain semantic segments such as:

```text
ui/
model/
api/
lib/
config/
```

Create only the segments and files that are needed now. Do not add `.gitkeep`, empty barrels, placeholder folders, or symmetrical scaffolding.

File names describe responsibility. Avoid vague names such as `helpers.ts`, `utils.ts`, `data.ts`, and `common.ts`.

## Public APIs and imports

Every real slice under `pages`, `widgets`, `features`, or `entities` exposes a small intentional public API from its root `index.ts`.

Across slices, import through that public API:

```ts
import { HomePage } from "@/pages/home";
```

Do not deep-import another slice:

```ts
import { HomePage } from "@/pages/home/ui/home";
```

Inside the same slice or shared module, use relative imports and do not import the module through its own public API. This prevents hidden cycles.

Use the `@/*` alias for cross-boundary source imports. Do not introduce alternative source aliases without updating TypeScript, Vite, lint, tests, and documentation together.

Public APIs must use explicit exports. Avoid `export *` and do not expose implementation details. `app` segments do not need artificial barrel files.

## Same-layer dependencies and `@x`

Do not import one page, widget, or feature slice from another slice on the same layer. Compose them in a higher layer or reconsider ownership.

For entity-to-entity dependencies, first try to merge incorrectly split entities, move technical code to `shared`, or compose above the entity layer. Use an entity `@x` API only as a documented last resort for an unavoidable domain relationship.

## API and server state

The OpenAPI document and Orval output are transport sources of truth. Generated files belong in `shared/api/generated` and must never be edited manually.

Generated operations may be consumed by the page that exclusively owns the use case. Extract them into an entity or feature only when domain ownership, reuse, mapping, validation, invalidation, or composition justifies it. Do not duplicate generated endpoints with hand-written `fetch` calls.

Keep `shared/api/index.ts` limited to the Orval mutator, authentication, normalized transport errors, and generic transport types. Use TanStack Solid Query for server state; do not copy server data into client stores.

## State and validation

Keep local UI and route-specific state with the page or component that owns it. Move state down only when a stable feature or entity owns its lifecycle. Prefer URL state for shareable navigation state and Solid Query for server state.

Use Valibot at external or persisted boundaries: environment variables, route/search input, forms, API data when generated types are insufficient, and storage data. Do not create runtime schemas for purely internal props without a validation requirement.

## Moving and deleting code

Before a move:

1. search all usages and imports;
2. identify the actual owner;
3. move the implementation and update the destination public API;
4. replace external deep imports with public API imports;
5. remove old exports, files, and empty directories;
6. search for stale paths, reverse imports, same-layer imports, and cycles;
7. preserve runtime behavior and type safety.

Never keep old and new structures in parallel without a concrete compatibility need. Never edit generated API files or the lockfile for an architecture-only change.

## Automated enforcement

`pnpm run validate:steiger` enforces the repository's FSD boundaries through the existing Steiger configuration. ESLint and TypeScript enforce import and type correctness. Do not add a heavy architecture dependency while these checks cover the required boundaries.

## Required validation

At the end of every task run:

```text
pnpm run validate
```

For structural work also run a production build and any test scripts present in `package.json`. Search imports manually after moves; a successful build alone is not proof that architectural boundaries are clean.
