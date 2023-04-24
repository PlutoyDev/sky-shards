import { createContext, useContext, useState } from 'react';
import { DateTime } from 'luxon';
import useLocalStorageState from '../hooks/useLocalStorageState';

export interface HeaderFx {
  navigateDay: (d: DateTime | number) => void;
  setNavigateDay: (d: (d: DateTime | number) => void) => void;
  fontSize: number;
  setFontSize: (rem: number) => void;
}

const defaultNavigateDay = (d: DateTime | number) => {
  const date = DateTime.now();
  const target = typeof d === 'number' ? date.plus({ days: d }) : d;

  location.href = `/date/${target.toFormat(`yyyy/MM/dd`)}`;
};

export const HeaderFxContext = createContext<HeaderFx>({
  navigateDay: defaultNavigateDay,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNavigateDay: () => {},
  fontSize: 0.8,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFontSize: () => {},
});

export const useHeaderFx = () => useContext(HeaderFxContext);
export const HeaderFxConsumer = HeaderFxContext.Consumer;

export function HeaderFxProvider({ children }: { children: React.ReactNode }) {
  const [navigateDay, _setNavigateDay] = useState(() => defaultNavigateDay);
  const setNavigateDay = (dfx: (d: DateTime | number) => void) => _setNavigateDay(() => dfx);
  const [fontSize, setFontSize] = useLocalStorageState('fontSize', 0.8);
  return (
    <HeaderFxContext.Provider value={{ navigateDay, setNavigateDay, fontSize, setFontSize }}>
      {children}
    </HeaderFxContext.Provider>
  );
}
