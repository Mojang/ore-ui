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
      const value = facet.get()
      if (value === NO_VALUE) return NO_VALUE

      return fn(value)
    },

    observe: mapIntoObserveSingle(facet, fn, equalityCheck, onCleanup),
  }
}
