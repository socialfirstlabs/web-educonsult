import { en, type TranslationKey } from "@/locales/en";
import { ja } from "@/locales/ja";
import { ne } from "@/locales/ne";

export { locales, defaultLocale, isValidLocale } from "./config";
export type { Locale } from "./config";

const dictionaries: Record<string, Record<TranslationKey, string>> = {
  en,
  ja,
  ne,
};

export function getT(locale: string) {
  const dict = dictionaries[locale] ?? dictionaries.en;
  return (key: TranslationKey) => dict[key];
}
