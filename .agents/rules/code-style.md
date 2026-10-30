# Shared code conventions

Load before code/config edits. Behavior and ownership take priority over cosmetic changes.

- Use kebab-case paths, PascalCase components/types and camelCase values. Reserve SCREAMING_SNAKE_CASE for fixed scalar/enum-like constants. Name responsibilities; avoid generic helpers/utils/common/data dumping grounds.
- Keep one default component export per component file and explicit public API exports; no wildcard barrels. Use block-bodied components with an explicit return and no artificial props parameter.
- Define contracts for current callers. Extract for meaningful semantics, reuse or an independent lifecycle; avoid speculative adapters, options and forwarding-only files.
- Keep component-independent values at module scope. Order component groups by dependencies: reactive sources, constants, derived values, handlers, effects, return; preserve execution semantics.
- Explain reasons and invariants in comments. Preserve useful error context; avoid silent catches, section banners and assignment narration.
- Let Biome/Prettier own formatting and imports, and Stylelint own style ordering. Explain necessary lint exceptions narrowly; avoid unrelated restyling.
