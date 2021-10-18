import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import { mapIntoObserveArray } from './mapIntoObserveArray'
import { createFacet } from '../facet'

export function mapFacetArrayCached<M>(
  facets: Facet<unknown>[],
  fn: (...value: unknown[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  return createFacet<M>({
    // pass the equalityCheck to the mapIntoObserveArray to prevent even triggering the observable
    startSubscription: mapIntoObserveArray(facets, fn, equalityCheck),
    initialValue: NO_VALUE,
  })
}
