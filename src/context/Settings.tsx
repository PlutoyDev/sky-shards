import { createContext, useContext, useEffect } from 'react';
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
  const [lightMode, setLightMode] = useLocalStorageState<'false' | 'true' | 'system'>('lightMode', 'system');
  const [language, setLanguage] = useLocalStorageState('language', () => parseUrl().lang ?? 'en');
  const compactMode = useMediaQuery({ maxWidth: '300px' });

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

  useEffect(() => {
    if (i18next.language === language) return;
    const prevLanguage = i18next.language;
    if (!parseUrl().gsTrans && language.endsWith('-GS')) {
      setLanguage(language.slice(0, -3));
      return;
    }
    if (language === 'en') {
      i18next.changeLanguage(language);
      LuxonSettings.defaultLocale = language;
    } else if (import.meta.env.VITE_GS_TRANSLATION_URL && language.endsWith('-GS')) {
      console.log('downloading language resources from Google Sheets', language);
      fetch(`${import.meta.env.VITE_GS_TRANSLATION_URL}?lang=${language.slice(0, -3)}`)
        .then(res => res.json())
        .then(response => {
          if ('error' in response) {
            throw new Error(response.error);
          } else {
            console.log('loaded language resources from Google Sheets', language);
            for (const [ns, res] of Object.entries(response)) {
              i18next.addResourceBundle(language, ns, res);
            }
            return i18next.changeLanguage(language);
          }
        })
        .then(() => {
          LuxonSettings.defaultLocale = language;
        })
        .catch(err => {
          console.error('failed to load language resources', language, err);
          i18next.changeLanguage(prevLanguage);
          setLanguage(prevLanguage);
        });
    } else if (language in languageResources) {
      console.log('downloading language resources for', language);
      languageResources[language]()
        .then(module => {
          if (!module.default) {
            throw new Error('no default export');
          }
          const resources = module.default;
          console.log('loaded language resources', language);
          for (const [ns, res] of Object.entries(resources)) {
            i18next.addResourceBundle(language, ns, res);
          }
          return i18next.changeLanguage(language);
        })
        .then(() => {
          LuxonSettings.defaultLocale = language;
        })
        .catch(err => {
          console.error('failed to load language resources', language, err);
          i18next.changeLanguage(prevLanguage);
          setLanguage(prevLanguage);
        });
    } else {
      console.error('failed to load language resources', language, 'not found');
      i18next.changeLanguage(prevLanguage);
      setLanguage(prevLanguage);
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
