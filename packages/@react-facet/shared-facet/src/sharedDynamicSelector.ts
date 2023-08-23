import memoize from './memoize'
import { defaultEqualityCheck, EqualityCheck, FACET_FACTORY, NoValue } from '@react-facet/core'
import { SharedFacetDriver, SharedFacet } from './types'
import { sharedSelector } from './sharedSelector'

/**
 * Defines a selector that can take a parameter
 * For more information check the documentation on defining a selector.
 *
 * @param selectorFactory differently from a selector, this is a function that takes the parameter to return the selector
 * @param equalityCheck optional, has a default for immutable values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sharedDynamicSelector<V, P, Y extends readonly SharedFacet<any>[], T extends [...Y]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectorFactory: (
    parameter: P,
  ) => [(...args: { [K in keyof T]: T[K] extends SharedFacet<infer V> ? V : never }) => V | NoValue, T],
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): (parameter: P) => SharedFacet<V> {
  return memoize((parameter: P) => {
    const [selector, facets] = selectorFactory(parameter)

    return {
      initializer: memoize((sharedFacetDriver: SharedFacetDriver) => {
        return sharedSelector(selector, facets, equalityCheck).initializer(sharedFacetDriver)
      }),
      factory: FACET_FACTORY,
    }
  })
}
