import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import { mapIntoObserveSingle } from './mapIntoObserveSingle'
import { createFacet } from '../facet'

export function mapFacetSingleCached<T, M>(
  facets: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  return createFacet<M>({
    // pass the equalityCheck to the mapIntoObserveSingle to prevent even triggering the observable
    startSubscription: mapIntoObserveSingle(facets, fn, equalityCheck),
    initialValue: NO_VALUE,
  })
}
