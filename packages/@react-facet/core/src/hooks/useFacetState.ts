import { ReactFacetDevTools } from '@react-facet/dev-tools'
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
  /**
   * We ignore the changes to the initialValue since changes to the facet
   * done after creation must only be done through the setter, and we want
   * to ensure not to accidentally put more values in memory.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inlineFacet = useMemo(() => createFacet<V>({ initialValue, equalityCheck }), [])

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((global as any).__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__ as ReactFacetDevTools).send({
      hookName: 'useFacetCallback',
      newFacet: inlineFacet,
    })
  }
  return [inlineFacet, inlineFacet.set]
}
