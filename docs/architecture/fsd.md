# Feature-Sliced Design architecture

## Purpose

This SolidJS template uses Feature-Sliced Design as a dependency model, not as a requirement to populate every possible layer. The governing strategy is **pages first, then extraction by real responsibility**.

The template currently has one route and no product domain. Its deliberately small active architecture is:

```text
app -> pages -> shared
```

`widgets`, `features`, and `entities` are available when a product built from the template provides real owners for those layers. Empty layer directories are not kept in the repository.

## Current structure

```text
src/
├── app/
│   ├── app.tsx
│   ├── index.ts
│   ├── routes/
│   └── styles/
├── pages/
│   └── home/
│       ├── index.ts
│       └── ui/
│           └── home.tsx
└── shared/
    ├── api/
    ├── config/
    └── i18n/
```

The generated Orval client, when created, lives in `shared/api/generated` and remains generated infrastructure rather than a hand-written business slice.

## Dependency direction

The complete allowed order is:

```text
app -> pages -> widgets -> features -> entities -> shared
```

A higher layer may import lower layers. A lower layer must never import a higher layer. In particular, `shared` cannot depend on pages, widgets, features, or entities.

The `processes` layer is not used.

## Pages-first principle

New product code starts in the page that owns its route unless a lower-layer responsibility already exists. Page-local code may include UI, state, hooks, API calls, validation, configuration, and pure helpers.

Do not extract code because it is long, stateful, has a business-sounding name, or might be reused someday. Extract after a second real use or when independent ownership/lifecycle is already clear.

The normal evolution is:

```text
local page implementation -> proven responsibility or reuse -> stable slice
```

## Layer criteria

### App

`app` owns startup and application composition: the DOM entry point, the root component, Solid Router configuration, global providers, initialization, and global styles. In this repository, `QueryClientProvider`, `Router`, and route definitions belong here.

### Pages

A page slice represents one route or screen. `pages/home` owns the `/` screen. Code used only on that screen stays in the slice, even when it later gains page-specific state, requests, or subcomponents.

### Widgets

Create a widget when a UI block is large and autonomous and either:

- is reused across multiple pages; or
- is one of several independently meaningful blocks on a complex page.

A button, field, avatar, title, or a large one-page component is not a widget by default.

### Features

Create a feature for a meaningful user-facing capability with independent business logic, validation, API/state, lifecycle, or genuine reuse. Examples for a future product might include `sign-in` or `change-password`. Generic clicks, tabs, modal visibility, and callbacks stay local.

### Entities

Create an entity for a stable domain concept with independent ownership or reusable model/API/UI, such as a real product's `user` or `order`. Do not create entity slices simply because nouns appear in a design.

### Shared

`shared` contains domain-agnostic technical code only:

- `api` owns the base fetch mutator, authentication headers, normalized HTTP errors, transport types, and generated transport code;
- `config` owns validated environment and cross-cutting static configuration;
- `i18n` owns the generic localization runtime and dictionaries;
- `ui` and `lib` should be created only when real reusable primitives exist.

Shared code must not mention product-specific users, products, orders, checkout flows, pages, features, or entities.

## Semantic segments

Slices may use `ui`, `model`, `api`, `lib`, and `config`. A segment describes responsibility, not merely a file extension. Create only segments that contain meaningful code; never scaffold all segments for symmetry.

Avoid global dump folders named `components`, `hooks`, `types`, `constants`, `helpers`, or `utils`. Use focused ownership and descriptive file names.

## Public API and import rules

Every page, widget, feature, or entity slice has a minimal root `index.ts`. External consumers import only from that boundary:

```ts
import { HomePage } from "@/pages/home";
```

External deep imports are forbidden:

```ts
import { HomePage } from "@/pages/home/ui/home";
```

Use relative imports within the same slice or shared module. Do not import a slice through its own public API because that can create hidden cycles. Use the `@/*` alias when crossing architectural boundaries.

Public APIs contain explicit exports only. Wildcard barrels, empty barrels, and wrapper chains that add no boundary are not allowed.

## Same-layer dependencies

Slices on the same layer are independent by default:

```text
pages/a -X-> pages/b
widgets/a -X-> widgets/b
features/a -X-> features/b
entities/a -X-> entities/b
```

Resolve a same-layer dependency by composing at a higher layer, merging falsely separated slices, moving a technical primitive to `shared`, or moving stable shared domain logic to its true owner.

`@x` is permitted only for an unavoidable entity-to-entity domain relationship after those alternatives fail. Each use must expose a narrow cross-API and be documented next to the dependency.

## Reuse strategy

Classify shared behavior before extracting it:

- route-specific behavior stays in its page;
- a domain-agnostic technical primitive moves to `shared`;
- a stable domain concept moves to `entities`;
- a reusable meaningful user capability moves to `features`;
- a reusable large UI composition moves to `widgets`.

Two superficially similar snippets do not automatically have the same owner. Small local duplication is preferable to a globally coupled abstraction with the wrong semantics.

## API, data, and state

Orval-generated Solid Query operations and transport DTOs are the transport source of truth. Never edit generated files or reimplement a generated endpoint with a separate fetch wrapper.

A generated operation can remain page-owned while it has one page-specific use. Extract a domain wrapper only when mapping, validation, invalidation, composition, independent lifecycle, or reuse establishes a real entity/feature owner.

TanStack Solid Query owns server state. Local signals own local UI state. URL state owns shareable navigation state. Do not mirror query data into a client store.

Use Valibot for untrusted runtime boundaries, including environment variables, persisted data, forms, and route/API input that is not already safely generated. Plain internal TypeScript props do not require runtime schemas.

## Repository-specific corrections

The architecture audit that established this document found and corrected these template-specific anti-patterns:

- empty `widgets`, `features`, and `entities` layer placeholders implied speculative ownership;
- empty `shared/ui` and `shared/lib` barrels exposed no real modules;
- the home page UI used a redundant `ui/home/home.tsx` nesting level;
- the locale dictionary imported its type from a barrel that imported the dictionary back, creating a cycle;
- the Vite `~` alias pointed at a non-existent `src/shared/styles` directory;
- the previous project rules prohibited page-local API/state and mandated schemas and folder shapes prematurely, conflicting with pages-first ownership;
- the previous rules used React terminology in a SolidJS repository.

## Enforcement and validation

The repository already uses Steiger with the Feature-Sliced plugin. `pnpm run validate:steiger` checks FSD structure and dependency boundaries. TypeScript and ESLint cover unresolved imports, type integrity, and code rules.

After structural changes:

1. search for old paths, deep imports, same-layer imports, reverse dependencies, and self-public-API imports;
2. run `pnpm run validate`;
3. run `pnpm run build`;
4. run every test script present in `package.json`.

If no test script exists, report that fact rather than claiming tests passed.

## Placement checklist

Before adding code, answer:

1. Who owns the behavior today?
2. Is it exclusive to a route?
3. Does it have proven reuse or an independent lifecycle?
4. Is it a UI composition, user capability, domain concept, or technical primitive?
5. Can an existing slice own it without weakening cohesion?
6. Does the resulting import still point downward?
7. Is the public API minimal and are internal imports relative?

When uncertain, choose locality, clear ownership, a simple dependency graph, and real reuse over additional layers or abstractions.
