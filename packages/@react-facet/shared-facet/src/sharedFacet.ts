import { NO_VALUE, Option } from '@react-facet/core'
import { SharedFacet } from './types'
import { safeSharedFacet } from './safeSharedFacet'

/**
 * Defines a facet with shared data
 *
 * @param name the name of the facet (used to construct it with the sharedFacetDriver)
 * @param initialValue optional default value while constructor is not ready with the real value
 */
/**
 * @deprecated use safeSharedFacet instead
 */
export function sharedFacet<T>(name: string, initialValue: Option<T> = NO_VALUE): SharedFacet<T> {
  return safeSharedFacet(name, initialValue)
}
