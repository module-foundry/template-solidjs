import { defineConfig } from "eslint/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";

import solid from "eslint-plugin-solid";
import prettier from "eslint-plugin-prettier/recommended";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";

import { fixupConfigRules } from "@eslint/compat";

export default defineConfig([
  prettier,
  ...fixupConfigRules(jsxA11y.flatConfigs.recommended),

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
    extends: [js.configs.recommended],
    plugins: { js },
  },

  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
      globals: globals.browser,
    },
    extends: [
      js.configs.recommended,
      ...(tsEslint.configs.recommendedTypeChecked as any),
      solid.configs["flat/typescript"],
    ],
    plugins: {
      import: importPlugin,
      unicorn,
    },
    rules: {
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: false },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/strict-boolean-expressions": "off",
      complexity: ["warn", 10],
      "default-case": "error",
      "default-param-last": "off",
      eqeqeq: ["error", "always"],
      "import/no-cycle": "error",
      "import/no-mutable-exports": "error",
      "max-depth": ["warn", 8],
      "max-lines": ["warn", 300],
      "max-statements": ["warn", 20],
      "no-alert": "error",
      "no-console": ["error", { allow: ["warn", "error", "debug"] }],
      "no-debugger": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": "error",
      "no-undef": "error",
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-template": "error",
      "solid/event-handlers": "error",
      "solid/jsx-no-duplicate-props": "error",
      "solid/no-destructure": "error",
      "solid/no-innerhtml": "error",
      "solid/no-react-specific-props": "error",
      "solid/prefer-for": "error",
      "sonarjs/pseudo-random": "off",
      "unicorn/explicit-length-check": "error",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-for-loop": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-top-level-await": "off",
      "import/order": "off",
    },
  },

  { ignores: ["./*", "!./src", "!./public"] },
]);
