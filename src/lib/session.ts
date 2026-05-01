import { useEffect, useState } from "react";

export function useSessionState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) setVal(JSON.parse(raw) as T);
    } catch {}
  }, [key]);
  const set = (v: T) => {
    setVal(v);
    try {
      window.sessionStorage.setItem(key, JSON.stringify(v));
    } catch {}
  };
  return [val, set];
}
