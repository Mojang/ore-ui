import { FacetProp, Facet, isFacet } from '../types'
import { createStaticFacet } from './createStaticFacet'

export const wrapFacets = (facetProps: FacetProp<unknown>[]): Facet<unknown>[] => {
  return facetProps.map((facetProp) => (isFacet(facetProp) ? facetProp : createStaticFacet(facetProp)))
}
