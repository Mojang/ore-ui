import { Facet } from '@react-facet/core'

export interface OnChange<V> {
  (value: V): void
}

export type Path = (string | number)[]

export type FacetSubscription = {
  path: Path
  facet: Facet<unknown>
  unsubscriber: () => void
  subscriberCount: number
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
  (name: Path, onChange: OnChange<any>): () => void
}
