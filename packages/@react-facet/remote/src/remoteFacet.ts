import memoize from './memoize'
import { createFacet, NO_VALUE, Option, FACET_FACTORY } from '@react-facet/core'
import { RemoteFacetDriver, RemoteFacet } from './types'

/**
 * Defines a facet with remote data
 *
 * @param name the name of the facet (used to construct it with the remoteFacetDriver)
 * @param initialValue optional default value while constructor is not ready with the real value
 */
export function remoteFacet<T>(name: string, initialValue: Option<T> = NO_VALUE): RemoteFacet<T> {
  const definition = memoize((remoteFacetDriver: RemoteFacetDriver) =>
    createFacet<T>({
      initialValue,
      startSubscription: (update) => {
        return remoteFacetDriver(name, update)
      },
    }),
  ) as unknown as RemoteFacet<T>

  definition.factory = FACET_FACTORY

  return definition
}
