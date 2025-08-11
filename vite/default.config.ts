// vite/default.config.ts
import { fileURLToPath } from "node:url";
import { InlineConfig } from "vite";

import { normalizeFlags } from "./utils";

import solid from "vite-plugin-solid";
import svgr from "vite-plugin-svgr";
import tsPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";
import { analyzer } from "vite-bundle-analyzer";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import type { VITE_EXPORT_PARAMS } from "./types";

export default (params: VITE_EXPORT_PARAMS): InlineConfig => {
  const flags = normalizeFlags(params.mode);

  const plugins = [
    tsPaths(),
    solid(),
    svgr(),
    ViteImageOptimizer(),
    ViteMinifyPlugin(),
    flags.inlineCss &&
      viteSingleFile({
        inlinePattern: ["**/*.css"],
      }),
    flags.compress &&
      compression({
        algorithms: ["gzip", "brotliCompress"],
        deleteOriginalAssets: false,
        include: /\.(xml|css|json|js|ts|mjs|svg|yaml|yml|toml)$/,
      }),
    flags.analyze && analyzer(),
  ].filter(Boolean);

  return {
    appType: "spa",
    publicDir: "public",
    plugins,
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("../src/shared/styles", import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer(), cssnano()],
      },
    },
  };
};
