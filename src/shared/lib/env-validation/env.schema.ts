import {
  maxLength,
  minLength,
  object,
  picklist,
  pipe,
  string,
  url,
  type InferOutput,
} from "valibot";

import { LOCALES } from "../../config/i18n";

const MIN_URL_LENGTH = 5;
const MAX_STORAGE_KEY_LENGTH = 64;

export const envSchema = object({
  VITE_I18N_FALLBACK_LNG: picklist(
    LOCALES,
    "VITE_I18N_FALLBACK_LNG must be a supported locale",
  ),
  VITE_API_URL: pipe(
    string(),
    url("VITE_API_URL must be a valid URL"),
    minLength(MIN_URL_LENGTH, "VITE_API_URL must be 5 or more symbols"),
  ),
  VITE_I18N_STORAGE_KEY: pipe(
    string(),
    minLength(1, "VITE_I18N_STORAGE_KEY must be 1 or more symbols"),
    maxLength(
      MAX_STORAGE_KEY_LENGTH,
      "VITE_I18N_STORAGE_KEY must contain 64 characters or less",
    ),
  ),
  VITE_APP_SETTING_LS_AUTH_KEY: pipe(
    string(),
    minLength(1, "VITE_APP_SETTING_LS_AUTH_KEY must be 1 or more symbols"),
    maxLength(
      MAX_STORAGE_KEY_LENGTH,
      "VITE_APP_SETTING_LS_AUTH_KEY must contain 64 characters or less",
    ),
  ),
});

export type Env = InferOutput<typeof envSchema>;
