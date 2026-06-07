import 'server-only'

const dictionaries = {
  ar: () => import('./ar.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale => {
  return locale in dictionaries;
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
}
