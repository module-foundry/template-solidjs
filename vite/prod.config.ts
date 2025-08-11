import { defineConfig } from "vite";

import path from "node:path";
import { manualDeps } from "./utils";

import defaultConfig from "./default.config";
import { compilerOptions } from "../tsconfig.json";

import packageJson from "../package.json";

import type { VITE_EXPORT_PARAMS } from "./types";

export default (params: VITE_EXPORT_PARAMS) =>
  defineConfig({
    ...defaultConfig(params),
    base: "/",
    build: {
      sourcemap: false,
      cssCodeSplit: !params.mode.includes("insertcss"),
      assetsInlineLimit: params.mode.includes("insertcss") ? 0 : undefined,
      cssMinify: "lightningcss",
      outDir: compilerOptions.outDir,
      minify: "terser",
      manifest: false,
      reportCompressedSize: true,
      terserOptions: {
        maxWorkers: 2,
        compress: {
          drop_debugger: true,
          drop_console: true,
          passes: 3,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        treeshake: true,
        output: {
          inlineDynamicImports: false,
          experimentalMinChunkSize: 15_000,
          entryFileNames: "js/[name].[hash].js",
          chunkFileNames: "js/[name].[hash].js",
          assetFileNames: (opt) => {
            const ext = path.extname(opt?.name || "").slice(1);
            return ext ? `${ext}/[name].[hash].${ext}` : "assets/[name].[hash]";
          },
          manualChunks: !params.mode.includes("insertcss") ? {
            vendor: [
              ...manualDeps(packageJson.dependencies, []),
            ],
          } : undefined,
        },
      },
    },
  });
