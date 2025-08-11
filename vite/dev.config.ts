import { defineConfig } from "vite";

import defaultConfig from "./default.config";

import type { VITE_EXPORT_PARAMS } from "./types";

export default (params: VITE_EXPORT_PARAMS) =>
  defineConfig({
    ...defaultConfig(params),
    build: {
      target: "esnext",
      sourcemap: false,
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
