import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import i18next from 'i18next';
import { Settings as LuxonSettings } from 'luxon';
import useLocalStorageState from '../hooks/useLocalStorageState';
import { languageResources } from '../i18n';
import { parseUrl } from '../utils/parseUrl';

export interface Settings {
  isTwelveHourMode: boolean;
  isLightMode: boolean;
  isCompactMode: boolean;

  setTwelveHourModeSetting: (value: string) => void;
  setLightMode: (value: string) => void;
  setLanguage: (value: string) => void;

  twelveHourModeSetting: string;
  lightMode: string;
  language: string;
  languageLoader?: {
    error?: string;
    loading?: boolean;
    isGS?: boolean;
  };
}

export const SettingsContext = createContext<Settings>({
  isTwelveHourMode: false,
  isLightMode: false,
  isCompactMode: false,

  setTwelveHourModeSetting: () => console.log('setTwelveHourModeSetting not yet initialized'),
  setLightMode: () => console.log('setLightMode not yet initialized'),
  setLanguage: () => console.log('setLanguage not yet initialized'),

  twelveHourModeSetting: 'system',
  lightMode: 'system',
  language: 'en',
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsConsumer = SettingsContext.Consumer;

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [twelveHourModeSetting, setTwelveHourModeSetting] = useLocalStorageState('twelveHourMode', 'system');
  const [lightMode, setLightMode] = useLocalStorageState('lightMode', 'system');
  const [language, setLanguage] = useLocalStorageState('language', () => parseUrl().lang ?? 'en');
  const compactMode = useMediaQuery({ maxWidth: '300px' });
  const [languageLoader, setLanguageLoader] = useState<Settings['languageLoader']>({ loading: false });

  const twelveHourMode =
    twelveHourModeSetting === 'system'
      ? Intl.DateTimeFormat().resolvedOptions().hour12 ?? false
      : twelveHourModeSetting === 'true';

  const boolLightMode =
    lightMode === 'true' || (lightMode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (lightMode === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } else if (lightMode === 'true') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (lightMode === 'false') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [lightMode]);

  const loadLanguage = useCallback(async (language: string, fallbackLang: string) => {
    if (language === fallbackLang) {
      return;
    }
    const isGS = language.endsWith('-GS');
    console.log('downloading language resources', language, isGS);
    setLanguageLoader({ loading: true, isGS });
    try {
      const promise: Promise<Record<string, any>> =
        import.meta.env.VITE_GS_TRANSLATION_URL && isGS
          ? fetch(`${import.meta.env.VITE_GS_TRANSLATION_URL}?lang=${language.slice(0, -3)}`).then(res => res.json())
          : language in languageResources
          ? languageResources[language]()
          : Promise.reject(new Error('not found'));

      const resource = await promise;
      if ('error' in resource) {
        throw new Error(resource.error);
      }

      for (const [ns, res] of Object.entries(resource)) {
        i18next.addResourceBundle(language, ns, res);
      }
      i18next.changeLanguage(language);
      LuxonSettings.defaultLocale = language;
      console.log('loaded language resources', language);
      setLanguageLoader({ loading: false, isGS });
    } catch (err) {
      console.error('failed to load language resources', language, err);
      setLanguageLoader({
        loading: false,
        error:
          err && typeof err === 'string'
            ? err
            : err && typeof err === 'object' && 'message' in err
            ? (err.message as string)
            : 'unknown error',
        isGS,
      });
    }
  }, []);

  useEffect(() => {
    if (i18next.language === language) return;
    const prevLanguage = i18next.language;
    if (language === 'en' || (i18next.hasResourceBundle(language, 'shard') && !language.endsWith('-GS'))) {
      i18next.changeLanguage(language);
      LuxonSettings.defaultLocale = language;
    } else {
      loadLanguage(language, prevLanguage);
    }
  }, [language]);

  return (
    <SettingsContext.Provider
      value={{
        isTwelveHourMode: twelveHourMode,
        isLightMode: boolLightMode,
        isCompactMode: compactMode,

        setTwelveHourModeSetting,
        setLightMode,
        setLanguage,
        twelveHourModeSetting,
        lightMode,
        language,
        languageLoader,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
