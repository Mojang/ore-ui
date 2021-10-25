import { ReactFacetDevTools } from '@react-facet/dev-tools'
import { useCallback, useLayoutEffect } from 'react'
import { Facet, Effect } from '../types'

/**
 * Allows using a selector to perform imperative code (manual DOM manipulations)
 *
 * @param effect function that will do the side-effect (ex: update the DOM)
 * @param dependencies variable used by the map that are available in scope (similar as dependencies of useEffect)
 * @param facet facet that the effect listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetEffect<V>(
  effect: Effect<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[],
  facet: Facet<V>,
) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((global as any).__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__ as ReactFacetDevTools).send({
      hookName: 'useFacetEffect',
      facets: [facet],
    })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const effectMemoized = useCallback(effect, dependencies)
  useLayoutEffect(() => facet.observe(effectMemoized), [facet, effectMemoized])
}
