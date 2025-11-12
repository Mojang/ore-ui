import { Facet, NO_VALUE } from '../types'
/**
 * Creates a nonwritable barebones static facet to be used when you need an initial facet value outside the react context
 * that's meant to be replaced later by a real facet. Ex: with `createContext()`
 */
export function createStaticFacet<T>(value: T): Facet<T> {
  const facet: Facet<T> = {
    get: () => value,
    observe: (listener) => {
      if (value !== NO_VALUE) {
        listener(value)
      }
      return () => {}
    },
  }
  return facet
}
