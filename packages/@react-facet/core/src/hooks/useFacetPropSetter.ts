import { useMemo } from 'react'
import { WritableFacet, Value, NO_VALUE } from '../types'

interface PropSetter<T extends Value, Prop extends keyof T> {
  (value: T[Prop]): void
}

/**
 * Hook that returns a setter function to a specific property of a given a localFacet
 * Ex:
 * 	- Given a local facet { foo: 'bar' }
 *  - Could be used as useFacetSetter(facet, 'foo')
 *  - And the setter would set the foo property
 *
 * @param facet
 * @param prop the name of the prop to set
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetPropSetter<T extends Record<string, any>, Prop extends keyof T>(
  facet: WritableFacet<T>,
  prop: Prop,
): PropSetter<T, Prop> {
  return useMemo(
    () => (value: T[Prop]) => {
      facet.setWithCallback((prev) => ({ ...(prev !== NO_VALUE ? prev : {}), [prop]: value } as unknown as T))
    },
    [facet, prop],
  )
}
