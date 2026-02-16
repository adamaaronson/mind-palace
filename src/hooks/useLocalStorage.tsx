import { useState, useEffect } from "react";

const LOCAL_STORAGE_VERSION = 1;

function wrapLocalStorageValue<T>(value: T, version: number) {
  return JSON.stringify({ version, value });
}

function unwrapLocalStorageValue<T>(localStorageValue: string) {
  const storedValue = JSON.parse(localStorageValue) as {
    version: number;
    value: T;
  };

  return storedValue.value;
}

export function useLocalStorage<T>(
  key: string,
  initialState: T | (() => T),
  updateStateOnRead: (previousValue: T) => T = (x) => x,
  version: number = LOCAL_STORAGE_VERSION,
) {
  const [value, setValue] = useState(() => {
    const localStorageValue = localStorage.getItem(key);

    if (localStorageValue !== null) {
      return updateStateOnRead(unwrapLocalStorageValue<T>(localStorageValue));
    } else if (typeof initialState === "function") {
      return (initialState as () => T)();
    } else {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, wrapLocalStorageValue(value, version));
  }, [key, value]);

  return [value, setValue] as const;
}
