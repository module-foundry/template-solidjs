# Structure usage

## Goal

Use this rule to decide where every new file belongs, when to create a new slice, how to structure files inside a slice, and how to safely update, move, or delete existing files.

The project follows Feature-Sliced Design. Keep code as close as possible to its real owner. Do not create architecture for a hypothetical future use case.

## Before changing files

Before adding, moving, or deleting code, inspect the existing structure first.

1. Search for an existing owner slice.
2. Check whether similar logic already exists.
3. Prefer extending the existing slice over creating a new one.
4. Create a new file only when the code has a clear responsibility.
5. Create a new folder only when there are at least two meaningful files or the folder is required by this rule.
6. Do not add placeholder files, empty abstractions, or folders “for later”.

If the owner is unclear, keep the code closer to the current usage site until reuse or domain ownership becomes obvious.

## Architecture

Before adding new code, ask the questions in order. The first matching answer defines the layer.

1. **App** — is this app init, routing, providers, global styles, or app-wide config? → `app/`
2. **Pages** — is this a full page/screen for one route/URL? → `pages/`
3. **Widgets** — is this a large self-contained UI block used on multiple pages or one of several such blocks on one page? → `widgets/`
4. **Features** — is this a user action with business value, reused in different places: form, action button, modal flow, mutation, interaction scenario? → `features/`
5. **Entities** — is this a business entity from the domain: model, domain representation, reusable entity UI, entity API, entity store? → `entities/`
6. **Shared** — is this not business-bound: UI kit, utilities, base API client, config, i18n, generic hooks? → `shared/`

If none fit, clarify the boundary. Do not bloat `entities/`. Non-reused code can stay inside a page.

Imports only go down:

```txt
app → pages → widgets → features → entities → shared
```

A layer must not import from a higher layer. Slices on the same layer must not import from each other directly. Compose them from a higher layer instead.

## Layer responsibilities

### `app/`

Use `app/` only for application-level composition:

- routing setup;
- providers;
- app initialization;
- global styles;
- app-wide configuration;
- root layouts and error boundaries if they belong to the application shell.

Do not put domain state, entity API, feature API, or business logic into `app/`.

`app/` must not use a `model/` segment. If a local schema is needed for an app component, place `*.schema.ts` next to the related `.tsx` file.

### `pages/`

Use `pages/` for route-level screens.

A page may:

- compose widgets, features, entities, and shared UI;
- prepare page-level layout;
- read route params/search params;
- connect route-level framework props to lower-level components.

A page must not own domain API or domain store.

Allowed:

```txt
pages/<page-slice>/ui/<page-name>/<page-name>.tsx
pages/<page-slice>/model/schemas/<page-name>.schema.ts
pages/<page-slice>/model/constants.ts
pages/<page-slice>/index.ts
```

Forbidden in `pages/`:

```txt
pages/<page-slice>/api/
pages/<page-slice>/model/store.ts
pages/<page-slice>/model/index.ts
```

If a page needs data, move data ownership to an `entities/` or `features/` slice and import it through the public API.

### `widgets/`

Use `widgets/` for large self-contained UI blocks.

A widget may:

- compose features, entities, and shared UI;
- contain widget-specific presentation logic;
- contain local UI schemas and constants.

A widget must not own domain API or domain store.

Allowed:

```txt
widgets/<widget-slice>/ui/<widget-name>/<widget-name>.tsx
widgets/<widget-slice>/model/schemas/<widget-name>.schema.ts
widgets/<widget-slice>/model/constants.ts
widgets/<widget-slice>/index.ts
```

Forbidden in `widgets/`:

```txt
widgets/<widget-slice>/api/
widgets/<widget-slice>/model/store.ts
widgets/<widget-slice>/model/index.ts
```

If a widget needs server data, get it from `entities/` or `features/`.

### `features/`

Use `features/` for a user action with business value.

Examples:

- `auth-by-email`;
- `change-password`;
- `create-order`;
- `delete-comment`;
- `toggle-favorite`;
- `upload-avatar`.

A feature may own:

- feature UI;
- feature-specific form state;
- feature mutation API;
- feature validation schemas;
- feature-specific store;
- feature-specific hooks.

