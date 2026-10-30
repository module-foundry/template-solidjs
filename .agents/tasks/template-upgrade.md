# Template upgrade

Completed historical record. Current `AGENTS.md` and workflow supersede the
role names and scope restrictions recorded below.

Goal: implement the agreed local SolidJS starter and useful AI rules/skills.

Baseline: the working tree already contains a Biome/TypeScript/Kubb migration,
new `.agents`/`.opencode` files, and removed legacy rules/ESLint/Orval files.
Preserve that work. `task.md` remains the original migration record.

## Accepted scope

- AC1: preserve the FSD skeleton with `.gitkeep`; explain ownership, imports,
  feature decomposition, and when to ask the user about ambiguous boundaries.
- AC2: concrete component/SCSS Module conventions, meaningful names and narrow
  contracts; examples are real code rather than generic style advice.
- AC3: development is the normal entry point; load component/placement recipes
  only when needed, with optional planning and independent read-only review.
- AC4: connect tokens and a minimal accessible reset; local component styles use
  SCSS Modules. Dev names include paths, production uses one incremental
  `mini-css-class-name` generator per build, with no fixed length.
- AC5: build-time `VITE_I18N_SUPPORTED_LOCALES=en,ru` config, validated fallback
  and stored locale; HTTP errors preserve status and JSON/text/empty bodies.
- AC6: `vite-plugin-solid-svg`, `defaultAsComponent: true`, explicit asset
  exports; retain Terser five passes and HTML/CSS/compression optimizations.
- AC7: remove manifest rewriting hooks and unnecessary overrides, preserve root
  TypeScript 7 and Kubb native fetch; check Husky/commitlint/staged behavior.
- AC8: working page-local form/list/filter/derived state/locale example,
  remove VS Code/Zed settings and update documentation.

Keep the Telegram backend contract and authorization behavior. Do not pin pnpm,
add tests/infrastructure/custom linters, change generated API by hand, or expand
this work to Docker/CI. Lockfile changes are for the intentional dependencies.

## Owners and order

1. Dependencies, SVG/build configuration, pure env schema and i18n runtime.
2. HTTP error decoding, global tokens/reset, and `pages/home` example.
3. Protected skeleton, rules, skill recipes/OpenCode adapters, README/hooks.
4. Formatting/fixes as necessary, then `pnpm run validate` once; repeat only
   failed/affected checks. Build directly with Vite to avoid duplicate prebuild.
5. Browser interactions, Kubb generation if its schema is available, hook checks
   outside the user's index, optional independent review, and final evidence.

Rules: `AGENTS.md`, `.agents/rules/{code-style,javascript-typescript,solid-jsx,
styles,structure}.md`; use current `project-plan` and `project-develop` skills.
The historical migration also used independent review and final reporting.

## Evidence / material unknowns

- Existing schema URL returns an unrelated Vite HTML page. The user confirmed
  there is currently no schema URL. Preserve generated files and report that
  real-contract regeneration is unavailable; never invent its replacement.
- SVG plugin 0.8.1 officially supports Solid 1 and Vite >=4.
- Dependencies now install without manifest hooks/patches. `zod` is an explicit
  generator-only dev peer. One native pnpm peer rule accepts TS7 for tsconfck's
  stale optional TS5 range, since Steiger uses plain `parse` without Compiler API.
- macOS filesystem watchers previously required `CHOKIDAR_USEPOLLING=1` for
  Steiger in this environment; this is a command-level workaround, not config.

## Implementation results

- AC1–AC8 implemented. The existing Telegram contract and generated sources
  remain unchanged. Full regeneration requires the unavailable real schema.
- `pnpm run fix` passed. The single repository `validate` run passed TypeScript,
  Biome, Prettier and Stylelint; Steiger identified the intentional assets
  segment. After its narrow documented exception, `validate:steiger` and the
  affected Biome config check passed.
- Production Vite build with compression passed: JS 43.44 kB, CSS 5.67 kB,
  gzip JS 16.39 kB and CSS 1.61 kB. Output uses incremental short CSS names.
- Frozen install passed without manifest hooks or dependency patches.
- Kubb dry-run loaded its config and three plugins; schema access prevents
  real-contract generation. No generated files were overwritten.
- Commitlint accepted a valid message path containing spaces and rejected an
  invalid message. An isolated temporary Git repository confirmed lint-staged
  formats staged changes while restoring unstaged edits; the user's index was
  untouched.
- Browser checks passed for empty/long input, add/complete/filter/delete,
  retained row focus and persisted language after reload. Desktop preview saved
  at `/private/tmp/template-solidjs-preview.png`; responsive rules were not
  separately exercised in a mobile viewport.
- Changed skills passed the Skill Creator built-in validator using PyYAML from
  a temporary runtime outside the project; no test infrastructure was added.
- Independent read-only review returned pass with no blockers. Its
  optional README clarification now labels the OpenAPI address as an example.
