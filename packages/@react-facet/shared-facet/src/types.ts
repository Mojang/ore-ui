import { FACET_FACTORY, Facet, Update, Value } from '@react-facet/core'

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
export type SharedFacetDriver = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (name: string, onChange: Update<any>, onError?: (error: SharedFacetError) => void): () => void
}
/**
 * This type is meant to be be extended by the end user through declaration merging
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
export interface SharedFacetError {
  facetName: string
  message?: string
}

export type SharedFacet<T> = {
  initializer: (sharedFacetDriver: SharedFacetDriver, onError: (error: SharedFacetError) => void) => Facet<T>
  factory: typeof FACET_FACTORY
}

export type PropSetter<T extends Value, Prop extends keyof T> = {
  (value: T[Prop]): void
}
