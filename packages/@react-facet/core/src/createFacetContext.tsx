import { createContext } from 'react'
import { Facet } from './types'

export function createFacetContext<T>(initialValue: T) {
  let warnedAboutInvalidAccess = false
  const facet: Facet<T> = {
    get: () => initialValue,
    observe: (listener) => {
      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' && !warnedAboutInvalidAccess) {
        console.log(
          `Accessing a static facet created through createFacetContext, perhaps you're missing a Context Provider? initialValue: `,
          parseInitialValue(initialValue),
        )
        warnedAboutInvalidAccess = true
      }
      listener(initialValue)
      return () => {}
    },
  }
  const context = createContext(facet)
  return context
}

function parseInitialValue<T>(initialValue: T) {
  try {
    return JSON.stringify(initialValue, null, 2)
  } catch (e) {
    return initialValue
  }
}
