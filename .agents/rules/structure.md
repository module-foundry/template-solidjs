# Ownership and imports

Canonical FSD rules; load for ownership, imports, moves, assets and API placement.

## Owners

Allowed imports point downward: `app -> pages -> widgets -> features -> entities -> shared`. Active layers may be fewer; this template uses `app -> pages -> shared`.

| Owner      | Responsibility                                                                         |
| ---------- | -------------------------------------------------------------------------------------- |
| `app`      | Startup, routes, providers, global styles and application boundaries                   |
| `pages`    | Route UI, state, requests and transformations                                          |
| `widgets`  | Autonomous large UI compositions, reused or independently meaningful on a complex page |
| `features` | Meaningful user capabilities with independent business logic/lifecycle or real reuse   |
| `entities` | Stable domain concepts and their invariants/model/API/UI                               |
| `shared`   | Domain-agnostic infrastructure and technical primitives                                |

Start route-only work in its page. Extract after proven reuse or when independent responsibility/lifecycle is already clear, including on first use. Length, nouns and hypothetical reuse do not establish ownership. Small local duplication can be preferable to the wrong abstraction.

Before adding/moving a responsibility, identify its current owner, consumers, lifecycle and allowed imports. Inspect callers and nearby code. If materially different owners still depend on an unknown business invariant, ask a concrete user question; continue independent work while waiting. Do not hide uncertainty or business behavior in `shared`.

For example, `pages/checkout` composes `features/apply-promo-code` and `features/submit-order`; each feature owns its own validation/request/state, `entities/order` owns stable order invariants, and `shared/ui` supplies technical controls. The local notes demo stays in `pages/home`.

## Boundaries

- No upward or same-layer slice imports; compose above, merge falsely separated owners or extract to the actual lower owner. Entity `@x` is a narrow documented last resort after simpler ownership options fail.
- Cross-boundary imports use `@/*` and explicit public APIs, such as `@/pages/home`. Real page/widget/feature/entity slices expose a minimal root `index.ts`; shared modules expose their intentional API. No external deep imports or alternative aliases.
- Internal imports are relative; never import an owner's own barrel. Create only meaningful `ui`, `model`, `api`, `lib` or `config` segments; no global components/hooks/types/constants dumping grounds.

## Assets and data

- Static assets live in `shared/assets/<media-type>` and are explicitly exported from `shared/assets/index.ts` as `ObjectName` plus a singular type (`AddIcon`, `TileOldImage`). Do not colocate assets in business slices. Plain `.svg` imports are Solid components via `vite-plugin-solid-svg` with `defaultAsComponent: true`.
- Kubb operations/DTOs live in `shared/api/generated/{clients,types}`. Import operations through `shared/api`; do not duplicate generated endpoints with handwritten fetch wrappers. Shared transport owns technical headers/errors, not domain behavior.
- One-page calls and request state stay page-owned. Introduce domain wrappers only for actual mapping, validation, composition, invalidation, lifecycle or reuse. Local signals own UI state; URL state owns shareable navigation.
- Validate untrusted environment, persisted data, forms and route/API boundaries with Valibot where needed; internal TypeScript props do not need runtime schemas.

After moves, update consumers and search for stale paths, deep/self-barrel imports, upward/same-layer dependencies and cycles. Steiger checks boundaries; ownership remains a development decision. Follow `AGENTS.md` for verification.
