import { useMemo } from 'react'
import { defaultEqualityCheck } from '../equalityChecks'
import { createFacet } from '../facet'
import { EqualityCheck, Facet, Option, Setter } from '../types'

/**
 * Provides a parallel to React's useState, but instead returns a facet as the value
 *
 * @param initialValue mandatory initial value (pass NO_VALUE to force it to be uninitialized)
 * @param equalityCheck optional (has a default checker)
 */
export const useFacetState = <V>(
  initialValue: Option<V>,
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): [Facet<V>, Setter<V>] => {
  return useMemo(() => {
    const inlineFacet = createFacet<V>({ initialValue, equalityCheck })
    const setter: Setter<V> = (setter) => {
      if (isSetterCallback(setter)) {
        inlineFacet.setWithCallback(setter)
      } else {
        inlineFacet.set(setter)
      }
    }
    return [inlineFacet, setter]
    /**
     * We ignore the changes to the initialValue since changes to the facet
     * done after creation must only be done through the setter, and we want
     * to ensure not to accidentally put more values in memory.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const isSetterCallback = <V>(
  setter: V | ((previousValue: Option<V>) => Option<V>),
): setter is (previousValue: Option<V>) => Option<V> => {
  return typeof setter === 'function'
}
