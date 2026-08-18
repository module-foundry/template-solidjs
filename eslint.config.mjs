import config from "@module-foundry/configs/solidjs/eslint";
import globals from "globals";

export default [
  ...config,
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
];
