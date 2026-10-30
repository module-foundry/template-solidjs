# SolidJS and accessible JSX

Load for components, reactivity and DOM interactions; use Solid's execution model.

- Type components as `Component<Props>` (`Component` without props), with interface props and inferred parameters. If a required generic/overload cannot preserve its contract through `Component`, explain the limitation and ask before choosing an exception.
- Components run once. Keep changing reads in tracked JSX/accessors/memos; do not destructure reactive props or copy them into plain locals. Use `splitProps`/`mergeProps` only for real forwarding/defaults needs.
- Derive state directly or with `createMemo`; use effects for external side effects. Use `<Show>`/`<Switch>` for reactive branches and `<For>`/`<Index>` according to identity semantics.
- Keep one state owner; do not mirror controlled props into signals without a synchronization contract. Use `createStore` for structured updates when preserving object identity matters.
- DOM event bindings are not reactive: wrap changing callback props to read their current value on invocation. Preserve event typing and `currentTarget`; use Solid JSX attributes rather than React conventions.
- Register listener/subscription/timer/resource cleanup within a valid reactive owner. Keep components in `.tsx` and plain logic in `.ts`.
- Use native controls, labels, intentional button types, accessible names and visible focus. ARIA alone does not implement keyboard behavior. No direct `innerHTML` without an explicitly required trusted/sanitized boundary.
- Use the existing i18n runtime for user-facing text. Verify repeated updates and relevant loading/error/empty states, keyboard behavior and custom controls against the applicable WAI pattern.
