import { Facet, FacetFactory } from '@react-facet/core'

export interface OnChange<V> {
  (value: V): void
}

export interface ErrorFn {
  (errorCode: string): void
}

/**
 * Driver API that must be implemented by users of this package's sharedFacet.
 *
 * It's a function that is called with the name of a shared facet and an onChange function that must be called
 * whenever the facet has new data.
 *
 * It should return a "destructor" function that will be called when no component needs the data anymore.
 */
export interface SharedFacetDriver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (name: string, onChange: OnChange<any>, onError?: ErrorFn, fallback?: any): () => void
}

export interface SharedFacet<T> extends FacetFactory<T> {
  (sharedFacetDriver: SharedFacetDriver): Facet<T>
}
