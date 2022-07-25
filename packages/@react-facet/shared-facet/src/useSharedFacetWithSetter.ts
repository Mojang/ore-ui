import { Facet, Setter } from '@react-facet/core'
import { useContext } from 'react'
import { SharedFacetWithSetter } from './types'
import { sharedFacetDriverContext } from './context'

export const useSharedFacetWithSetter = <T>(sharedFacetWithSetter: SharedFacetWithSetter<T>): [Setter<T>, Facet<T>] => {
  return sharedFacetWithSetter(useContext(sharedFacetDriverContext))
}
