import { useFacetCallback, Value } from '@react-facet/core'
import { SharedFacet } from './types'
import { useSharedFacet } from './useSharedFacet'

interface PropSetter<T extends Value, Prop extends keyof T> {
  (value: T[Prop]): void
}

/**
 * Hook that returns a setter function to a specific property of a given sharedFacet
 * Ex:
 * 	- Given a shared facet { foo: 'bar' }
 *  - Could be used as useSharedFacetPropSetter(facet, 'foo')
 *  - And the setter would set the foo property
 *
 * @param sharedFacet
 * @param prop the name of the prop to set
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSharedFacetPropSetter<T extends Record<string, any>, Prop extends keyof T>(
  sharedFacet: SharedFacet<T>,
  prop: Prop,
): PropSetter<T, Prop> {
  return useFacetCallback(
    (facet) => (newValue: T[Prop]) => {
      facet[prop] = newValue
    },
    [prop],
    [useSharedFacet(sharedFacet)],
  )
}
