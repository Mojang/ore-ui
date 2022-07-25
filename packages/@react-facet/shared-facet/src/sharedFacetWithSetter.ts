import memoize from './memoize'
import { createFacet, NO_VALUE, Option, FACET_FACTORY } from '@react-facet/core'
import { SharedFacetDriver, SharedFacetWithSetter } from './types'

/**
 * Defines a facet with shared data
 *
 * @param name the name of the facet (used to construct it with the sharedFacetDriver)
 * @param initialValue optional default value while constructor is not ready with the real value
 */
export function sharedFacetWithSetter<T>(name: string, initialValue: Option<T> = NO_VALUE): SharedFacetWithSetter<T> {
  const definition = memoize((sharedFacetDriver: SharedFacetDriver) => {
    const facet = createFacet<T>({
      initialValue,
      startSubscription: (update) => {
        return sharedFacetDriver.observe(name, update)
      },
    })

    const setter = (newValue: T) => {
      sharedFacetDriver.set(name, newValue)
    }

    return [setter, facet]
  }) as unknown as SharedFacetWithSetter<T>

  definition.factory = FACET_FACTORY

  return definition
}
