import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  { rules: { "fsd/insignificant-slice": "off" } },
  {
    // Static assets have an explicit project-wide public API by convention.
    files: ["./src/shared/assets", "./src/shared/assets/**"],
    rules: { "fsd/segments-by-purpose": "off" },
  },
]);
