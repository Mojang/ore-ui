import { useEffect, useMemo } from 'react'
import { defaultEqualityCheck } from '../equalityChecks'
import { createFacet } from '../facet'
import { Facet, FacetProp, isFacet, Value, EqualityCheck } from '../types'

/**
 * Wraps a FacetProp as a Facet, ensuring the resulting Facet is memoized (even if the wrapped value changes)
 * @param value
 */
export function useFacetWrapMemo<T extends Value>(
  prop: FacetProp<T>,
  equalityCheck: EqualityCheck<T> = defaultEqualityCheck,
): Facet<T> {
  /**
   * Inline facet that only created if the provided prop is not a facet.
   *
   * We ignore the dependency change of `prop` since we want to update the inline
   * facet value via the setter below.
   */
  const inlineFacet = useMemo(
    () => createFacet<T>({ initialValue: prop as T, equalityCheck }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    const is = isFacet(prop)
    if (is) {
      return prop.observe(inlineFacet.set)
    }

    inlineFacet.set(prop as T)
  }, [prop, inlineFacet])

  return inlineFacet
}
