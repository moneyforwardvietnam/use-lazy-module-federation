import { FunctionComponent, lazy, useEffect, useState } from 'react'

export type RemoteModuleProps = {
  url: string
  scope: string
  module: string
}

const componentCache = new Map()
export const useLazyModuleFederation = <T = any,>({
  url,
  scope,
  module,
}: RemoteModuleProps): {
  errorLoading: boolean
  Component: FunctionComponent<T>
} => {
  const key = `${url}-${scope}-${module}`
  const [Component, setComponent] = useState<any>()
  const { ready, errorLoading } = useDynamicScript(url)

  useEffect(() => {
    if (componentCache.get(key)) {
      setComponent(componentCache.get(key))
    } else if (ready && !Component) {
      const Comp = lazy(loadComponent(scope, module))
      componentCache.set(key, Comp)
      setComponent(Comp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Component, ready, key]) // key includes all dependencies (scope/module)

  return { errorLoading, Component }
}

const urlCache = new Set()
const useDynamicScript = (url?: string) => {
  const [ready, setReady] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)

  useEffect(() => {
    if (!url) return

    if (urlCache.has(url)) {
      setReady(true)
      setErrorLoading(false)
      return
    }

    setReady(false)
    setErrorLoading(false)

    const element = document.createElement('script')

    element.src = url
    element.type = 'text/javascript'
    element.async = true

    element.onload = () => {
      urlCache.add(url)
      setReady(true)
    }

    element.onerror = () => {
      setReady(false)
      setErrorLoading(true)
    }

    document.head.appendChild(element)
  }, [url])

  return {
    errorLoading,
    ready,
  }
}

/* eslint-disable */
// @ts-ignore
function loadComponent(scope, module) {
  return async () => {
    // @ts-ignore
    await __webpack_init_sharing__('default') // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    const container = window[scope] // or get the container somewhere else
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default) // Initialize the container, it may provide shared modules
    // @ts-ignore
    const factory = await window[scope].get(module)
    const Module = factory()
    return Module
  }
}
