import { useCallback, useEffect, useRef } from 'react'
import { Facet, NO_VALUE, ExtractFacetValues, NoValue } from '../types'

/**
 * Creates a callback that depends on the value of a facet.
 * Very similar to `useCallback` from `React`
 *
 * @param callback function callback that receives the current facet values and the arguments passed to the callback
 * @param dependencies variable used by the callback that are available in scope (similar as dependencies of useCallback)
 * @param facets facets that the callback listens to
 * @param defaultReturnValue a default value to be returned by the callback, if the facets don't have any value yet
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetCallback<M, Y extends Facet<unknown>[], T extends [...Y], K extends [...unknown[]]>(
  callback: (...args: ExtractFacetValues<T>) => (...args: K) => M,
  dependencies: unknown[],
  facets: T,
  defaultReturnValue: M,
): (...args: K) => M

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
 *
 * **NOTE:** useFacetCallback does NOT change reference when it's facet dependencies change, so it will not trigger updates for
 * any facet hook that depends on it. If you depend on that a useFacetCallback will re-trigger a downstream hook when it's facet value updates, that will not happen.
 *
 * Suggested solution is to turn the facet callback into a normal callback that accepts the values of the facets as parameters, then put
 * the facets you depend on as parameters to your useFacet-Hook that is used further downstream.
 */
export function useFacetCallback<M, Y extends Facet<unknown>[], T extends [...Y], K extends [...unknown[]]>(
  callback: (...args: ExtractFacetValues<T>) => (...args: K) => M,
  dependencies: unknown[],
  facets: T,
): (...args: K) => M | NoValue

export function useFacetCallback<M, Y extends Facet<unknown>[], T extends [...Y], K extends [...unknown[]]>(
  callback: (...args: ExtractFacetValues<T>) => (...args: K) => M,
  dependencies: unknown[],
  facets: T,
  defaultReturnValue?: M,
): (...args: K) => M | NoValue {
  useEffect(() => {
    // Make sure to start subscriptions, even though we are getting the values directly from them
    // We read the values using `.get` to make sure they are always up-to-date
    const unsubscribes = facets.map((facet) => facet.observe(() => {}))

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
    // We care about each individual facet and if any is a different reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, facets)

  // We care about each individual dependency and if any is a different reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callbackMemoized = useCallback(callback, dependencies)

  // Setup a ref so that the callback instance below can be kept the same
  // when Facet instances change across re-renders
  const facetsRef = useRef(facets)
  facetsRef.current = facets

  return useCallback(
    (...args: K) => {
      const facets = facetsRef.current
      const values = facets.map((facet) => facet.get())

      for (const value of values) {
        if (value === NO_VALUE) return defaultReturnValue !== undefined ? defaultReturnValue : NO_VALUE
      }

      return callbackMemoized(...(values as ExtractFacetValues<T>))(...(args as K))
    },
    [callbackMemoized, defaultReturnValue],
  )
}
