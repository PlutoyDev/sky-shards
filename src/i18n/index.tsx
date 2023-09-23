import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resourceEn from './locales/en.json';

// import LanguageDetector from 'i18next-browser-languagedetector';
export type Translation = typeof resourceEn;

i18n
  // .use(LanguageDetector)
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
    resources: Translation;
  }
}

const resources = import.meta.glob(['./locales/*.json', '!./locales/en.json']);

export const languageResources = Object.fromEntries(
  Object.entries(resources).map(([path, loader]) => {
    // remove './locales/' and '.ts'
    const language = path.slice(10, -5);
    return [language, loader];
  }),
) as Record<string, () => Promise<{ default: Translation }>>;

export { default as languageCode } from './codeLangs.json';
