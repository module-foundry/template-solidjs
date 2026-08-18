import path from "node:path";
import { defineConfig } from "vite";

import defaultConfig from "./default.config";

import { compilerOptions } from "../tsconfig.json";

export default () =>
  defineConfig({
    ...defaultConfig(),
    base: "/",
    build: {
      manifest: false,
      minify: "terser",
      sourcemap: false,
      cssCodeSplit: false,
      cssMinify: "lightningcss",
      reportCompressedSize: true,
      outDir: compilerOptions.outDir,
      terserOptions: {
        maxWorkers: 4,
        format: {
          comments: false,
        },
        compress: {
          passes: 5,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.info", "console.debug"],
        },
      },
      rollupOptions: {
        treeshake: true,
        output: {
          inlineDynamicImports: false,
          experimentalMinChunkSize: 15_000,
          chunkFileNames: "js/[name].[hash].js",
          entryFileNames: "js/[name].[hash].js",
          assetFileNames: (opt) => {
            const ext = path.extname(opt.name || "").slice(1);

            return ext ? `${ext}/[name].[hash].${ext}` : "assets/[name].[hash]";
          },
        },
      },
    },
  });
