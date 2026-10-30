import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { type InlineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import solid from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";

import { fileURLToPath } from "node:url";

export default (): InlineConfig => {
  const isAnalyze = process.env.BUILD_ANALYZE === "true";

  const plugins = [
    solid(),
    solidSvg({ defaultAsComponent: true }),
    ViteImageOptimizer(),
    ViteMinifyPlugin(),
    isAnalyze && analyzer(),
  ].filter(Boolean);

  return {
    plugins,
    appType: "spa",
    publicDir: "public",
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: fileURLToPath(new URL("../src/", import.meta.url)),
        },
      ],
    },
    css: {
      transformer: "postcss",
      devSourcemap: true,
      modules: {
        generateScopedName: "[path][name]__[local]",
      },
      lightningcss: {
        targets: browserslistToTargets(
          browserslist(undefined, { env: "production" }),
        ),
      },
    },
  };
};
