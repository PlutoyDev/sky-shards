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

interface UseSettingsReturn extends Required<SettingsNew> {
  setSettings: (edits: Partial<SettingsNew>, setUrl?: boolean, pushHistory?: boolean) => void;
}

const SettingsContext = createContext<UseSettingsReturn>(null as unknown as UseSettingsReturn);

export function useSettings() {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error('useSettings must be used within a SettingsProvider');
  return settings;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
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

  const setSettings: UseSettingsReturn['setSettings'] = useCallback(
    (edits, setUrl = true, pushHistory = true) => {
      // update url state and push to history
      const origin = window.location.origin;
      internalSetSettings(old => {
        const settings = Object.keys(edits).length === 0 ? old : { ...old, ...edits };
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
          if (pushHistory) history.pushState(null, '', url);
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
    setSettings({}, true, false);

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

  // When lightMode changes, update the theme
  useLegacyEffect(() => {
    if (settings.lightMode === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } else if (settings.lightMode === 'true') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (settings.lightMode === 'false') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [settings.lightMode]);

  // When timezone changes, update the default zone
  useLegacyEffect(() => {
    if (settings.timezone !== LuxonSettings.defaultZone.name) {
      LuxonSettings.defaultZone = settings.timezone;
    }
  }, [settings.timezone]);

  return <SettingsContext.Provider value={{ ...settings, setSettings }}>{children}</SettingsContext.Provider>;
}