Create a feature slice only when the action is reusable or has meaningful business logic. If the action is used once and is tightly bound to one page, keep it inside that page until reuse appears.

### `entities/`

Use `entities/` for domain objects.

Examples:

- `user`;
- `profile`;
- `article`;
- `comment`;
- `order`;
- `product`.

An entity may own:

- entity type/model;
- entity schemas;
- entity API for reading or updating the entity itself;
- entity store;
- reusable entity UI representation;
- domain selectors and pure domain logic.

Do not put user-action flows into `entities/`. If the code represents an action, put it into `features/`.

### `shared/`

Use `shared/` only for code without business ownership.

Allowed examples:

```txt
shared/ui/
shared/lib/
shared/api/
shared/config/
shared/model/
shared/i18n/
shared/assets/
```

`shared/model` is allowed only for global or cross-cutting state that is not better owned by an entity or feature.

`shared/api` is for the base API client, transport helpers, shared request primitives, and generic API utilities. Domain endpoints do not belong in `shared/api`.

## Naming

Use `kebab-case` for slice folder names under:

```txt
pages/
widgets/
features/
entities/
```

Correct:

```txt
pages/not-found/
widgets/user-menu/
features/auth-by-email/
entities/user-profile/
```

Wrong:

```txt
pages/notFound/
widgets/UserMenu/
features/authByEmail/
entities/UserProfile/
```

Under slice `ui/`, use the same kebab-case stem for the folder and the `.tsx` file:

```txt
pages/home/ui/home/home.tsx
pages/not-found/ui/not-found/not-found.tsx
widgets/user-menu/ui/user-menu/user-menu.tsx
features/auth-by-email/ui/auth-by-email-form/auth-by-email-form.tsx
entities/user/ui/user-card/user-card.tsx
```

The exported React component identifier stays `PascalCase`:

```ts
export function UserCard() {}
```

Use these file naming rules:

```txt
*.tsx                  React components only
*.schema.ts            Valibot schemas only
use-<name>.ts          React hooks
<name>.store.ts        Only when there are multiple stores in one segment; otherwise store.ts
<name>.test.ts         Tests
<name>.spec.ts         Specs if the project uses spec naming
constants.ts           Slice constants
query-keys.ts          TanStack Query keys
requests/index.ts      Aggregated API request object
```

Avoid vague names:

```txt
helpers.ts
utils.ts
misc.ts
data.ts
common.ts
```

Use names that describe the responsibility:

```txt
format-price.ts
normalize-user.ts
get-user-display-name.ts
build-user-query-key.ts
```

## Slice structure

A slice is a folder directly inside `pages/`, `widgets/`, `features/`, or `entities/`.

Default slice shape:

```txt
<layer>/<slice>/
  index.ts
  ui/
  model/
  api/
  lib/
  config/
  assets/
```

Do not create all folders by default. Create only the segments that are actually needed.

### Minimal UI-only slice

```txt
widgets/user-menu/
  index.ts
  ui/
    user-menu/
      user-menu.tsx
  model/
    schemas/
      user-menu.schema.ts
```

### Entity slice with API and model

```txt
entities/user/
  index.ts
  api/
    requests/
      get-current-user.ts
      index.ts
    query-keys.ts
    use-current-user.ts
  model/
    schemas/
      user.schema.ts
    constants.ts
    selectors.ts
    store.ts
    types.ts
  ui/
    user-card/
      user-card.tsx
```

### Feature slice with mutation

```txt
features/update-profile/
  index.ts
  api/
    requests/
      index.ts
      update-profile.ts
    use-update-profile.ts
  model/
    schemas/
      update-profile-form.schema.ts
    constants.ts
    types.ts
  ui/
    update-profile-form/
      update-profile-form.tsx
```

## Segment usage inside a slice

### `ui/`

Use `ui/` for React components and component-local presentation code.

Allowed inside `ui/`:

```txt
ui/<component>/<component>.tsx
ui/<component>/<component>.module.scss
ui/<component>/<component>.test.tsx
ui/<component>/<small-child-component>.tsx
```

Rules:

