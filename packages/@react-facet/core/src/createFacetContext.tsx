import { createContext } from 'react'
import { Facet } from './types'

export function createFacetContext<T>(initialValue: T) {
  const facet: Facet<T> = {
    get: () => initialValue,
    observe: (listener) => {
      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
        console.log(
          `Accessing a static facet created through createFacetContext, perhaps you're missing a Context Provider?`,
        )
      }
      listener(initialValue)
      return () => {}
    },
  }
  const context = createContext(facet)
  return context
}
