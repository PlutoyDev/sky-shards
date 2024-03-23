/*
Handle routing, url manipulation, url parsing, history & state management.

URL Format before v7:
Path: /, /date/{yyyy}/{MM}/{dd}, date/{relDate}
Query: gsTrans=1, lang=xx.

new URL Format:
Path: /, /{yyyy}/{MM}/{dd}, /{lang}/{yyyy}/{MM}/{dd},
Query: gsTrans=1, twelveHour=(true|false|system), lightMode=(true|false|system), timezone.
*/
import { useState, useCallback, createContext, useContext } from 'react';
import i18next from 'i18next';
import { DateTime, SystemZone, Settings as LuxonSettings } from 'luxon';
import useLegacyEffect from '../hooks/useLegacyEffect';
import { languageResources } from '../i18n';

const appZone = 'America/Los_Angeles';

const relDateMap = {
  eytd: -2,
  ereyesterday: -2,
  ytd: -1,
  yesterday: -1,
  tmr: 1,
  tomorrow: 1,
  ovmr: 2,
  overmorrow: 2,
} as const;

function isOldUrlFormat(url: URL) {
  const { pathname, searchParams } = url;
  return pathname.includes('date') || searchParams.has('lang');
}

interface SettingsOld {
  date?: DateTime;
  gsTrans?: boolean;
  lang?: string;
}

function parseOldUrl(url: URL): SettingsOld {
  const ret: SettingsOld = {};

  const { pathname, searchParams } = url;
  if (searchParams.has('gsTrans')) ret.gsTrans = searchParams.get('gsTrans') === '1';
  if (searchParams.has('lang')) ret.lang = searchParams.get('lang')!;

  if (pathname !== '/') {
    const [route, ...params] = pathname.split('/').slice(1);
    if (route === 'date') {
      const [yearStr, monthStr, dayStr] = params;
      const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
      const month = monthStr ? parseInt(monthStr, 10) : 1;
      const day = dayStr ? parseInt(dayStr, 10) : 1;
      if (year && month && day) {
        const date = DateTime.local(year, month, day, { zone: appZone });
        if (date.isValid) {
          if (date < DateTime.local(2022, 10, 1, { zone: appZone })) {
            ret.date = DateTime.local(2022, 10, 1, { zone: appZone });
          } else {
            ret.date = date;
          }
        }
      }
    } else if (route in relDateMap) {
      const date = DateTime.local()
        .setZone(appZone)
        .plus({ days: relDateMap[route as keyof typeof relDateMap] });
      ret.date = date;
    }
  }

  return ret;
}

interface SettingsNew extends SettingsOld {
  twelveHourMode?: 'true' | 'false' | 'system';
  lightMode?: 'true' | 'false' | 'system';
  timezone?: string;
}

function parseNewUrl(url: URL): SettingsNew {
  const ret: SettingsNew = {};

  let { pathname, searchParams } = url;

  // Clean up the pathname
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  console.log('parseNewUrl', { pathname, searchParams });

  if (pathname) {
    const [yearLangOrRel, ...dateParts] = pathname.split('/');
    if (yearLangOrRel) {
      if (yearLangOrRel in relDateMap) {
        // first part is rel date
        ret.date = DateTime.now()
          .setZone(appZone)
          .plus({ days: relDateMap[yearLangOrRel as keyof typeof relDateMap] });
      } else if (!/^\d+$/.test(yearLangOrRel)) {
        // first part is lang
        ret.lang = yearLangOrRel;
      } else {
        // first part is year
        dateParts.unshift(yearLangOrRel);
      }

      if (dateParts.length !== 0) {
        // parse the dates
        const [yearStr, monthStr, dayStr] = dateParts;
        const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
        const month = monthStr ? parseInt(monthStr, 10) : 1;
        const day = dayStr ? parseInt(dayStr, 10) : 1;
        if (year && month && day) {
          ret.date = DateTime.local(year, month, day, { zone: appZone });
        }
      }
    }
  }

  //Parse the query params
  const gsTrans = searchParams.has('gsTrans') ? searchParams.get('gsTrans') === '1' : false;
  if (gsTrans) ret.gsTrans = gsTrans;
  const twelveHourMode = searchParams.get('twelveHour') as 'true' | 'false' | 'system';
  if (twelveHourMode) ret.twelveHourMode = twelveHourMode;
  const lightMode = searchParams.get('lightMode') as 'true' | 'false' | 'system';
  if (lightMode) ret.lightMode = lightMode;
  const timezone = searchParams.get('timezone');
  if (timezone) ret.timezone = timezone;

  return ret;
}

