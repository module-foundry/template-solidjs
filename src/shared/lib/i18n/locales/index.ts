import { enDict } from "./en";
import { ruDict } from "./ru";

export const dictionaries = {
  en: enDict,
  ru: ruDict,
};

export type Locales = keyof typeof dictionaries;
export type Dict = typeof enDict;
