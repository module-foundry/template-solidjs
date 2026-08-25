import { defineConfig } from "orval";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const { OPENAPI_URL } = loadEnv(mode, process.cwd(), "");

if (!OPENAPI_URL) {
  throw new Error(
    "OPENAPI_URL is required. Add it to .env before generating the API client.",
  );
}

export default defineConfig({
  api: {
    input: OPENAPI_URL,
    output: {
      clean: true,
      mode: "tags-split",
      httpClient: "fetch",
      client: "solid-query",
      namingConvention: "kebab-case",
      target: "./src/shared/api/generated/api.ts",
      schemas: "./src/shared/api/generated/models",
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          signal: true,
          useInfinite: false,
        },
        mutator: {
          name: "apiRequest",
          path: "./src/shared/api/index.ts",
        },
      },
    },
  },
});
