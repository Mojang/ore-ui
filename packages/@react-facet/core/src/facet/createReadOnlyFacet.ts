import { Facet } from '../types'
import { createFacet, FacetOptions } from './createFacet'

export function createReadOnlyFacet<V>(options: FacetOptions<V>): Facet<V> {
  return createFacet(options)
}