function getLocalStorageSettings(): SettingsNew {
  // Check if this is SSR
  if (!('localStorage' in globalThis)) return {};
  const ret: SettingsNew = {};
  const twelveHourMode = JSON.parse(localStorage.getItem('twelveHourMode') ?? 'null') as
    | 'true'
    | 'false'
    | 'system'
    | null;
  if (twelveHourMode) ret.twelveHourMode = twelveHourMode;
  const lightMode = JSON.parse(localStorage.getItem('lightMode') ?? 'null') as 'true' | 'false' | 'system' | null;
  if (lightMode) ret.lightMode = lightMode;
  const timezone = JSON.parse(localStorage.getItem('timezone') ?? 'null');
  if (timezone) ret.timezone = timezone;
  const language = localStorage.getItem('language');
  if (language) {
    ret.lang = language;
  }

  const settingsV2 = localStorage.getItem('settingsV2');
  if (settingsV2) {
    try {
      const parsed = JSON.parse(settingsV2);
      if (parsed) {
        Object.assign(ret, parsed);
      }
    } catch (err) {
      console.error('Failed to parse settingsV2', err);
    }
  }

  return ret;
}

function setLocalStorageSettings(settings: Partial<SettingsNew>) {
  // Check if this is SSR
  if (!('localStorage' in globalThis)) return;
  // Clear V1 settings
  localStorage.removeItem('twelveHourMode');
  localStorage.removeItem('lightMode');
  localStorage.removeItem('timezone');
  localStorage.removeItem('language');

  if ('date' in settings) {
    settings = { ...settings };
    delete settings.date;
  }

  // Set new settings
  localStorage.setItem('settingsV2', JSON.stringify(settings));
}

function getDefault(): Required<SettingsNew> {
  let lang: string = 'en';

  if (navigator.language) {
    if (navigator.language in languageResources) {
      lang = navigator.language;
    }
    const shortLang = navigator.language.slice(0, 2);
    if (shortLang in languageResources) {
      lang = shortLang;
    }
  }

  try {
    for (const l of navigator.languages) {
      if (l.slice(0, 2) == 'en') {
        lang = 'en';
        break;
      }
      if (l in languageResources) {
        lang = l;
        break;
      }
    }
  } catch (err) {
    console.error('Failed to get navigator languages', err);
  }

  return {
    date: DateTime.now().setZone(appZone).startOf('day'),
    gsTrans: false,
    lang,
    lightMode: 'system',
    twelveHourMode: 'system',
    timezone: SystemZone.instance.name,
  };
}

async function setLanguage(
  language: string,
  setLanguageLoader: (state: { loading: boolean; error?: string } | null) => void,
) {
  if (language === 'en' || (i18next.hasResourceBundle(language, 'shard') && !language.endsWith('-GS'))) {
    i18next.changeLanguage(language);
    document.documentElement.lang = LuxonSettings.defaultLocale = language;
  } else {
    // Load the language
    setLanguageLoader({ loading: true });
    const isGS = language.endsWith('-GS');
    try {
      const promise =
        import.meta.env.VITE_GS_TRANSLATION_URL && isGS
          ? fetch(`${import.meta.env.VITE_GS_TRANSLATION_URL}?lang=${language.slice(0, -3)}`, {
              credentials: 'omit',
            }).then(res => res.json())
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
      document.documentElement.lang = LuxonSettings.defaultLocale = isGS ? language.slice(0, -3) : language;
      console.log('loaded language resources', language);
      setLanguageLoader({ loading: false });
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
      });
      setTimeout(() => setLanguageLoader(null), 2000);
    }
  }
}

