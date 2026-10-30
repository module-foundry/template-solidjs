import {
  array,
  check,
  type InferOutput,
  maxLength,
  minLength,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  url,
} from "valibot";

import { AVAILABLE_LOCALES } from "../../config/i18n";

const MIN_URL_LENGTH = 5;
const MAX_STORAGE_KEY_LENGTH = 64;

const localeSchema = picklist(
  AVAILABLE_LOCALES,
  "Locale must match an available dictionary",
);

export const envSchema = pipe(
  object({
    VITE_I18N_SUPPORTED_LOCALES: pipe(
      optional(string(), AVAILABLE_LOCALES.join(",")),
      transform((value) => value.split(",").map((locale) => locale.trim())),
      array(localeSchema),
      check(
        (locales) => new Set(locales).size === locales.length,
        "VITE_I18N_SUPPORTED_LOCALES must not contain duplicates",
      ),
    ),
    VITE_I18N_FALLBACK_LNG: picklist(
      AVAILABLE_LOCALES,
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
  }),
  check(
    (values) =>
      values.VITE_I18N_SUPPORTED_LOCALES.includes(
        values.VITE_I18N_FALLBACK_LNG,
      ),
    "VITE_I18N_FALLBACK_LNG must be included in VITE_I18N_SUPPORTED_LOCALES",
  ),
);

export type Env = InferOutput<typeof envSchema>;
