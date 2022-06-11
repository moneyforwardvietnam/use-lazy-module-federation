import { lazy, useEffect, useState } from "react";

const componentCache = new Map();
export const useModuleFederation = <T=any, >(remoteUrl?: string, scope?: string, module?: string): {errorLoading: boolean; Component: T} => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = useState<any>(null);

  const { ready, errorLoading } = useDynamicScript(remoteUrl);
  useEffect(() => {
    if (Component) setComponent(null);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);// Only recalculate when key changes

  useEffect(() => {
    if (ready && !Component) {
      const Comp = lazy(loadComponent(scope, module));
      componentCache.set(key, Comp);
      setComponent(Comp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Component, ready, key]);// key includes all dependencies (scope/module)

  return { errorLoading, Component };
};

const urlCache = new Set();
const useDynamicScript = (url?: string) => {
  const [ready, setReady] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setErrorLoading(false);
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    };

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    errorLoading,
    ready,
  };
};

// @ts-ignore
function loadComponent(scope, module) {
  return async () => {
    // @ts-ignore
    await __webpack_init_sharing__('default'); // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    const container = window[scope]; // or get the container somewhere else    
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default); // Initialize the container, it may provide shared modules
    // @ts-ignore
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

