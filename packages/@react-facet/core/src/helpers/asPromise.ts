import { Facet, NO_VALUE } from '../types'

/**
 * Takes a Facet and returns a Promise that will resolve with its first value
 *
 * @param facet
 * @returns Promise<T>
 */
export const asPromise = <T>(facet: Facet<T>) => {
  let resolve: (value: T | PromiseLike<T>) => void = noop

  const promise = new Promise<T>((_resolve) => {
    resolve = _resolve
  })

  const value = facet.get()
  if (value !== NO_VALUE) {
    resolve(value)

    return {
      promise,
      cancel: noop,
    }
  }

  const cleanup = facet.observe(resolve)

  return {
    promise: promise.then((value) => {
      cleanup()
      return value
    }),
    cancel: cleanup,
  }
}

const noop = () => {}
