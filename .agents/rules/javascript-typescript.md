# JavaScript and TypeScript

Load for JS/TS logic and configuration.

- Preserve strict TypeScript and configured targets. Infer local types; define explicit boundary contracts. Prefer interfaces for named objects; use types for unions, tuples, aliases, inferred schemas and mapped/conditional types. Do not rewrite unrelated existing contracts.
- External values remain `unknown` until validated/narrowed. Prefer schemas, narrowing and `satisfies`; generated DTOs/assertions do not validate runtime data. Do not bypass checks with `any`, `@ts-ignore`, broad casts or unproven non-null assertions.
- Use inline `type` specifiers for named imports. Model mutually exclusive states with discriminated unions and handle their variants without a default that hides new states.
- Await, return or handle Promise failures; `void` does not handle rejection. Preserve cancellation, error causes and local try/catch/finally semantics. Run independent async work concurrently only when semantics allow.
- Prefer pure transformations; preserve callback bindings. Distinguish falsy from nullish values when simplifying conditions, optional access, defaults or flattening operations.
- Keep package scripts portable across macOS, Linux and Windows. Set environment variables with `cross-env NAME=value command`, never POSIX-only assignments or Windows `set`. Apply the same rule to documented pnpm commands; use `cross-env-shell` when one environment must cover a shell expression. `.env` files keep ordinary `NAME=value` entries.
