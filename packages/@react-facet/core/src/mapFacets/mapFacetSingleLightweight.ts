import { defaultEqualityCheck } from '../equalityChecks'
import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import {
  mapIntoObserveSingle,
  mapIntoObserveSingleCustomEqualityCheck,
  mapIntoObserveSingleDefaultEqualityCheck,
} from './mapIntoObserveSingle'

export function mapFacetSingleLightweight<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  return {
    get: () => {
      const dependencyValue = facet.get()
      if (dependencyValue === NO_VALUE) return NO_VALUE

      return fn(dependencyValue)
    },

    observe:
      // Most common scenario is not having any equality check
      equalityCheck === undefined
        ? mapIntoObserveSingle(facet, fn)
        : // Then we optimize for the second most common scenario of using the defaultEqualityCheck (by inline its implementation)
        equalityCheck === defaultEqualityCheck
        ? mapIntoObserveSingleDefaultEqualityCheck(facet, fn)
        : // Otherwise we use the custom equality check
          mapIntoObserveSingleCustomEqualityCheck(facet, fn, equalityCheck),
  }
}
