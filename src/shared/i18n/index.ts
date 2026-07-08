import { createSignal, createMemo } from "solid-js";
import { translator, flatten } from "@solid-primitives/i18n";

import { env } from "@/shared/config";

import { dictionaries, type Locales } from "./locales";

const [locale, setLocale] = createSignal<Locales>(
  env.VITE_I18N_FALLBACK_LNG as Locales,
);

const parseLocale = (): void => {
  const localStorageKey = localStorage.getItem(
    env.VITE_I18N_STORAGE_KEY,
  ) as Locales | null;

  if (localStorageKey) {
    setLocale(localStorageKey);
  }
};

const updateLocale = (lang: Locales): void => {
  localStorage.setItem(env.VITE_I18N_STORAGE_KEY, lang);
  setLocale(lang);
};

const dict = createMemo(() => flatten(dictionaries[locale()]));

// eslint-disable-next-line solid/reactivity
const t = translator(dict);

export const i18n = {
  updateLocale,
  parseLocale,
  t,
};
