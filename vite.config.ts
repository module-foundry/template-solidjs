import { defineConfig } from "vite";

export default defineConfig(async ({ command }) => {
  const useProdConfig = command === "build";
  const configModule = useProdConfig
    ? await import("./vite/prod.config")
    : await import("./vite/dev.config");

  return configModule.default();
});
