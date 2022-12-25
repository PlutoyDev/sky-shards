import { useState } from 'react';

export default function useLocalStorageState<T>(key: string, defaultValue?: T, forcedStore?: boolean) {
  const storedValue = localStorage.getItem(key);
  const parsedValue = storedValue && JSON.parse(storedValue);
  const [value, _setValue] = useState(parsedValue ?? defaultValue);

  if (forcedStore) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const setValue = (newValue: T) => {
    _setValue(newValue);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setValue];
}
