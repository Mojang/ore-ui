import { createContext } from 'react'
import { Facet } from './types'

export function createFacetContext<T>(initialValue: T) {
  const facet: Facet<T> = {
    get: () => initialValue,
    observe: (listener) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Missing Provider')
      }
      listener(initialValue)
      return () => {}
    },
  }
  const context = createContext(facet)
  return context
}
