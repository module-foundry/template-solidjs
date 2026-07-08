import { defineConfig } from "vite";

import defaultConfig from "./default.config";

export default () =>
  defineConfig({
    ...defaultConfig(),
    build: {
      target: "esnext",
      sourcemap: true,
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      port: 3000,
      strictPort: true,
      open: true,
      hmr: true,
    },
  });
