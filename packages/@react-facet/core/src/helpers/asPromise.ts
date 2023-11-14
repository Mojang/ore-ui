import { Facet, NO_VALUE } from '../types'

/**
 * Takes a Facet as returns a Promise that will resolve with its first value
 *
 * @param facet
 * @returns Promise<T>
 */
export const asPromise = <T>(facet: Facet<T>) =>
  new Promise<T>((resolve) => {
    const value = facet.get()
    if (value !== NO_VALUE) {
      resolve(value)
      return
    }

    const cleanup = facet.observe((value: T) => {
      resolve(value)
      cleanup()
    })
  })
