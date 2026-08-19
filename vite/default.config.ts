import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { fileURLToPath } from "node:url";
import { type InlineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { compression } from "vite-plugin-compression2";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import solid from "vite-plugin-solid";
import svgr from "vite-plugin-svgr";

export default (): InlineConfig => {
  const isCompress = process.env.BUILD_COMPRESS === "true";
  const isAnalyze = process.env.BUILD_ANALYZE === "true";

  const plugins = [
    solid(),
    svgr(),
    ViteImageOptimizer(),
    ViteMinifyPlugin(),
    isCompress &&
      compression({
        threshold: 0,
        deleteOriginalAssets: false,
        algorithms: ["gzip", "brotliCompress"],
        include:
          /\.(xml|css|json|js|ts|mjs|svg|yaml|yml|toml|html|txt|woff|woff2|ttf|eot)$/,
      }),
    isAnalyze && analyzer(),
  ].filter(Boolean);

  return {
    plugins,
    appType: "spa",
    publicDir: "public",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../src", import.meta.url)),
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
