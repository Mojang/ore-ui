import { Facet } from '..'
/**
 * Creates a nonwritable barebones static facet to be used when you need an initial facet value outside the react context
 * that's meant to be replaced later by a real facet. Ex: with `createContext()`
 */
export function createStaticFacet<T>(value: T): Facet<T> {
  const facet: Facet<T> = {
    get: () => value,
    observe: (listener) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Accessing a fake facet, perhaps you're missing a Context Provider?`)
      }
      listener(value)
      return () => {}
    },
  }
  return facet
}