- Components must focus on rendering and user interaction wiring.
- Business logic must be moved to `model/`, `api/`, `lib/`, `entities/`, or `features/` depending on ownership.
- Non-trivial calculations must not live directly in JSX.
- Component props must come from `model/schemas/*.schema.ts` for slices under `pages/`, `widgets/`, `features/`, and `entities/`.
- Components import slice schemas, types, constants, hooks, and API hooks from the slice public API: `@/<layer>/<slice>`.
- Components must not deep-import from `@/<layer>/<slice>/model/...` or `@/<layer>/<slice>/api/...`.

### `model/`

Use `model/` for the slice contract and slice-owned state or business rules.

Create `model/` when at least one of these is true:

- the slice has component props schemas;
- the slice has form/input validation schemas;
- the slice owns domain types;
- the slice owns state;
- the slice has selectors;
- the slice has constants used by multiple files inside the slice;
- the slice has domain-specific hooks that are not HTTP hooks;
- the slice has slice-specific i18n resources;
- the slice has pure domain rules or predicates.

Do not create `model/` only because every slice “should have it”.

Allowed `model/` files and folders:

```txt
model/schemas/<name>.schema.ts
model/constants.ts
model/types.ts
model/store.ts
model/selectors.ts
model/use-<name>.ts
model/guards.ts
model/mappers.ts
model/locales/
```

#### `model/schemas/`

Use `model/schemas/` for Valibot schemas.

Use schemas for:

- component props;
- form values;
- API input/output validation when owned by the slice;
- route/search params when owned by a page;
- domain object validation.

Schema file naming:

```txt
model/schemas/<kebab-stem>.schema.ts
```

For a component located here:

```txt
ui/user-card/user-card.tsx
```

The matching props schema should be here:

```txt
model/schemas/user-card.schema.ts
```

The schema file exports both the schema and the props type:

```ts
import { type InferOutput, object, optional, string } from "valibot";

export const userCardPropsSchema = object({
  className: optional(string()),
});

export type UserCardProps = InferOutput<typeof userCardPropsSchema>;
```

Do not define component prop types directly in `.tsx` if a schema file is required.

#### `model/constants.ts`

Use `model/constants.ts` for slice constants used by multiple files or exported as part of the slice contract.

Good examples:

```ts
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;
```

Do not put one-off local constants into `model/constants.ts`. Keep them near the only usage site.

#### `model/types.ts`

Use `model/types.ts` for domain or slice-level TypeScript types that are not directly inferred from Valibot schemas.

Allowed:

```ts
export type UserStatus = "active" | "blocked";
export type UserPermission = "read" | "write" | "admin";
```

Do not duplicate types that can be inferred from schemas.

#### `model/store.ts`

Use `model/store.ts` only when the slice owns real state.

Allowed owners:

```txt
entities/<slice>/model/store.ts
features/<slice>/model/store.ts
shared/model/...
```

Forbidden owners:

```txt
pages/<slice>/model/store.ts
widgets/<slice>/model/store.ts
app/**/model/store.ts
```

Use `store.ts` for:

- client-only domain state;
- feature flow state;
- cross-component state with a clear owner;
- state that cannot be represented by URL, server cache, or local component state.

Do not use `store.ts` for:

- derived values;
- duplicated server data;
- temporary state used by one component only;
- page composition state;
- TanStack Query server cache.

#### `model/selectors.ts`

Use `model/selectors.ts` for derived reads from `model/store.ts` or domain state.

Selectors must be pure. They must not perform IO, mutate data, or call React hooks.

#### `model/use-<name>.ts`

Use `model/use-<name>.ts` for React hooks that belong to the slice model but are not HTTP hooks.

Allowed examples:

```txt
model/use-selected-user.ts
model/use-update-profile-form.ts
model/use-user-permissions.ts
```

Use model hooks for:

- combining store selectors;
- form model logic;
- domain-specific UI state orchestration;
- reusable business interaction logic that does not call the server directly.

Do not put TanStack Query hooks into `model/`. Server-state hooks belong to `api/use-<operation>.ts`.

Do not create `model/hooks/`. Hook files live directly in `model/` as `use-<name>.ts`.

#### `model/guards.ts`

Use `model/guards.ts` for type guards and domain predicates.

Example:

```ts
export function isActiveUser(status: UserStatus): boolean {
  return status === "active";
}
```

#### `model/mappers.ts`

Use `model/mappers.ts` only for pure transformations between slice-owned model shapes.

