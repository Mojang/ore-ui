import { useCallback, useLayoutEffect, useRef } from 'react'
import { wrapFacets } from '../facet'
import { NO_VALUE, NoValue, Option, FacetProp, ExtractFacetPropValues } from '../types'

/**
 * Creates a callback that depends on the value of a facet.
 * Very similar to `useCallback` from `React`
 *
 * @param callback function callback that receives the current facet values and the arguments passed to the callback
 * @param facetProps facets that the callback listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetCallback<M, Y extends FacetProp<unknown>[], T extends [...Y], K extends [...unknown[]]>(
  callback: (...args: ExtractFacetPropValues<T>) => (...args: K) => M,
  facetProps: T,
): (...args: K) => M | NoValue {
  const facetsRef = useRef<Option<unknown>[]>(facetProps.map(() => NO_VALUE))

  useLayoutEffect(() => {
    const unsubscribes = wrapFacets(facetProps).map((facet, index) => {
      return facet.observe((value) => {
        facetsRef.current[index] = value
      })
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
    // We care about each individual facet and if any is a different reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, facetProps)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    (...args: K) => {
      const values = facetsRef.current

      for (const value of values) {
        if (value === NO_VALUE) return NO_VALUE
      }

      return callback(...(values as ExtractFacetPropValues<T>))(...(args as K))
    },
    [callback, facetsRef],
  )
}
