import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { loadEnv, type Plugin } from "vite";

const ENV_FILE_PATH = "src/shared/config/env.ts";
const VITE_BUILT_IN_KEYS = new Set(["BASE_URL", "DEV", "MODE", "PROD", "SSR"]);

const getRequiredEnvKeys = (envFile: string): string[] =>
  [
    ...new Set(
      [...envFile.matchAll(/import\.meta\.env\.([A-Z0-9_]+)/gu)]
        .map((match) => match[1])
        .filter((key) => !VITE_BUILT_IN_KEYS.has(key)),
    ),
  ].sort();

export const envGuardPlugin = (): Plugin => ({
  name: "env-guard",
  enforce: "pre",
  config: (_, { mode }) => {
    const envFilePath = resolve(process.cwd(), ENV_FILE_PATH);

    if (!existsSync(envFilePath)) {
      throw new Error(
        `Missing required environment contract: ${ENV_FILE_PATH}`,
      );
    }

    const requiredKeys = getRequiredEnvKeys(readFileSync(envFilePath, "utf8"));
    if (requiredKeys.length === 0) {
      throw new Error(`No import.meta.env keys found in ${ENV_FILE_PATH}.`);
    }

    const env = loadEnv(mode, process.cwd(), "");
    const missingKeys = requiredKeys.filter((key) => !env[key]);

    if (missingKeys.length > 0) {
      throw new Error(
        [
          `Missing required environment variables for ${mode}:`,
          ...missingKeys.map((key) => `- ${key}`),
          "",
          "Define them in .env, a mode-specific .env file, or the shell environment.",
        ].join("\n"),
      );
    }
  },
});