If the mapper exists only to convert transport DTOs from an API response, prefer `api/mappers.ts`.

#### `model/locales/`

Use `model/locales/` only for slice-specific translations that are owned by the slice and not reused globally.

Global i18n setup and generic translation helpers belong to `shared/i18n` or `shared/lib`, depending on the project structure.

#### Forbidden in `model/`

```txt
model/index.ts
model/hooks/
model/lib/
model/helpers.ts
model/utils.ts
model/api.ts
```

The slice public model API must be exported from the slice root `index.ts`, not from `model/index.ts`.

### `api/`

Use `api/` for server communication owned by an entity or feature.

Allowed owners:

```txt
entities/<slice>/api/
features/<slice>/api/
```

Usually forbidden:

```txt
pages/<slice>/api/
widgets/<slice>/api/
app/**/api/
```

Allowed in `shared/api`:

```txt
shared/api/client.ts
shared/api/http.ts
shared/api/errors.ts
shared/api/types.ts
```

Domain endpoints must not live in `shared/api`.

Preferred API structure:

```txt
api/
  requests/
    <operation>.ts
    index.ts
  query-keys.ts
  use-<operation>.ts
  types.ts
  mappers.ts
```

#### `api/requests/<operation>.ts`

Use request files for low-level server calls.

Request files may:

- call the shared API client;
- validate request and response data;
- map DTOs to domain models;
- throw typed errors or normalized errors.

Request files must not:

- use React hooks;
- know about components;
- mutate UI state;
- import from pages or widgets.

#### `api/requests/index.ts`

Use `api/requests/index.ts` to export an aggregated `requests` object when the project uses this pattern.

Example:

```ts
import { getCurrentUser } from "./get-current-user";

export const requests = {
  getCurrentUser,
};
```

#### `api/use-<operation>.ts`

Use `api/use-<operation>.ts` for TanStack Query hooks or mutation hooks.

Examples:

```txt
api/use-current-user.ts
api/use-update-profile.ts
api/use-delete-comment.ts
```

API hooks may:

- call `requests` from `./requests`;
- use `query-keys.ts`;
- expose loading/error/data states;
- invalidate related queries;
- compose TanStack Query options.

API hooks must not contain UI rendering logic.

#### `api/query-keys.ts`

Use `api/query-keys.ts` for TanStack Query keys owned by the slice.

Query keys must be stable, typed when practical, and colocated with the slice that owns the server state.

#### `api/types.ts`

Use `api/types.ts` for transport-level request/response types if they are not already inferred from schemas.

Do not mix transport DTO types with domain model types. Domain types belong to `model/types.ts`.

#### `api/mappers.ts`

Use `api/mappers.ts` for DTO-to-domain and domain-to-DTO conversions that exist because of transport shape differences.

### `lib/`

Use slice `lib/` only for pure implementation details owned by the slice.

Allowed:

```txt
lib/format-user-name.ts
lib/sort-comments.ts
lib/build-form-default-values.ts
```

Rules:

- `lib/` functions must be pure whenever possible.
- `lib/` must not import from `ui/`.
- `lib/` must not become a dumping ground.
- If logic is reusable across different slices and has no business ownership, move it to `shared/lib`.
- If logic is business-owned by an entity or feature, keep it in that slice.

### `config/`

Use slice `config/` for static configuration owned by the slice.

Examples:

```txt
config/table-columns.ts
config/form-fields.ts
config/tabs.ts
```

Do not put runtime state into `config/`.

### `assets/`

Use slice `assets/` for assets owned only by this slice.

Reusable assets belong to `shared/assets`.

## State ownership

State includes:

- `model/store.ts`;
- store selectors;
- TanStack Query server state;
- domain cache;
- feature flow state;
- stateful business hooks.

Ownership priority:

1. `entities/` — domain object state and entity server data.
2. `features/` — action/flow state and feature mutations.
3. `shared/model` — global cross-cutting state only when no entity or feature owns it.

Do not create domain state in:

```txt
app/
pages/
widgets/
```

Use local component state only for local UI concerns:

- opened/closed local dropdown;
- local input draft before submit;
- local hover/focus state;
- local uncontrolled UI state.

