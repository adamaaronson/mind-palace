import { useState, useEffect } from "react";
import { AUTOSAVE_SECONDS } from "../utils/constants";

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

export function setLocalStorageItem<T>(
  key: string,
  value: T,
  version: number = LOCAL_STORAGE_VERSION,
) {
  localStorage.setItem(key, wrapLocalStorageValue(value, version));
}

// read localStorage value
// do not automatically write to localStorage
function useLocalStorageReadOnly<T>(
  key: string,
  initialState: T | (() => T),
  updateStateOnRead: (previousValue: T) => T = (x) => x,
  _version: number = LOCAL_STORAGE_VERSION,
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

  return [value, setValue] as const;
}

// read localStorage value
// write to localStorage every time it changes
export function useLocalStorage<T>(
  key: string,
  initialState: T | (() => T),
  updateStateOnRead: (previousValue: T) => T = (x) => x,
  version: number = LOCAL_STORAGE_VERSION,
) {
  const [value, setValue] = useLocalStorageReadOnly(
    key,
    initialState,
    updateStateOnRead,
    version,
  );

  useEffect(() => {
    setLocalStorageItem(key, value, version);
  }, [key, value, version]);

  return [value, setValue] as const;
}

// read localStorage value
// write to localStorage periodically
export function useLocalStorageInterval<T>(
  key: string,
  initialState: T | (() => T),
  updateStateOnRead: (previousValue: T) => T = (x) => x,
  version: number = LOCAL_STORAGE_VERSION,
) {
  const [value, setValue] = useLocalStorageReadOnly(
    key,
    initialState,
    updateStateOnRead,
    version,
  );
  const [lastStoredTimestamp, setLastStoredTimestamp] = useState(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now > lastStoredTimestamp + AUTOSAVE_SECONDS * 1000) {
      setLocalStorageItem(key, value, version);
      setLastStoredTimestamp(now);
    }
  }, [key, value, version]);

  return [value, setValue] as const;
}
