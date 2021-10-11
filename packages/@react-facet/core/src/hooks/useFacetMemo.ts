import { useCallback, useMemo } from 'react'
import { defaultEqualityCheck } from '../equalityChecks'
import { mapFacetsCached } from '../mapFacets'
import { EqualityCheck, Facet, NoValue, Value } from '../types'

export function useFacetMemo<M extends Value, V>(
  selector: (v: V) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1>(
  selector: (v: V, v1: V1) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2>(
  selector: (v: V, v1: V1, v2: V2) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3>(
  selector: (v: V, v1: V1, v2: V2, v3: V3) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4, V5>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4, V5, V6>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4, V5, V6, V7>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4, V5, V6, V7, V8>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>, Facet<V8>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4, V5, V6, V7, V8, V9>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8, v9: V9) => M | NoValue,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>, Facet<V8>, Facet<V9>],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

export function useFacetMemo<M extends Value, V, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(
  selector: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8, v9: V9, v10: V10) => M | NoValue,
  dependencies: unknown[],
  facet: [
    Facet<V>,
    Facet<V1>,
    Facet<V2>,
    Facet<V3>,
    Facet<V4>,
    Facet<V5>,
    Facet<V6>,
    Facet<V7>,
    Facet<V8>,
    Facet<V9>,
    Facet<V10>,
  ],
  equalityCheck?: EqualityCheck<M>,
): Facet<M>

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
export function useFacetMemo<M extends Value>(
  selector: (...args: unknown[]) => M | NoValue,
  dependencies: unknown[],
  facets: Facet<unknown>[],
  equalityCheck: EqualityCheck<M> = defaultEqualityCheck,
): Facet<M> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectorMemoized = useCallback(selector, dependencies)

  const facetComposition = useMemo<Facet<M>>(() => {
    return mapFacetsCached(facets, selectorMemoized, equalityCheck)

    // We need to disable the linter on the next line given we are spreading the facets as individual dependencies
    // of the effect. We do this to avoid re-running this effect when passing a new array with the same facets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectorMemoized, equalityCheck, ...facets])

  return facetComposition
}
