## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Architecture

The template uses pages-first Feature-Sliced Design. Only layers with real
responsibilities are kept in the repository; `widgets`, `features`, and
`entities` are introduced when a product provides concrete owners for them.

See [`docs/architecture/fsd.md`](docs/architecture/fsd.md) for layer criteria,
dependency rules, public APIs, and the extraction strategy.

## Available Scripts

### `pnpm api:generate`

Generates a typed API client from the OpenAPI document configured by
`OPENAPI_URL` in `.env`. The generated client uses Solid Query with the native
Fetch API transport and is written to `src/shared/api/generated`.

Use generated query and mutation primitives for API operations. Keep manual
code in `shared/api` limited to transport concerns such as authentication and
error normalization.

Use `pnpm api:watch` to regenerate the client when a local OpenAPI document
changes.

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
