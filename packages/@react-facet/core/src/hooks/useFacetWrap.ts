import { useMemo } from 'react'
import { defaultEqualityCheck } from '../equalityChecks'
import { createFacet } from '../facet'
import { Facet, FacetProp, isFacet, Value, EqualityCheck } from '../types'

/**
 * Wraps a FacetProp as a Facet
 * @param value
 */
export function useFacetWrap<T extends Value>(
  prop: FacetProp<T>,
  equalityCheck: EqualityCheck<T> = defaultEqualityCheck,
): Facet<T> {
  const is = isFacet(prop)

  /**
   * Inline facet that only created if the provided prop is not a facet.
   *
   * We ignore the dependency change of `prop` since we want to update the inline
   * facet value via the setter below.
   */
  const inlineFacet = useMemo(
    () => (is ? undefined : createFacet<T>({ initialValue: prop as T, equalityCheck })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [is],
  )

  if (inlineFacet === undefined) {
    return prop as Facet<T>
  } else {
    inlineFacet.set(prop as T)
    return inlineFacet
  }
}
