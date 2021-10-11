import memoize from './memoize'
import { defaultEqualityCheck, EqualityCheck, FACET_FACTORY, NoValue } from '@react-facet/core'
import { RemoteFacetDriver, RemoteFacet } from './types'
import { remoteSelector } from './remoteSelector'

export interface RemoteDynamicSelector1<V, P, T1> {
  (parameter: P): [(facet1: T1) => V | NoValue, [RemoteFacet<T1>]]
}

export interface RemoteDynamicSelector2<V, P, T1, T2> {
  (parameter: P): [(facet1: T1, facet2: T2) => V | NoValue, [RemoteFacet<T1>, RemoteFacet<T2>]]
}

export interface RemoteDynamicSelector3<V, P, T1, T2, T3> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3) => V | NoValue,
    [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>],
  ]
}

export interface RemoteDynamicSelector4<V, P, T1, T2, T3, T4> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4) => V | NoValue,
    [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>, RemoteFacet<T4>],
  ]
}

export interface RemoteDynamicSelector5<V, P, T1, T2, T3, T4, T5> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5) => V | NoValue,
    [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>, RemoteFacet<T4>, RemoteFacet<T5>],
  ]
}

export interface RemoteDynamicSelector6<V, P, T1, T2, T3, T4, T5, T6> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6) => V | NoValue,
    [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>, RemoteFacet<T4>, RemoteFacet<T5>, RemoteFacet<T6>],
  ]
}

export interface RemoteDynamicSelector7<V, P, T1, T2, T3, T4, T5, T6, T7> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6, facet7: T7) => V | NoValue,
    [
      RemoteFacet<T1>,
      RemoteFacet<T2>,
      RemoteFacet<T3>,
      RemoteFacet<T4>,
      RemoteFacet<T5>,
      RemoteFacet<T6>,
      RemoteFacet<T7>,
    ],
  ]
}

export interface RemoteDynamicSelector8<V, P, T1, T2, T3, T4, T5, T6, T7, T8> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6, facet7: T7, facet8: T8) => V | NoValue,
    [
      RemoteFacet<T1>,
      RemoteFacet<T2>,
      RemoteFacet<T3>,
      RemoteFacet<T4>,
      RemoteFacet<T5>,
      RemoteFacet<T6>,
      RemoteFacet<T7>,
      RemoteFacet<T8>,
    ],
  ]
}

export interface RemoteDynamicSelector9<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9> {
  (parameter: P): [
    (
      facet1: T1,
      facet2: T2,
      facet3: T3,
      facet4: T4,
      facet5: T5,
      facet6: T6,
      facet7: T7,
      facet8: T8,
      facet9: T9,
    ) => V | NoValue,
    [
      RemoteFacet<T1>,
      RemoteFacet<T2>,
      RemoteFacet<T3>,
      RemoteFacet<T4>,
      RemoteFacet<T5>,
      RemoteFacet<T6>,
      RemoteFacet<T7>,
      RemoteFacet<T8>,
      RemoteFacet<T9>,
    ],
  ]
}

export interface RemoteDynamicSelector10<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
  (parameter: P): [
    (
      facet1: T1,
      facet2: T2,
      facet3: T3,
      facet4: T4,
      facet5: T5,
      facet6: T6,
      facet7: T7,
      facet8: T8,
      facet9: T9,
      facet10: T10,
    ) => V | NoValue,
    [
      RemoteFacet<T1>,
      RemoteFacet<T2>,
      RemoteFacet<T3>,
      RemoteFacet<T4>,
      RemoteFacet<T5>,
      RemoteFacet<T6>,
      RemoteFacet<T7>,
      RemoteFacet<T8>,
      RemoteFacet<T9>,
      RemoteFacet<T10>,
    ],
  ]
}

export function remoteDynamicSelector<V, P, T1>(
  selectorFactory: RemoteDynamicSelector1<V, P, T1>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2>(
  selectorFactory: RemoteDynamicSelector2<V, P, T1, T2>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3>(
  selectorFactory: RemoteDynamicSelector3<V, P, T1, T2, T3>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4>(
  selectorFactory: RemoteDynamicSelector4<V, P, T1, T2, T3, T4>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4, T5>(
  selectorFactory: RemoteDynamicSelector5<V, P, T1, T2, T3, T4, T5>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4, T5, T6>(
  selectorFactory: RemoteDynamicSelector6<V, P, T1, T2, T3, T4, T5, T6>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7>(
  selectorFactory: RemoteDynamicSelector7<V, P, T1, T2, T3, T4, T5, T6, T7>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7, T8>(
  selectorFactory: RemoteDynamicSelector8<V, P, T1, T2, T3, T4, T5, T6, T7, T8>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  selectorFactory: RemoteDynamicSelector9<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

export function remoteDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  selectorFactory: RemoteDynamicSelector10<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => RemoteFacet<V>

/**
 * Defines a selector that can take a parameter
 * For more information check the documentation on defining a selector.
 *
 * @param selectorFactory differently from a selector, this is a function that takes the parameter to return the selector
 * @param equalityCheck optional, has a default for immutable values
 */
export function remoteDynamicSelector<V, P, T extends readonly RemoteFacet<unknown>[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectorFactory: (parameter: P) => [(...facet: any[]) => V | NoValue, T],
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): (parameter: P) => RemoteFacet<V> {
  return memoize((parameter: P) => {
    const [selector, facets] = selectorFactory(parameter)

    const definition = memoize((remoteFacetDriver: RemoteFacetDriver) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (remoteSelector as any)(selector, facets, equalityCheck)(remoteFacetDriver)
    }) as unknown as RemoteFacet<V>

    definition.factory = FACET_FACTORY

    return definition
  })
}
