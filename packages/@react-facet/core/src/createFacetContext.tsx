import { createFakeFacet } from './facet/createFakeFacet'
import { createContext } from 'react'

export function createFacetContext<T>(initialValue: T) {
  const facet = createFakeFacet(initialValue)
  const context = createContext(facet)
  return context
}
