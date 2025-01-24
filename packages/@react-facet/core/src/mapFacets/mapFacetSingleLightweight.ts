import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import { mapIntoObserveSingle } from './mapIntoObserveSingle'

export function mapFacetSingleLightweight<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
  onCleanup?: () => void,
): Facet<M> {
  return {
    get: () => {
      const dependencyValue = facet.get()
      if (dependencyValue === NO_VALUE) return NO_VALUE

      return fn(dependencyValue)
    },

    observe: mapIntoObserveSingle(facet, fn, equalityCheck, onCleanup),
  }
}
