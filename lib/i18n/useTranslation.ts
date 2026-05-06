import { getT, type Locale } from "./index";

export function useTranslation(locale: Locale) {
  const t = getT(locale);
  return { t, locale };
}
