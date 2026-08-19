import { safeParse } from "valibot";

import { envSchema, type Env } from "./env.schema";

export const parseEnv = (values: unknown): Env => {
  const result = safeParse(envSchema, values);

  if (!result.success) {
    const issues = result.issues
      .map((issue) => {
        const path =
          issue.path?.map((item) => String(item.key)).join(".") ?? "unknown";

        return `${path}: ${issue.message}`;
      })
      .join("; ");

    throw new Error(`Invalid environment variables: ${issues}`);
  }

  return result.output;
};
