import { createStaticFacet } from './facet/createStaticFacet'
import { createContext } from 'react'

export function createFacetContext<T>(initialValue: T) {
  const facet = createStaticFacet(initialValue)
  const context = createContext(facet)
  return context
}
