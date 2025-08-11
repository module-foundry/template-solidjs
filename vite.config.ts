import { defineConfig } from "vite";

import type { BuildMode } from "./vite/types";

export default defineConfig(async ({ mode, command }) => {
  const configModule =
    command === "build"
      ? await import("./vite/prod.config")
      : await import("./vite/dev.config");

  return configModule.default({ mode: mode as BuildMode });
});
