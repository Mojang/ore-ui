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
export function sharedDynamicSelector<V, P, Y extends readonly SharedFacet<unknown>[], T extends [...Y]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectorFactory: (
    parameter: P,
  ) => [(...args: { [K in keyof T]: T[K] extends SharedFacet<infer V> ? V : never }) => V | NoValue, T],
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): (parameter: P) => SharedFacet<V> {
  return memoize((parameter: P) => {
    const [selector, facets] = selectorFactory(parameter)

    const definition = memoize((sharedFacetDriver: SharedFacetDriver) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (sharedSelector as any)(selector, facets, equalityCheck)(sharedFacetDriver)
    }) as unknown as SharedFacet<V>

    definition.factory = FACET_FACTORY

    return definition
  })
}