function setLightMode(lightMode: 'true' | 'false' | 'system') {
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
}

function setTimezone(timezone: string) {
  LuxonSettings.defaultZone = timezone;
}

type LanguageLoader = { loading: boolean; error?: string } | null;
type SetSettings = (edits?: Partial<SettingsNew>, setUrl?: boolean, pushHistory?: boolean) => void;

interface UseSettingsReturn extends Required<SettingsNew> {
  languageLoader: LanguageLoader;
  setSettings: SetSettings;
}

const SettingsContext = createContext<UseSettingsReturn>(null as unknown as UseSettingsReturn);

export function useSettings() {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error('useSettings must be used within a SettingsProvider');
  return settings;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [languageLoader, setLanguageLoader] = useState<LanguageLoader>(null);
  const [settings, internalSetSettings] = useState<Required<SettingsNew>>(() => {
    const def = getDefault();
    const local = getLocalStorageSettings();
    const url = new URL(window.location.href);
    if (isOldUrlFormat(url)) {
      const parsed = parseOldUrl(url);
      return { ...def, ...local, ...parsed };
    } else {
      const parsed = parseNewUrl(url);
      return { ...def, ...local, ...parsed };
    }
  });

  useLegacyEffect(() => {}, [settings.lightMode, settings.timezone, settings.lang]);

  const setSettings: SetSettings = useCallback(
    (edits, setUrl = true, pushHistory = true) => {
      // update url state and push to history
      const origin = window.location.origin;
      internalSetSettings(old => {
        const isInit = edits === undefined;
        const settings = isInit ? old : { ...old, ...edits };

        if (isInit || (edits && 'lightMode' in edits && edits.lightMode !== old.lightMode)) {
          setLightMode(settings.lightMode);
        }

        if (isInit || (edits && 'timezone' in edits && edits.timezone !== old.timezone)) {
          setTimezone(settings.timezone);
        }

        if (isInit || (edits && 'lang' in edits && edits.lang !== old.lang)) {
          setLanguage(settings.lang, setLanguageLoader).catch(err => {
            console.error('Failed to set language', err);
            setLanguage(isInit ? 'en' : old.lang, setLanguageLoader);
          });
        }

        const def = getDefault();
        let path = '/' + settings.lang;
        if (!settings.date.hasSame(def.date, 'day')) {
          path += '/' + settings.date.toFormat('yyyy/MM/dd');
        }
        const url = new URL(path, origin);
        const urlParams = new URLSearchParams();
        if (settings.gsTrans !== def.gsTrans) urlParams.set('gsTrans', '1');
        if (settings.twelveHourMode !== def.twelveHourMode) urlParams.set('twelveHour', settings.twelveHourMode);
        if (settings.lightMode !== def.lightMode) urlParams.set('lightMode', settings.lightMode);
        if (settings.timezone !== def.timezone) urlParams.set('timezone', settings.timezone);
        url.search = urlParams.toString();
        if (setUrl) {
          if (pushHistory && !isInit) history.pushState(null, '', url);
          else history.replaceState(null, '', url);
        }
        setLocalStorageSettings(settings);
        return settings;
      });
    },
    [internalSetSettings],
  );

  useLegacyEffect(() => {
    // Set the initial settings from the url
    setSettings();

    // Listen for popstate events to update the settings
    const handlePopState = () => {
      const url = new URL(window.location.href);
      if (isOldUrlFormat(url)) {
        const parsed = parseOldUrl(url);
        internalSetSettings(old => ({ ...old, ...parsed }));
      } else {
        const parsed = parseNewUrl(url);
        internalSetSettings(old => ({ ...old, ...parsed }));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, languageLoader, setSettings }}>{children}</SettingsContext.Provider>
  );
}
