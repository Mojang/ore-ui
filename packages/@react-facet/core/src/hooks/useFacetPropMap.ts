import { useMemo } from 'react'
import { wrapFacets } from '../facet'
import { defaultEqualityCheck } from '../equalityChecks'
import { mapFacetsLightweight } from '../mapFacets'
import { EqualityCheck, Facet, FacetProp, NoValue, Value, ExtractFacetPropValues } from '../types'

/**
 * Helper hook that allows mapping a value from a facet with local variables/props in a React component
 *
 * @param selector function that takes value from provided facets and maps them to a new value
 * @param facetProps
 * @param equalityCheck optional, has a default for immutable values
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 *
 * @returns a new facet definition that can be consumed as a regular facet
 */
export function useFacetPropMap<M extends Value, Y extends FacetProp<unknown>[], T extends [...Y]>(
  selector: (...args: ExtractFacetPropValues<T>) => M | NoValue,
  facetProps: T,
  equalityCheck: EqualityCheck<M> = defaultEqualityCheck,
): Facet<M> {
  const facetComposition = useMemo<Facet<M>>(() => {
    const selectorTyped = selector as (...args: unknown[]) => ReturnType<typeof selector>

    return mapFacetsLightweight(wrapFacets(facetProps), selectorTyped, equalityCheck)

    // We need to disable the linter on the next line given we are spreading the facets as individual dependencies
    // of the effect. We do this to avoid re-running this effect when passing a new array with the same facets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, equalityCheck, ...facetProps])

  return facetComposition
}
