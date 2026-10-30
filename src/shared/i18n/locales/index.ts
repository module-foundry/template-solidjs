import { type Locale } from "@/shared/config";
import { type Dict, enDict } from "./en";
import { ruDict } from "./ru";

export const dictionaries = {
  en: enDict,
  ru: ruDict,
} satisfies Record<Locale, Dict>;
