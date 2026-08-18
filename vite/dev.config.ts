import { defineConfig } from "vite";

import defaultConfig from "./default.config";

export default () =>
  defineConfig({
    ...defaultConfig(),
    server: {
      hmr: true,
      open: true,
      port: 3000,
      strictPort: true,
    },
    build: {
      minify: false,
      sourcemap: true,
      target: "esnext",
      cssCodeSplit: false,
    },
  });
