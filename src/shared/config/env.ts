import {
  type InferOutput,
  maxLength,
  minLength,
  object,
  picklist,
  pipe,
  safeParse,
  string,
  url,
} from "valibot";

const envSchema = object({
  MODE: picklist(["development", "production", "test"]),
  VITE_API_URL: pipe(
    string(),
    url("VITE_API_URL must be a valid URL"),
    minLength(5, "VITE_API_URL must be 5 or more symbols"),
  ),
  VITE_I18N_FALLBACK_LNG: pipe(
    string(),
    minLength(2, "VITE_I18N_FALLBACK_LNG must be 2 or more symbols"),
    maxLength(35, "VITE_I18N_FALLBACK_LNG must contain 35 characters or less"),
  ),
  VITE_I18N_STORAGE_KEY: pipe(
    string(),
    minLength(1, "VITE_I18N_STORAGE_KEY must be 1 or more symbols"),
    maxLength(64, "VITE_I18N_STORAGE_KEY must contain 64 characters or less"),
  ),
});

export type Env = InferOutput<typeof envSchema>;

const envs: Record<keyof Env, unknown> = {
  MODE: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_I18N_FALLBACK_LNG: import.meta.env.VITE_I18N_FALLBACK_LNG,
  VITE_I18N_STORAGE_KEY: import.meta.env.VITE_I18N_STORAGE_KEY,
};

export const env = ((): Env => {
  const result = safeParse(envSchema, envs);

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
})();
