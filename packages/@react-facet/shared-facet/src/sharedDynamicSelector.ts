import memoize from './memoize'
import { defaultEqualityCheck, EqualityCheck, FACET_FACTORY, NoValue } from '@react-facet/core'
import { SharedFacetDriver, SharedFacet } from './types'
import { sharedSelector } from './sharedSelector'

export interface SharedDynamicSelector1<V, P, T1> {
  (parameter: P): [(facet1: T1) => V | NoValue, [SharedFacet<T1>]]
}

export interface SharedDynamicSelector2<V, P, T1, T2> {
  (parameter: P): [(facet1: T1, facet2: T2) => V | NoValue, [SharedFacet<T1>, SharedFacet<T2>]]
}

export interface SharedDynamicSelector3<V, P, T1, T2, T3> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3) => V | NoValue,
    [SharedFacet<T1>, SharedFacet<T2>, SharedFacet<T3>],
  ]
}

export interface SharedDynamicSelector4<V, P, T1, T2, T3, T4> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4) => V | NoValue,
    [SharedFacet<T1>, SharedFacet<T2>, SharedFacet<T3>, SharedFacet<T4>],
  ]
}

export interface SharedDynamicSelector5<V, P, T1, T2, T3, T4, T5> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5) => V | NoValue,
    [SharedFacet<T1>, SharedFacet<T2>, SharedFacet<T3>, SharedFacet<T4>, SharedFacet<T5>],
  ]
}

export interface SharedDynamicSelector6<V, P, T1, T2, T3, T4, T5, T6> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6) => V | NoValue,
    [SharedFacet<T1>, SharedFacet<T2>, SharedFacet<T3>, SharedFacet<T4>, SharedFacet<T5>, SharedFacet<T6>],
  ]
}

export interface SharedDynamicSelector7<V, P, T1, T2, T3, T4, T5, T6, T7> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6, facet7: T7) => V | NoValue,
    [
      SharedFacet<T1>,
      SharedFacet<T2>,
      SharedFacet<T3>,
      SharedFacet<T4>,
      SharedFacet<T5>,
      SharedFacet<T6>,
      SharedFacet<T7>,
    ],
  ]
}

export interface SharedDynamicSelector8<V, P, T1, T2, T3, T4, T5, T6, T7, T8> {
  (parameter: P): [
    (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6, facet7: T7, facet8: T8) => V | NoValue,
    [
      SharedFacet<T1>,
      SharedFacet<T2>,
      SharedFacet<T3>,
      SharedFacet<T4>,
      SharedFacet<T5>,
      SharedFacet<T6>,
      SharedFacet<T7>,
      SharedFacet<T8>,
    ],
  ]
}

export interface SharedDynamicSelector9<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9> {
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
      SharedFacet<T1>,
      SharedFacet<T2>,
      SharedFacet<T3>,
      SharedFacet<T4>,
      SharedFacet<T5>,
      SharedFacet<T6>,
      SharedFacet<T7>,
      SharedFacet<T8>,
      SharedFacet<T9>,
    ],
  ]
}

export interface SharedDynamicSelector10<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
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
      SharedFacet<T1>,
      SharedFacet<T2>,
      SharedFacet<T3>,
      SharedFacet<T4>,
      SharedFacet<T5>,
      SharedFacet<T6>,
      SharedFacet<T7>,
      SharedFacet<T8>,
      SharedFacet<T9>,
      SharedFacet<T10>,
    ],
  ]
}

export function sharedDynamicSelector<V, P, T1>(
  selectorFactory: SharedDynamicSelector1<V, P, T1>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2>(
  selectorFactory: SharedDynamicSelector2<V, P, T1, T2>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3>(
  selectorFactory: SharedDynamicSelector3<V, P, T1, T2, T3>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4>(
  selectorFactory: SharedDynamicSelector4<V, P, T1, T2, T3, T4>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4, T5>(
  selectorFactory: SharedDynamicSelector5<V, P, T1, T2, T3, T4, T5>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4, T5, T6>(
  selectorFactory: SharedDynamicSelector6<V, P, T1, T2, T3, T4, T5, T6>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7>(
  selectorFactory: SharedDynamicSelector7<V, P, T1, T2, T3, T4, T5, T6, T7>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7, T8>(
  selectorFactory: SharedDynamicSelector8<V, P, T1, T2, T3, T4, T5, T6, T7, T8>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  selectorFactory: SharedDynamicSelector9<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

export function sharedDynamicSelector<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  selectorFactory: SharedDynamicSelector10<V, P, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>,
  equalityCheck?: EqualityCheck<V>,
): (parameter: P) => SharedFacet<V>

/**
 * Defines a selector that can take a parameter
 * For more information check the documentation on defining a selector.
 *
 * @param selectorFactory differently from a selector, this is a function that takes the parameter to return the selector
 * @param equalityCheck optional, has a default for immutable values
 */
export function sharedDynamicSelector<V, P, T extends readonly SharedFacet<unknown>[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectorFactory: (parameter: P) => [(...facet: any[]) => V | NoValue, T],
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): (parameter: P) => SharedFacet<V> {
  return memoize((parameter: P) => {
    const [selector, facets] = selectorFactory(parameter)

    const definition = memoize((sharedFacetDriver: SharedFacetDriver) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (sharedSelector as any)(selector, facets, equalityCheck)(sharedFacetDriver)
    }) as unknown as SharedFacet<V>

    definition.factory = FACET_FACTORY

    return definition
  })
}
