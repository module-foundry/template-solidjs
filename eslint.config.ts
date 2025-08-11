import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules } from "@eslint/compat";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import solid from "eslint-plugin-solid";
import prettier from "eslint-plugin-prettier/recommended";
import perfectionist from "eslint-plugin-perfectionist";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";

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
      ...(tseslint.configs.recommendedTypeChecked as any),
      solid.configs["flat/typescript"],
      perfectionist.configs["recommended-line-length"],
    ],
    plugins: {
      import: importPlugin,
      unicorn,
    },
    rules: {
      "import/order": ["off"],
      "@typescript-eslint/no-empty-object-type": ["off"],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: false },
      ],
      "@typescript-eslint/strict-boolean-expressions": ["off"],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-unsafe-member-access": "error",
      "no-console": "error",
      "no-debugger": "error",
      "no-alert": "error",
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "arrow-body-style": ["off"],
      "unicorn/prefer-top-level-await": "error",
      "solid/no-react-specific-props": "error",
      "unicorn/explicit-length-check": "error",
      "solid/jsx-no-duplicate-props": "error",
      "object-shorthand": ["error", "always"],
      "import/no-mutable-exports": "error",
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-imports": "off",
      "unicorn/no-array-reduce": "warn",
      "solid/no-destructure": "error",
      "solid/event-handlers": "error",
      "unicorn/no-for-loop": "error",
      "solid/no-innerhtml": "error",
      "no-param-reassign": "error",
      "solid/prefer-for": "error",
      eqeqeq: ["error", "always"],
      "import/no-cycle": "error",
      "unicorn/no-null": "error",
      "no-implied-eval": "error",
      "prefer-template": "error",
      "no-return-await": "error",
      "no-eval": "error",
      "no-var": "error",
      "no-undef": "error",
      complexity: ["warn", 8],
      "max-depth": ["warn", 4],
      "max-lines": ["warn", 300],
      "max-params": ["warn", 4],
      "max-statements": ["warn", 20],
      "prefer-const": ["error", { destructuring: "all" }],
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
    },
  },
  { ignores: ["./*", "!./src", "!./public"] },
]);
