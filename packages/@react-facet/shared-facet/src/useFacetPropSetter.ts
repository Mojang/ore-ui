import { Facet, useFacetCallback, Value } from '@react-facet/core'

interface PropSetter<T extends Value, Prop extends keyof T> {
  (value: T[Prop]): void
}

/**
 * Hook that returns a setter function to a specific property of a given Facet
 * Ex:
 * 	- Given a shared facet { foo: 'bar' }
 *  - Could be used as useFacetPropSetter(facet, 'foo')
 *  - And the setter would set the foo property
 *
 * @param Facet
 * @param prop the name of the prop to set
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetPropSetter<T extends Record<string, any>, Prop extends keyof T>(
  facet: Facet<T>,
  prop: Prop,
): PropSetter<T, Prop> {
  return useFacetCallback(
    (facet) => (newValue: T[Prop]) => {
      facet[prop] = newValue
    },
    [prop],
    [facet],
  )
}
