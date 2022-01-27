import { useCallback, useEffect } from 'react'
import { Facet, Unsubscribe, Cleanup, NO_VALUE } from '../types'

export function useFacetEffect<V>(
  callback: (v: V) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>],
): void

export function useFacetEffect<V, V1>(
  callback: (v: V, v1: V1) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>],
): void

export function useFacetEffect<V, V1, V2>(
  callback: (v: V, v1: V1, v2: V2) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>],
): void

export function useFacetEffect<V, V1, V2, V3>(
  callback: (v: V, v1: V1, v2: V2, v3: V3) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>],
): void

export function useFacetEffect<V, V1, V2, V3, V4>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>],
): void

export function useFacetEffect<V, V1, V2, V3, V4, V5>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>],
): void

export function useFacetEffect<V, V1, V2, V3, V4, V5, V6>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>],
): void

export function useFacetEffect<V, V1, V2, V3, V4, V5, V6, V7>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>],
): void

export function useFacetEffect<V, V1, V2, V3, V4, V5, V6, V7, V8>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>, Facet<V8>],
): void

export function useFacetEffect<V, V1, V2, V3, V4, V5, V6, V7, V8, V9>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8, v9: V9) => void | Cleanup,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>, Facet<V8>, Facet<V9>],
): void

export function useFacetEffect<V, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8, v9: V9, v10: V10) => void | Cleanup,
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
): void

/**
 * Allows running an effect based on facet updates. Similar to React's useEffect.
 *
 * @param effect function that will do the side-effect (ex: update the DOM)
 * @param dependencies variable used by the map that are available in scope (similar as dependencies of useEffect)
 * @param facets facets that the effect listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetEffect(
  effect: (...args: unknown[]) => void | Cleanup,
  dependencies: unknown[],
  facets: Facet<unknown>[],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const effectMemoized = useCallback(effect, dependencies)

  useEffect(() => {
    if (facets.length === 1) {
      return facets[0].observe(effectMemoized)
    }

    let cleanup: void | Cleanup
    let hasAllDependencies = false
    const unsubscribes: Unsubscribe[] = []
    const values: unknown[] = facets.map(() => NO_VALUE)

    facets.forEach((facet, index) => {
      unsubscribes[index] = facet.observe((value) => {
        values[index] = value
        hasAllDependencies = hasAllDependencies || values.every((value) => value != NO_VALUE)

        if (hasAllDependencies) {
          if (cleanup != null) {
            cleanup()
          }

          cleanup = effect(...values)
        }
      })
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
      if (cleanup != null) {
        cleanup()
      }
    }

    // We care about each individual facet and if any is a different reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectMemoized, ...facets])
}
