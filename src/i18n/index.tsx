import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourceEn from './en';

// const languageResources = import.meta.glob(['./*.json', '!./en.json']);
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: resourceEn,
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
    resources: typeof resourceEn;
  }
}
