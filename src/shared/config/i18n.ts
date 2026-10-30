export const AVAILABLE_LOCALES = ["en", "ru"] as const;

export type Locale = (typeof AVAILABLE_LOCALES)[number];
