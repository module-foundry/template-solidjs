# SolidJS starter

SolidJS, strict TypeScript 7, Vite, SCSS Modules and pages-first Feature-Sliced
Design. The home page is a small working example: a Valibot form, notes, filtering,
derived state, localization and SVG components. It runs without a backend; notes
live in memory for the current page session.

## Start

Use Node.js satisfying `package.json`, then:

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm run dev
```

Open [localhost:3000](http://localhost:3000). Keep an existing `.env` rather than
replacing it. Backend variables configure the API client; no request is made by
the starter page. Kubb generation is a separate operation.

## Structure and AI work

Start with [`AGENTS.md`](AGENTS.md) for constraints, context routing and the
verification policy. Rules own conventions; `project-develop` implements and
reports results, using component/placement recipes only when needed.
`project-plan` handles substantial or ambiguous work. One developer owns the
request; there is no automatic reviewer or finalizer stage.

OpenCode uses `project-developer` and `/implement <request>`. Restart it after
configuration changes. See [the workflow](.agents/workflow.md).

Allowed imports point downward:

```text
app -> pages -> widgets -> features -> entities -> shared
```

`pages/home` owns the demo. The empty layer directories are intentional; see
[`AGENTS.md`](AGENTS.md) for their protection and the
[ownership guide](.agents/rules/structure.md) for extraction and import rules.

## Styles and SVG

Components use colocated `*.module.scss`, descriptive kebab-case BEM selectors
and shared CSS-variable tokens. Global styles contain a minimal reset, document
defaults and token modules imported with Sass `@use`. Keyboard focus and native
control behavior are preserved. Set `data-theme="dark"` on the document element
when a product needs the included dark token palette.

Development CSS Module names include the source path, file and local selector;
CSS source maps are enabled. Production uses one `mini-css-class-name` generator
per build: unique short identifiers start at one character and grow as needed.
Names may change between builds; never persist generated class names or use them
as application identifiers. Third-party/global selectors are outside that
module-name registry.

SVG imports are Solid JSX components by default via `vite-plugin-solid-svg`
with `defaultAsComponent: true`. Types come from the plugin before `vite/client`.
Expose assets through explicit exports:

```ts
// src/shared/assets/index.ts
export { default as AddIcon } from "./icons/add.svg";
```

```tsx
import { AddIcon } from "@/shared/assets";

<AddIcon aria-hidden="true" />;
```

Terser retains five compression passes and standard mangling, without unsafe
transforms/property mangling. Debug log calls are removed; warnings/errors remain.
Lightning CSS minifies production CSS, and the HTML plugin minifies HTML.
Compression and bundle analysis remain opt-in commands.

## Locales

Configure the enabled subset at build time:

```dotenv
VITE_I18N_SUPPORTED_LOCALES=en,ru
VITE_I18N_FALLBACK_LNG=en
VITE_I18N_STORAGE_KEY=lang
```

Whitespace around comma-separated values is trimmed. Unknown/empty entries,
duplicates and a fallback outside the enabled list fail environment validation.
If the supported-list variable is absent, all compiled locales are enabled for
compatibility with an existing `.env`. A stale unsupported stored locale falls
back safely. Language changes update `document.documentElement.lang`.

Rebuild to change production locales; environment variables do not add missing
translations. Add a new locale to `shared/config/i18n.ts` and the dictionary
registry. Dictionary types check that translations match the base dictionary.

## API generation

```bash
pnpm run api:generate
pnpm run api:watch
```

`OPENAPI_URL` in `.env` selects the real OpenAPI document. The example address
`http://localhost:3001/api/v1/openapi.json` must be replaced with an available
schema before generation; this template currently has no live schema URL.
Kubb 5 generates types and operations
under `src/shared/api/generated`; never edit those files by hand. Generation uses
the dedicated Biome formatter configuration. Application imports go through the
explicit `shared/api` public API.

The official `plugin-client` integration calls `shared/api/client.ts`, which owns
native fetch, token headers and error handling. The Telegram operation and
backend contract are preserved. No Axios, TanStack Query or runtime Zod schemas
are generated. Zod is an explicit **dev** peer required by Kubb's generator plugin;
it is not part of application transport validation.

The repository uses no manifest hooks or dependency patches. One scoped pnpm
peer rule accepts TypeScript 7 for the old optional `tsconfck` peer: Steiger uses
its plain `parse` function, not the TypeScript Compiler API. Other peer checks
remain strict. Tooling may have its own transitive JS TypeScript version; the
application compiler remains TypeScript 7.

```ts
import { authHandlerTelegram } from "@/shared/api";

const result = await authHandlerTelegram({
  body: { init_data: signedTelegramInitData },
  signal: abortController.signal,
});
```

The transport reads the configured session-storage token for each request. JSON,
FormData, Blob and URLSearchParams bodies are supported; primitive query values
use repeated keys for arrays. Other serialization styles/streaming require the
API's specific contract. Generated types do not validate external data at runtime.

HTTP failures throw `ApiError` with `status` and `data`: JSON error envelopes are
parsed, while text/HTML/malformed JSON is retained as text and empty bodies yield
`undefined`. Network errors and cancellation retain native fetch behavior. With
`throwOnError: false`, inspect the typed result's `error`; external error bodies
still require runtime narrowing because proxies may return unexpected content.

## Checks and hooks

- `pnpm run validate`: read-only types, Biome, Prettier, Stylelint and Steiger.
- `pnpm run fix`: explicit safe fixes/formatting; run validation after corrections.
- `pnpm run build`: validation through `prebuild`, followed by production output
  without gzip/Brotli copies.
- `pnpm run build:production`: `cross-env BUILD_COMPRESS=true pnpm run build`,
  producing original files alongside `.gz` and `.br` copies.
- `pnpm run build:analyzer`: production bundle report.

When validation already passed during a task, use `pnpm exec vite build` (or
`pnpm exec cross-env BUILD_COMPRESS=true vite build`) to avoid repeating it.
If a constrained environment hits the macOS watcher limit, retry only Steiger
with `pnpm exec cross-env CHOKIDAR_USEPOLLING=1 pnpm run validate:steiger`.

Husky installs once via `prepare`. Pre-commit uses lint-staged's protection of
partially staged files, then runs Steiger against the working source tree.
Commit-msg passes the supplied message-file path directly to commitlint.
Generated code is excluded from normal formatting/linting; regenerate it instead.
Hooks do not replace the complete checks. No test framework or custom checker is
included. Biome handles JS/TS/JSON/CSS formatting; Prettier handles SCSS, Markdown,
YAML and HTML; Stylelint owns style conventions and Steiger owns FSD boundaries.

## Docker

Build with the public backend URL required by environment validation:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t solidjs-app .
docker run --rm -p 8080:80 solidjs-app
```

Open [localhost:8080](http://localhost:8080). The builder copies pnpm settings
before installing dependencies and disables Husky inside the image. Local `.env`
files stay outside the build context.

Optional build arguments match `.env.example`: `VITE_APP_SETTING_LS_AUTH_KEY`,
`VITE_I18N_FALLBACK_LNG`, `VITE_I18N_SUPPORTED_LOCALES` and
`VITE_I18N_STORAGE_KEY`. Pass overrides with `--build-arg NAME=value`; changing
client configuration requires rebuilding the image. `VITE_*` values are public
bundle configuration, not secrets.

Package scripts that set environment variables use `cross-env` for macOS, Linux
and Windows; keep new scripts and documented pnpm commands portable too.
