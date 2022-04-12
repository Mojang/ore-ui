import { Facet, FacetFactory, Setter, Unsubscribe } from '@react-facet/core'

export interface OnChange<V> {
  (value: V): void
}

export interface ErrorFn {
  (errorCode: string): void
}

/**
 * Driver API that must be implemented by users of this package's sharedFacet.
 */
export interface SharedFacetDriver {
  /**
   * Function that is called with the name of a shared facet and an onChange function that must be called
   * whenever the facet has new data.
   *
   * It should return a "destructor" function that will be called when no component needs the data anymore.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observe: (name: string, onChange: OnChange<any>, onError?: ErrorFn, fallback?: any) => Unsubscribe

  /**
   * Function that is called whenever we want to set a value on a shared facet.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (name: string, newValue: any) => void
}

export interface SharedFacet<T> extends FacetFactory<T> {
  (sharedFacetDriver: SharedFacetDriver): Facet<T>
}

export interface SharedFacetWithSetter<T> extends FacetFactory<T> {
  (sharedFacetDriver: SharedFacetDriver): [Setter<T>, Facet<T>]
}
