import { createSignal } from "solid-js";
import { flatten, translator } from "@solid-primitives/i18n";

import { env, type Locale } from "@/shared/config";
import { dictionaries } from "./locales";

export type { Locale };

const localeLabels: Record<Locale, string> = { en: "English", ru: "Русский" };
const supportedLocales = env.VITE_I18N_SUPPORTED_LOCALES;
const options = supportedLocales.map((value) => ({
  value,
  label: localeLabels[value],
}));
const [locale, setLocale] = createSignal<Locale>(env.VITE_I18N_FALLBACK_LNG);

const isSupportedLocale = (value: unknown): value is Locale => {
  return supportedLocales.some((supported) => supported === value);
};

const parseLocale = (): void => {
  const storedLocale = localStorage.getItem(env.VITE_I18N_STORAGE_KEY);
  const initialLocale = isSupportedLocale(storedLocale)
    ? storedLocale
    : env.VITE_I18N_FALLBACK_LNG;
  setLocale(initialLocale);
  document.documentElement.lang = initialLocale;
};

const updateLocale = (lang: Locale): void => {
  if (!isSupportedLocale(lang)) {
    throw new Error(`Unsupported locale: ${lang}`);
  }
  localStorage.setItem(env.VITE_I18N_STORAGE_KEY, lang);
  setLocale(lang);
  document.documentElement.lang = lang;
};

const flatDictionaries = {
  en: flatten(dictionaries.en),
  ru: flatten(dictionaries.ru),
};
const dict = () => flatDictionaries[locale()];

const t = translator(dict);

export const i18n = {
  t,
  locale,
  options,
  parseLocale,
  updateLocale,
};
