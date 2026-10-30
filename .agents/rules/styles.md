# CSS and SCSS

Load for styles and UI changes affecting styling.

- Colocate component `*.module.scss`. Globals in `src/app/styles` contain only reset, document defaults and tokens; lower layers consume CSS variables without importing app styles.
- Keep descriptive kebab-case BEM source classes. Development names identify the source; production uses one incremental `mini-css-class-name` generator per build, starting at one character and growing without a fixed limit. Never persist generated names or replace them with truncated hashes.
- Reuse tokens. Component modules own layout/states; inline styles are for runtime values. Use native states/data attributes or `classList`; explain external integrations requiring `:global`.
- Preserve native control behavior, selection and visible focus. Avoid broad resets, unnecessary specificity and `!important`; follow configured nesting and property ordering.
- Prefer namespaced Sass `@use`/`@forward` for new modules. Verify affected viewports, contrast, keyboard focus and relevant reduced-motion behavior.
