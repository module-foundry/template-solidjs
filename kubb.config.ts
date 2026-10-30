import { pluginClient } from "@kubb/plugin-client";
import { pluginTs } from "@kubb/plugin-ts";
import { defineConfig } from "kubb/config";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const { OPENAPI_URL } = loadEnv(mode, process.cwd(), "");

if (!OPENAPI_URL) {
  throw new Error(
    "OPENAPI_URL is required. Add it to .env before generating the API client.",
  );
}

const fileName = ({
  name,
  extname,
}: {
  name: string;
  extname: `.${string}`;
}): `${string}.${string}` => {
  const baseName = name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .toLowerCase();

  return `${baseName}${extname}`;
};

export default defineConfig({
  input: OPENAPI_URL,
  output: {
    path: "./src/shared/api/generated",
    clean: true,
    format: "biome",
  },
  plugins: [
    pluginTs({
      output: { path: "types", mode: "directory", barrel: { type: "named" } },
      resolver: { file: { baseName: fileName } },
    }),
    pluginClient({
      output: { path: "clients", mode: "directory", barrel: { type: "named" } },
      group: { type: "tag" },
      importPath: "../../../client",
      throwOnErrorDefault: true,
      validator: false,
      resolver: { file: { baseName: fileName } },
    }),
  ],
});
