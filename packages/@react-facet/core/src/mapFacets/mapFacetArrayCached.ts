import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'
import { mapIntoObserveArray } from './mapIntoObserveArray'
import { createFacet } from '../facet'

export function mapFacetArrayCached<M>(
  facets: Facet<unknown>[],
  fn: (...value: unknown[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  const initialValues = facets.map((facet) => facet.get())
  const hasAllValues = initialValues.reduce<boolean>((prev, curr) => prev && curr !== NO_VALUE, true)
  return createFacet<M>({
    // pass the equalityCheck to the mapIntoObserveArray to prevent even triggering the observable
    startSubscription: mapIntoObserveArray(facets, fn, equalityCheck),
    initialValue: hasAllValues ? fn(...initialValues) : NO_VALUE,
  })
}
