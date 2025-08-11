import { createSignal, createMemo } from "solid-js";
import { translator, flatten } from "@solid-primitives/i18n";

import { dictionaries, type Locales } from "./locales";

const [locale, setLocale] = createSignal<Locales>("en");

const parseLocale = (): void => {
  const localStorageKey = localStorage.getItem("t") as Locales | null;
  if (localStorageKey) {
    setLocale(localStorageKey);
  }
};

const updateLocale = (lang: Locales): void => {
  localStorage.setItem("t", lang);
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