Do not duplicate server data into client store. Use TanStack Query for server data and derive values from the query result.

## Public API

Every slice must expose its public API through the slice root `index.ts`.

Example:

```txt
entities/user/index.ts
features/update-profile/index.ts
widgets/user-menu/index.ts
pages/home/index.ts
```

Consumers outside the slice must import from the root public API:

```ts
import { UserCard, useCurrentUser } from "@/entities/user";
```

Do not deep-import from another slice:

```ts
// Wrong
import { UserCard } from "@/entities/user/ui/user-card/user-card";
import { useCurrentUser } from "@/entities/user/api/use-current-user";
```

Root `index.ts` section order is required:

```ts
/* model */
export { userSchema, type User } from "./model/schemas/user.schema";
export { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "./model/constants";
export { useUserStore } from "./model/store";

/* api */
export { requests } from "./api/requests";
export { useCurrentUser } from "./api/use-current-user";

/* ui */
export { UserCard } from "./ui/user-card/user-card";
```

Rules for `index.ts`:

- use relative imports only;
- never use `@/` inside `index.ts`;
- export `model` first;
- export `api` second when it exists;
- export `ui` last;
- keep one blank line between sections;
- export only the real public contract;
- do not export internal helpers by default.

## Imports inside a slice

Inside `index.ts`, always use relative paths.

Inside non-`index.ts` files under `src/`:

- use relative import for nearby files;
- use `@/` when the relative path would be long or cross architectural boundaries;
- use the slice public API for schema/types/constants/hooks from the same slice when importing from `ui/` or `api/`.

From `ui/`:

```ts
// Correct
import { type UserCardProps } from "@/entities/user";

// Wrong
import { type UserCardProps } from "../../model/schemas/user-card.schema";
```

From `api/use-<operation>.ts`:

```ts
// Correct
import { requests } from "./requests";
import { userQueryKeys } from "./query-keys";
import { type User } from "@/entities/user";
```

Do not import from `ui/` into `model/`, `api/`, `lib/`, or `config/`.

## File creation rules

When creating a new file, follow this process.

### 1. Define the owner

Ask:

```txt
Is it app setup?
Is it a page?
Is it a reusable page block?
Is it a user action?
Is it a domain entity?
Is it generic shared code?
```

The first matching answer defines the layer.

### 2. Reuse existing slices first

Before creating a new slice, search for:

- same domain entity;
- same feature action;
- same page;
- similar widget;
- existing shared utility or UI component.

Create a new slice only when existing ownership would be incorrect.

### 3. Create only required segments

Do not scaffold every segment.

If you only need a page component:

```txt
pages/home/
  index.ts
  ui/home/home.tsx
  model/schemas/home.schema.ts
```

If you add server data later, do not add it to the page. Create or extend an entity/feature API instead.

### 4. Keep one responsibility per file

Create a new file when the code has a separate reason to change.

Good reasons:

- separate component;
- separate request;
- separate schema;
- separate store;
- separate hook;
- separate pure domain function.

Bad reasons:

- “file became 80 lines”; length alone is not enough;
- “maybe reusable later”;
- “to match a template”.

### 5. Update public API

After creating a public file, export it from the slice root `index.ts`.

Do not export private files.

### 6. Fix imports

After adding a file:

- use public API imports across slices;
- avoid deep imports;
- avoid upward imports;
- remove unused imports;
- preserve import order used by the project.

## File update rules

When editing existing code:

1. Keep the file in its current owner if ownership is still correct.
2. If logic no longer belongs there, move it to the right layer before extending it.
3. Do not add business logic to UI just because the UI file is currently open.
4. Do not add server calls to pages or widgets.
5. Do not add a store to pages or widgets.
6. Do not duplicate existing schemas, constants, query keys, or types.
7. Prefer narrowing and reusing existing contracts over creating parallel contracts.

## Moving files

Move a file when its ownership changed or was wrong.

Safe move process:

1. Identify the new owner layer and slice.
2. Move the file to the correct segment.
3. Rename the file if the new segment requires another naming convention.
4. Update the new slice root `index.ts` if the file is public.
5. Remove old exports from the previous `index.ts`.
6. Replace consumers with public API imports.
7. Delete empty folders.
8. Run typecheck/tests/lint if available.

