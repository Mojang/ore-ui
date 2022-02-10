import { useCallback, useMemo } from 'react'
import { defaultEqualityCheck } from '../equalityChecks'
import { mapFacetsCached } from '../mapFacets'
import { EqualityCheck, Facet, NoValue, Value, ExtractFacetValues } from '../types'

/**
 * Helper hook that allows mapping a value from a facet with local variables/props in a React component
 *
 * @param selector function that takes value from provided facets and maps them to a new value
 * @param dependencies variable used by the selector that are available in scope (similar as dependencies of useEffect)
 * @param facets facets that we will listen for its values to be mapped
 * @param equalityCheck optional, has a default for immutable values
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 *
 * @returns a new facet definition that can be consumed as a regular facet
 */
export function useFacetMemo<M extends Value, Y extends Facet<unknown>[], T extends [...Y]>(
  selector: (...args: ExtractFacetValues<T>) => M | NoValue,
  dependencies: unknown[],
  facets: T,
  equalityCheck: EqualityCheck<M> = defaultEqualityCheck,
): Facet<M> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectorMemoized = useCallback(selector as (...args: unknown[]) => ReturnType<typeof selector>, dependencies)

  const facetComposition = useMemo<Facet<M>>(() => {
    return mapFacetsCached(facets, selectorMemoized, equalityCheck)

    // We need to disable the linter on the next line given we are spreading the facets as individual dependencies
    // of the effect. We do this to avoid re-running this effect when passing a new array with the same facets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectorMemoized, equalityCheck, ...facets])

  return facetComposition
}
