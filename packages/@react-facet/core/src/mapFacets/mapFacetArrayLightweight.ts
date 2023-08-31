import { mapIntoObserveArray } from './mapIntoObserveArray'
import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'

export function mapFacetArrayLightweight<M>(
  facets: Facet<unknown>[],
  fn: (...value: unknown[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
  onCleanup?: () => void,
): Facet<M> {
  return {
    get: () => {
      const values = facets.map((facet) => facet.get())
      const hasAllValues = values.reduce<boolean>((acc, value) => acc && value !== NO_VALUE, true)
      if (!hasAllValues) return NO_VALUE

      return fn(...values)
    },
    observe: mapIntoObserveArray(facets, fn, equalityCheck, onCleanup),
  }
}
