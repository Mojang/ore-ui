import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import { mapIntoObserveSingle } from './mapIntoObserveSingle'
import { createFacet } from '../facet'

export function mapFacetSingleCached<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  const cachedFacet = createFacet<M>({
    // pass the equalityCheck to the mapIntoObserveArray to prevent triggering the observable in the cachedFacet (bail early)
    startSubscription: mapIntoObserveSingle(facet, fn, equalityCheck),
    initialValue: NO_VALUE,
  })

  return {
    get: () => {
      const cachedValue = cachedFacet.get()
      if (cachedValue !== NO_VALUE) return cachedValue

      const dependencyValue = facet.get()
      if (dependencyValue === NO_VALUE) return NO_VALUE

      const mappedValue = fn(dependencyValue)
      if (mappedValue !== NO_VALUE) cachedFacet.set(mappedValue)
      return mappedValue
    },
    observe: cachedFacet.observe,
  }
}
