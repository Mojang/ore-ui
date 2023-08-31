import { createFacet, NO_VALUE, Option, FACET_FACTORY, Facet } from '@react-facet/core'
import { functionCaching } from './functionCaching'
import { SharedFacetDriver, SharedFacet } from './types'

type ArgumentsType = [SharedFacetDriver, () => void, string]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { addToRef, removeFromRef, getFromRef } = functionCaching<ArgumentsType, Facet<any>>()

/**
 * Defines a facet with shared data
 *
 * @param name the name of the facet (used to construct it with the sharedFacetDriver)
 * @param initialValue optional default value while constructor is not ready with the real value
 */
export function sharedFacet<T>(name: string, initialValue: Option<T> = NO_VALUE): SharedFacet<T> {
  return {
    initializer: (sharedFacetDriver, onError) => {
      const cachedFacet = getFromRef([sharedFacetDriver, onError, name])
      if (cachedFacet) return cachedFacet

      const newFacet = createFacet<T>({
        initialValue,
        startSubscription: (update) => {
          const cleanup = sharedFacetDriver(name, update, onError)
          return () => {
            cleanup()
            removeFromRef([sharedFacetDriver, onError, name])
          }
        },
      })

      addToRef([sharedFacetDriver, onError, name], newFacet)

      return newFacet
    },
    factory: FACET_FACTORY,
  }
}
