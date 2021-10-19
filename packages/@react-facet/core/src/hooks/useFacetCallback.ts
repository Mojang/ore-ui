import { useCallback, useRef } from 'react'
import { ReactFacetDevTools } from '@react-facet/dev-tools'
import { NoValue } from '..'
import { Facet, NO_VALUE, Option } from '../types'
import { useFacetEffect } from './useFacetEffect'

/**
 * Creates a callback that depends on the value of a facet.
 * Very similar to `useCallback` from `React`
 *
 * @param callback function callback that receives the current facet value and the arguments passed to the callback
 * @param dependencies variable used by the map that are available in scope (similar as dependencies of useCallback)
 * @param facet facet that the callback listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetCallback<V, T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (value: V) => (...args: any[]) => T | NoValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[],
  facet: Facet<V>,
) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((global as any).__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__ as ReactFacetDevTools).send({
      hookName: 'useFacetCallback',
      facets: [facet],
    })
  }

  const facetRef = useRef<Option<V>>(facet.get())

  useFacetEffect(
    (value) => {
      facetRef.current = value
    },
    [],
    facet,
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callbackMemoized = useCallback(callback, dependencies)

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]): T | NoValue => {
      const value = facetRef.current

      if (value === NO_VALUE) return NO_VALUE

      return callbackMemoized(value)(...args)
    },
    [callbackMemoized, facetRef],
  )
}
