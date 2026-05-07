import { useEffect, useState } from "react";

export function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onRoute = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onRoute);
    return () => window.removeEventListener("popstate", onRoute);
  }, []);

  return path;
}
