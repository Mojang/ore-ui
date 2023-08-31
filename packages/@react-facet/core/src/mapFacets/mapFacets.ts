import { EqualityCheck, Facet, NoValue } from '../types'
import { mapFacetArrayCached } from './mapFacetArrayCached'
import { mapFacetArrayLightweight } from './mapFacetArrayLightweight'
import { mapFacetSingleCached } from './mapFacetSingleCached'
import { mapFacetSingleLightweight } from './mapFacetSingleLightweight'

export function mapFacetsLightweight<M>(
  facets: Facet<unknown>[],
  fn: (...value: unknown[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
  onCleanup?: () => void,
): Facet<M> {
  if (facets.length === 1) {
    return mapFacetSingleLightweight(facets[0], fn, equalityCheck, onCleanup)
  } else {
    return mapFacetArrayLightweight(facets, fn, equalityCheck, onCleanup)
  }
}

export function mapFacetsCached<M>(
  facets: Facet<unknown>[],
  fn: (...value: unknown[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
  onCleanup?: () => void,
): Facet<M> {
  if (facets.length === 1) {
    return mapFacetSingleCached(facets[0], fn, equalityCheck, onCleanup)
  } else {
    return mapFacetArrayCached(facets, fn, equalityCheck, onCleanup)
  }
}
