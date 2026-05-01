import { c as createLucideIcon } from "./AppShell-DYzb_3YL.js";
import { r as reactExports } from "./worker-entry-BBLD3qyQ.js";
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
function useSessionState(key, initial) {
  const [val, setVal] = reactExports.useState(initial);
  reactExports.useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) setVal(JSON.parse(raw));
    } catch {
    }
  }, [key]);
  const set = (v) => {
    setVal(v);
    try {
      window.sessionStorage.setItem(key, JSON.stringify(v));
    } catch {
    }
  };
  return [val, set];
}
export {
  LoaderCircle as L,
  useSessionState as u
};
