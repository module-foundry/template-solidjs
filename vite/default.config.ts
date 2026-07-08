import { fileURLToPath } from "node:url";
import { InlineConfig } from "vite";

import solid from "vite-plugin-solid";
import svgr from "vite-plugin-svgr";
import tsPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";
import { analyzer } from "vite-bundle-analyzer";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

import { envGuardPlugin } from "./plugins/env-guard.plugin";

export default (): InlineConfig => {
  const isCompress = process.env.BUILD_COMPRESS === "true";
  const isAnalyze = process.env.BUILD_ANALYZE === "true";

  const plugins = [
    envGuardPlugin(),
    tsPaths(),
    solid(),
    svgr(),
    ViteImageOptimizer(),
    ViteMinifyPlugin(),
    isCompress &&
      compression({
        algorithms: ["gzip", "brotliCompress"],
        deleteOriginalAssets: false,
        include:
          /\.(xml|css|json|js|ts|mjs|svg|yaml|yml|toml|html|txt|woff|woff2|ttf|eot)$/,
        threshold: 0,
      }),
    isAnalyze && analyzer(),
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
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(
          browserslist(undefined, { env: "production" }),
        ),
      },
    },
  };
};
