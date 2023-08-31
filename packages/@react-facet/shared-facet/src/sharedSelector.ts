/* eslint-disable @typescript-eslint/no-explicit-any */
import { EqualityCheck, defaultEqualityCheck, mapFacetsCached, FACET_FACTORY, NoValue, Facet } from '@react-facet/core'
import { SharedFacetDriver, SharedFacet } from './types'
import { functionCaching } from './functionCaching'

export type ExtractFacetValues<T extends ReadonlyArray<SharedFacet<unknown>>> = {
  [K in keyof T]: T[K] extends SharedFacet<infer V> ? V : never
}

type SharedFacetarray = SharedFacet<any>[]
type ArgumentsType = [SharedFacetDriver, () => void, (...args: any) => any | NoValue, ...SharedFacetarray]

const { addToRef, removeFromRef, getFromRef } = functionCaching<ArgumentsType, Facet<any>>()

/**
 * Defines a selector to transform/map data from a facet
 *
 * When used correctly, it can limit components being re-rendered if they only
 * care about a specific attribute/function of a facet.
 *
 * To take full advantage of a selector, it is important to choose a proper equalityCheck
 * with an IMPORTANT understanding of the source of the data (if it is mutable for example).
 *
 * If the source of the data is an object or array that is being mutated, then it would mean that
 * the current and previous values passed to the equalityCheck would be same reference, making it
 * impossible to run any equality check. We recommend only using an equality check if the values
 * returned by the selector are numbers, booleans, strings, or objects/arrays constructed by the selector.
 *
 * @param facets which facets to read the data from
 * @param selector a function to transform the data from the facets
 * @param equalityCheck optional, has a default for immutable values
 */
export function sharedSelector<V, Y extends SharedFacet<any>[], T extends [...Y]>(
  selector: (...args: ExtractFacetValues<T>) => V | NoValue,
  facets: T,
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): SharedFacet<V> {
  return {
    initializer: (sharedFacetDriver, onError) => {
      const cachedFacet = getFromRef([sharedFacetDriver, onError, selector, ...facets])
      if (cachedFacet) return cachedFacet

      const newFacet = mapFacetsCached(
        facets.map((facet) => facet.initializer(sharedFacetDriver, onError)),
        selector as (...args: unknown[]) => ReturnType<typeof selector>,
        equalityCheck,
        () => {
          removeFromRef([sharedFacetDriver, onError, selector, ...facets])
        },
      )

      addToRef([sharedFacetDriver, onError, selector, ...facets], newFacet)
      return newFacet
    },
    factory: FACET_FACTORY,
  }
}
