import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import { mapIntoObserveArray } from './mapIntoObserveArray'
import { createFacet } from '../facet'

export function mapFacetArrayCached<M>(
  facets: Facet<unknown>[],
  fn: (...value: unknown[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
  onCleanup?: () => void,
): Facet<M> {
  const cachedFacet = createFacet<M>({
    // pass the equalityCheck to the mapIntoObserveArray to prevent even triggering the observable
    startSubscription: mapIntoObserveArray(facets, fn, equalityCheck, onCleanup),
    initialValue: NO_VALUE,
  })

  return {
    get: () => {
      const cachedValue = cachedFacet.get()
      if (cachedValue !== NO_VALUE) return cachedValue

      const dependencyValues = facets.map((facet) => facet.get())
      const hasAllValues = dependencyValues.reduce<boolean>((acc, value) => acc && value !== NO_VALUE, true)
      if (!hasAllValues) return NO_VALUE

      const mappedValue = fn(...dependencyValues)
      if (mappedValue !== NO_VALUE) cachedFacet.set(mappedValue)
      return mappedValue
    },
    observe: cachedFacet.observe,
  }
}
