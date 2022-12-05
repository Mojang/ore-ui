import { useCallback, useLayoutEffect, useRef } from 'react'
import { NoValue } from '..'
import { Facet, NO_VALUE, Option, ExtractFacetValues } from '../types'

/**
 * Creates a callback that depends on the value of a facet.
 * Very similar to `useCallback` from `React`
 *
 * @param callback function callback that receives the current facet values and the arguments passed to the callback
 * @param dependencies variable used by the callback that are available in scope (similar as dependencies of useCallback)
 * @param facets facets that the callback listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetCallback<M, Y extends Facet<unknown>[], T extends [...Y], K extends [...unknown[]]>(
  callback: (...args: ExtractFacetValues<T>) => (...args: K) => M,
  dependencies: unknown[],
  facets: T,
): (...args: K) => M | NoValue {
  const facetsRef = useRef<Option<unknown>[]>(facets.map(() => NO_VALUE))

  useLayoutEffect(() => {
    const unsubscribes = facets.map((facet, index) => {
      return facet.observe((value) => {
        facetsRef.current[index] = value
      })
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
    // We care about each individual facet and if any is a different reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, facets)

  // We care about each individual dependency and if any is a different reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callbackMemoized = useCallback(callback, dependencies)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    (...args: K) => {
      const values = facetsRef.current

      for (const value of values) {
        if (value === NO_VALUE) return NO_VALUE
      }

      return callbackMemoized(...(values as ExtractFacetValues<T>))(...(args as K))
    },
    [callbackMemoized, facetsRef],
  )
}
