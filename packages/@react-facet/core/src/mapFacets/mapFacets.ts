import { EqualityCheck, ExtractFacetValues, Facet, NoValue } from '../types'
import { mapFacetArrayCached } from './mapFacetArrayCached'
import { mapFacetArrayLightweight } from './mapFacetArrayLightweight'
import { mapFacetSingleCached } from './mapFacetSingleCached'
import { mapFacetSingleLightweight } from './mapFacetSingleLightweight'

export function mapFacetsLightweight<M, Y extends Facet<unknown>[], T extends [...Y]>(
  facets: T,
  fn: (...args: ExtractFacetValues<T>) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  if (facets.length === 1) {
    return mapFacetSingleLightweight(
      (facets as Facet<unknown>[])[0],
      fn as (...value: unknown[]) => M | NoValue,
      equalityCheck,
    )
  } else {
    return mapFacetArrayLightweight(facets, fn as (...value: unknown[]) => M | NoValue, equalityCheck)
  }
}

export function mapFacetsCached<M, Y extends Facet<unknown>[], T extends [...Y]>(
  facets: T,
  fn: (...args: ExtractFacetValues<T>) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  if (facets.length === 1) {
    return mapFacetSingleCached(
      (facets as Facet<unknown>[])[0],
      fn as (...value: unknown[]) => M | NoValue,
      equalityCheck,
    )
  } else {
    return mapFacetArrayCached(facets, fn as (...value: unknown[]) => M | NoValue, equalityCheck)
  }
}
