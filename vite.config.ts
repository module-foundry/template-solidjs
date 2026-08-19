import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

import { parseEnv } from "./src/shared/lib/env-validation";

const PROJECT_ROOT = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(async ({ mode, command }) => {
  parseEnv(loadEnv(mode, PROJECT_ROOT, "VITE_"));

  const useProdConfig = command === "build";
  const configModule = useProdConfig
    ? await import("./vite/prod.config")
    : await import("./vite/dev.config");

  return configModule.default();
});
