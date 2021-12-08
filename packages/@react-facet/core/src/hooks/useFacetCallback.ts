import { useCallback, useEffect, useRef } from 'react'
import { NoValue } from '..'
import { Facet, NO_VALUE, Option } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V) => C,
  dependencies: unknown[],
  facet: [Facet<V>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, V4, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, V4, V5, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, V4, V5, V6, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, V4, V5, V6, V7, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, V4, V5, V6, V7, V8, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>, Facet<V8>],
): C

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacetCallback<M, V, V1, V2, V3, V4, V5, V6, V7, V8, V9, C extends (...args: any[]) => M | NoValue>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8, v9: V9) => C,
  dependencies: unknown[],
  facet: [Facet<V>, Facet<V1>, Facet<V2>, Facet<V3>, Facet<V4>, Facet<V5>, Facet<V6>, Facet<V7>, Facet<V8>, Facet<V9>],
): C

export function useFacetCallback<
  M,
  V,
  V1,
  V2,
  V3,
  V4,
  V5,
  V6,
  V7,
  V8,
  V9,
  V10,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends (...args: any[]) => M | NoValue,
>(
  callback: (v: V, v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8, v9: V9, v10: V10) => C,
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
): C

/**
 * Creates a callback that depends on the value of a facet.
 * Very similar to `useCallback` from `React`
 *
 * @param callback function callback that receives the current facet values and the arguments passed to the callback
 * @param dependencies variable used by the callback that are available in scope (similar as dependencies of useCallback)
 * @param facets facets that the callback listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetCallback<M, C extends (...args: unknown[]) => M | NoValue>(
  callback: (...args: unknown[]) => C,
  dependencies: unknown[],
  facets: Facet<unknown>[],
): C {
  const facetsRef = useRef<Option<unknown>[]>(facets.map(() => NO_VALUE))

  useEffect(() => {
    const unsubscribe = facets.map((facet, index) =>
      facet.observe((value) => {
        facetsRef.current[index] = value
      }),
    )

    return () => {
      unsubscribe.forEach((unsubscribe) => unsubscribe())
    }
    // We care about each individual facet and if any is a different reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, facets)

  // We care about each individual dependency and if any is a different reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callbackMemoized = useCallback(callback, dependencies)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<C>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((...args: any[]) => {
      const values = facetsRef.current

      for (const value of values) {
        if (value === NO_VALUE) return NO_VALUE
      }

      return callbackMemoized(...values)(...args)
    }) as unknown as C,
    [callbackMemoized, facetsRef],
  )
}
