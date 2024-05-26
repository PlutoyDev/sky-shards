import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resourceEn from './en.json';
import { translations, codeLangs } from './locales.json';

export type Translation = typeof resourceEn;

i18n.use(initReactI18next).init({
  resources: {
    en: resourceEn,
    ...translations,
  },
  fallbackLng: 'en',
  debug: import.meta.env.DEV,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Translation;
  }
}

codeLangs['en'] = 'English';

export const languageCode = codeLangs;
