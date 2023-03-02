import { useCallback, useLayoutEffect } from 'react'
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
  useLayoutEffect(() => {
    // Make sure to start subscriptions, even though we are getting the values directly from them
    // We read the values using `.get` to make sure they are always up-to-date
    const unsubscribes = facets.map((facet) => facet.observe(noop))

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
      const values = facets.map((facet) => facet.get())

      for (const value of values) {
        if (value === NO_VALUE) return defaultReturnValue != null ? defaultReturnValue : NO_VALUE
      }

      return callbackMemoized(...(values as ExtractFacetValues<T>))(...(args as K))
    },
    [callbackMemoized, defaultReturnValue, ...facets],
  )
}

const noop = () => {}
