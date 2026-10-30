import generateScopedName from "mini-css-class-name/postcss-modules";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";

import path from "node:path";

import { compilerOptions } from "../tsconfig.json";
import defaultConfig from "./default.config";

export default () => {
  const baseConfig = defaultConfig();
  const isCompress = process.env.BUILD_COMPRESS === "true";

  return defineConfig({
    ...baseConfig,
    base: "/",
    plugins: [
      ...(baseConfig.plugins ?? []),
      isCompress &&
        compression({
          threshold: 0,
          deleteOriginalAssets: false,
          skipIfLargerOrEqual: false,
          algorithms: ["gzip", "brotliCompress"],
          include:
            /\.(xml|css|json|js|ts|mjs|svg|yaml|yml|toml|html|txt|woff|woff2|ttf|eot)$/,
        }),
    ],
    css: {
      ...baseConfig.css,
      modules: {
        generateScopedName: generateScopedName(),
      },
    },
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
          drop_console: ["log", "info", "debug"],
          drop_debugger: true,
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
};
