import { useFacetCallback, Value } from '@react-facet/core'
import { useRemoteFacet } from './context'
import { RemoteFacet } from './types'

interface PropSetter<T extends Value, Prop extends keyof T> {
  (value: T[Prop]): void
}

/**
 * Hook that returns a setter function to a specific property of a given remoteFacet
 * Ex:
 * 	- Given a remote facet { foo: 'bar' }
 *  - Could be used as useRemoteFacetPropSetter(facet, 'foo')
 *  - And the setter would set the foo property
 *
 * @param remoteFacet
 * @param prop the name of the prop to set
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRemoteFacetPropSetter<T extends Record<string, any>, Prop extends keyof T>(
  remoteFacet: RemoteFacet<T>,
  prop: Prop,
): PropSetter<T, Prop> {
  return useFacetCallback(
    (facet) => (newValue: T[Prop]) => {
      facet[prop] = newValue
    },
    [prop],
    [useRemoteFacet(remoteFacet)],
  )
}
