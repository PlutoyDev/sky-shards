import { createContext, useContext, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import useLocalStorageState from '../hooks/useLocalStorageState';

export interface Settings {
  isTwelveHourMode: boolean;
  isLightMode: boolean;
  isCompactMode: boolean;

  setTwelveHourModeSetting: (value: string) => void;
  setLightMode: (value: string) => void;
  twelveHourModeSetting: string;
  lightMode: string;
}

export const SettingsContext = createContext<Settings>({
  isTwelveHourMode: false,
  isLightMode: false,
  isCompactMode: false,

  setTwelveHourModeSetting: () => console.log('setTwelveHourModeSetting not yet initialized'),
  setLightMode: () => console.log('setLightMode not yet initialized'),

  twelveHourModeSetting: 'system',
  lightMode: 'system',
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsConsumer = SettingsContext.Consumer;

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [twelveHourModeSetting, setTwelveHourModeSetting] = useLocalStorageState('twelveHourMode', 'system');
  const [lightMode, setLightMode] = useLocalStorageState<'false' | 'true' | 'system'>('lightMode', 'system');
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
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
      }
    } else if (lightMode === 'true') {
      document.body.classList.add('light');
    } else if (lightMode === 'false') {
      document.body.classList.remove('light');
    }
  }, [lightMode]);

  return (
    <SettingsContext.Provider
      value={{
        isTwelveHourMode: twelveHourMode,
        isLightMode: boolLightMode,
        isCompactMode: compactMode,

        setTwelveHourModeSetting,
        setLightMode,
        twelveHourModeSetting,
        lightMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
