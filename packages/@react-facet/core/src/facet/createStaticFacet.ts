import { Facet } from '../types'

export const createStaticFacet = <T>(value: T): Facet<T> => {
  return {
    get: () => value,
    observe: (listener) => {
      listener(value)
      return () => {}
    },
  }
}
