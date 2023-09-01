import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import resourceEn from './en';

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
    resources: typeof resourceEn;
  }
}

const resources = import.meta.glob(['./*.ts', '!./en.ts', '!./template.ts']);

export const languageResources = Object.fromEntries(
  Object.entries(resources).map(([path, loader]) => {
    // remove './' and '.ts'
    const language = path.slice(2, -3);
    return [language, loader];
  }),
) as Record<string, () => Promise<{ default: typeof resourceEn }>>;

export const languageCode = {
  en: 'English',
  zh: '简体中文',
  jp: '日本語',
};
