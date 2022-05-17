import memoize from './memoize'
import { createFacet, NO_VALUE, Option, FACET_FACTORY } from '@react-facet/core'
import { SharedFacetDriver, SharedFacet } from './types'

/**
 * Defines a facet with shared data
 *
 * @param name the name of the facet (used to construct it with the sharedFacetDriver)
 * @param initialValue optional default value while constructor is not ready with the real value
 */
export function sharedFacet<T>(
  name: string,
  initialValue: Option<T> = NO_VALUE,
  instanceName?: string,
): SharedFacet<T> {
  const definition = memoize((sharedFacetDriver: SharedFacetDriver) =>
    createFacet<T>({
      initialValue,
      startSubscription: (update) => {
        return sharedFacetDriver(name, update, undefined, null, instanceName)
      },
    }),
  ) as unknown as SharedFacet<T>

  definition.factory = FACET_FACTORY

  return definition
}
