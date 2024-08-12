import { useMemo } from 'react'
import { createStaticFacet } from '../facet'
import { Facet, FacetProp, isFacet, Value } from '../types'

/**
 * Wraps a FacetProp as a Facet
 * @param value
 */
export function useFacetWrap<T extends Value>(prop: FacetProp<T>): Facet<T> {
  return useMemo(() => (isFacet(prop) ? prop : createStaticFacet(prop)), [prop])
}
