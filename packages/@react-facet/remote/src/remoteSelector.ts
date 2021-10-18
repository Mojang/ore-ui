import memoize from './memoize'
import { EqualityCheck, defaultEqualityCheck, Value, mapFacetsCached, FACET_FACTORY, NoValue } from '@react-facet/core'
import { RemoteFacetDriver, RemoteFacet } from './types'

export function remoteSelector<
  V,
  T1 extends Value,
  T2 extends Value,
  T3 extends Value,
  T4 extends Value,
  T5 extends Value,
  T6 extends Value,
  T7 extends Value,
  T8 extends Value,
  T9 extends Value,
  T10 extends Value,
>(
  selector: (
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
  facets: [
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
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<
  V,
  T1 extends Value,
  T2 extends Value,
  T3 extends Value,
  T4 extends Value,
  T5 extends Value,
  T6 extends Value,
  T7 extends Value,
  T8 extends Value,
  T9 extends Value,
>(
  selector: (
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
  facets: [
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
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<
  V,
  T1 extends Value,
  T2 extends Value,
  T3 extends Value,
  T4 extends Value,
  T5 extends Value,
  T6 extends Value,
  T7 extends Value,
  T8 extends Value,
>(
  selector: (
    facet1: T1,
    facet2: T2,
    facet3: T3,
    facet4: T4,
    facet5: T5,
    facet6: T6,
    facet7: T7,
    facet8: T8,
  ) => V | NoValue,
  facets: [
    RemoteFacet<T1>,
    RemoteFacet<T2>,
    RemoteFacet<T3>,
    RemoteFacet<T4>,
    RemoteFacet<T5>,
    RemoteFacet<T6>,
    RemoteFacet<T7>,
    RemoteFacet<T8>,
  ],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<
  V,
  T1 extends Value,
  T2 extends Value,
  T3 extends Value,
  T4 extends Value,
  T5 extends Value,
  T6 extends Value,
  T7 extends Value,
>(
  selector: (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6, facet7: T7) => V | NoValue,
  facets: [
    RemoteFacet<T1>,
    RemoteFacet<T2>,
    RemoteFacet<T3>,
    RemoteFacet<T4>,
    RemoteFacet<T5>,
    RemoteFacet<T6>,
    RemoteFacet<T7>,
  ],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<
  V,
  T1 extends Value,
  T2 extends Value,
  T3 extends Value,
  T4 extends Value,
  T5 extends Value,
  T6 extends Value,
>(
  selector: (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5, facet6: T6) => V | NoValue,
  facets: [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>, RemoteFacet<T4>, RemoteFacet<T5>, RemoteFacet<T6>],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<
  V,
  T1 extends Value,
  T2 extends Value,
  T3 extends Value,
  T4 extends Value,
  T5 extends Value,
>(
  selector: (facet1: T1, facet2: T2, facet3: T3, facet4: T4, facet5: T5) => V | NoValue,
  facets: [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>, RemoteFacet<T4>, RemoteFacet<T5>],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<V, T1 extends Value, T2 extends Value, T3 extends Value, T4 extends Value>(
  selector: (facet1: T1, facet2: T2, facet3: T3, facet4: T4) => V | NoValue,
  facets: [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>, RemoteFacet<T4>],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<V, T1 extends Value, T2 extends Value, T3 extends Value>(
  selector: (facet1: T1, facet2: T2, facet3: T3) => V | NoValue,
  facets: [RemoteFacet<T1>, RemoteFacet<T2>, RemoteFacet<T3>],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<V, T1 extends Value, T2 extends Value>(
  selector: (facet1: T1, facet2: T2) => V | NoValue,
  facets: [RemoteFacet<T1>, RemoteFacet<T2>],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

export function remoteSelector<V, T1 extends Value>(
  selector: (facet1: T1) => V | NoValue,
  facets: [RemoteFacet<T1>],
  equalityCheck?: EqualityCheck<V>,
): RemoteFacet<V>

/**
 * Defines a selector to transform/map data from a facet
 *
 * When used correctly, it can limit components being re-rendered if they only
 * care about a specific attribute/function of a facet.
 *
 * To take full advantage of a selector, it is important to choose a proper equalityCheck
 * with an IMPORTANT understanding of the source of the data (if it is mutable for example).
 *
 * If the source of the data is an object or array that is being mutated, then it would mean that
 * the current and previous values passed to the equalityCheck would be same reference, making it
 * impossible to run any equality check. We recommend only using an equality check if the values
 * returned by the selector are numbers, booleans, strings, or objects/arrays constructed by the selector.
 *
 * @param facets which facets to read the data from
 * @param selector a function to transform the data from the facets
 * @param equalityCheck optional, has a default for immutable values
 */
export function remoteSelector<V, T extends readonly RemoteFacet<unknown>[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector: (...facet: any[]) => V | NoValue,
  facets: T,
  equalityCheck: EqualityCheck<V> = defaultEqualityCheck,
): RemoteFacet<V> {
  const definition = memoize((remoteFacetDriver: RemoteFacetDriver) =>
    mapFacetsCached(
      facets.map((facet) => facet(remoteFacetDriver)),
      selector,
      equalityCheck,
    ),
  ) as unknown as RemoteFacet<V>

  definition.factory = FACET_FACTORY

  return definition
}