When moving between layers, check import direction again. A moved file may no longer be allowed to import the same modules.

On case-insensitive file systems, do not rename only by case in one step. Use a temporary name so Git records the change.

## Deleting files

Delete a file only when it has no valid owner or usage.

Before deleting:

1. Search all imports/usages.
2. Remove public API exports.
3. Remove related tests only if they test deleted behavior.
4. Delete empty folders.
5. Do not leave dead barrels or empty segments.

Do not keep unused files “just in case”.

## Pages and HTML props

For page components, page props should support valid HTML attributes for the root element when the project follows this pattern.

Schema file:

```txt
pages/<page>/model/schemas/<page>.schema.ts
```

Rules:

- export the page schema;
- export `PageNameProps` from the schema file;
- include `AllHTMLAttributes<HTMLElement>` when page root HTML props are forwarded;
- omit colliding framework prop names with `Omit<AllHTMLAttributes<HTMLElement>, 'key'>` when needed;
- do not forward framework-only props to the DOM.

In the page component:

- destructure framework props in the parameter list;
- collect HTML props into `...html`;
- spread `html` onto one root HTMLElement.

## Shared UI and app component schemas

For `shared/ui` and `app`, colocate component schemas next to the component.

Correct:

```txt
shared/ui/button/button.tsx
shared/ui/button/button.schema.ts

app/layouts/root-layout/root-layout.tsx
app/layouts/root-layout/root-layout.schema.ts
```

Do not create `model/schemas/` for `shared/ui` or `app` components.

## Validation

Use Valibot schemas at boundaries:

- component props;
- forms;
- API request bodies;
- API responses;
- route/search params;
- persisted external data.

Do not duplicate schema-derived types manually. Prefer `InferOutput<typeof schema>`.

## Anti-patterns

Avoid these patterns:

```txt
pages/<page>/api/
widgets/<widget>/api/
pages/<page>/model/store.ts
widgets/<widget>/model/store.ts
model/index.ts
model/hooks/
model/lib/
shared/api/<domain-endpoint>.ts
deep imports from another slice
same-layer slice imports
business logic inside .tsx
server data copied into client store
new folders created only for symmetry
```

## Examples

### Add a user card

User card is a domain representation of `user`.

Correct location:

```txt
entities/user/ui/user-card/user-card.tsx
entities/user/model/schemas/user-card.schema.ts
entities/user/index.ts
```

### Add a profile page

Profile page is a route screen.

Correct location:

```txt
pages/profile/ui/profile/profile.tsx
pages/profile/model/schemas/profile.schema.ts
pages/profile/index.ts
```

If the profile page needs user data, use `entities/user/api/*`, not `pages/profile/api/*`.

### Add update profile form

Updating a profile is a user action.

Correct location:

```txt
features/update-profile/ui/update-profile-form/update-profile-form.tsx
features/update-profile/model/schemas/update-profile-form.schema.ts
features/update-profile/api/requests/update-profile.ts
features/update-profile/api/requests/index.ts
features/update-profile/api/use-update-profile.ts
features/update-profile/index.ts
```

### Add generic price formatter

If it is not domain-bound:

```txt
shared/lib/format-price.ts
```

If it is product-specific and uses product domain rules:

```txt
entities/product/lib/format-product-price.ts
```

## Final checklist

Before finishing a structure-related change, verify:

1. The layer is selected by the architecture questions.
2. The slice name is `kebab-case`.
3. Only necessary folders were created.
4. UI files are under `ui/<stem>/<stem>.tsx`.
5. Slice schemas are under `model/schemas/` when the slice belongs to `pages`, `widgets`, `features`, or `entities`.
6. `shared/ui` and `app` schemas are colocated with components.
7. Domain state lives only in `entities`, `features`, or truly global `shared/model`.
8. API belongs to `entities` or `features`, not `pages` or `widgets`.
9. TanStack Query hooks are in `api/use-<operation>.ts`, not in `model/`.
10. There is no `model/index.ts`.
11. The slice root `index.ts` exports public API in the order: `model`, `api`, `ui`.
12. Consumers use public API imports, not deep imports.
13. Imports do not go up the FSD hierarchy.
14. No unused files, folders, exports, or dead abstractions remain.
