import { createContext, useContext } from 'react';

export interface Settings {
  isTwelveHourMode: boolean;
  isLightMode: boolean;
  isCompactMode: boolean;
}

export const SettingsContext = createContext<Settings>({
  isTwelveHourMode: false,
  isLightMode: false,
  isCompactMode: false,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;
