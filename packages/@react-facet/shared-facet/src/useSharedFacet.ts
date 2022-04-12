import { Facet } from '@react-facet/core'
import { useContext } from 'react'
import { SharedFacet } from './types'
import { sharedFacetDriverContext } from './context'

export const useSharedFacet = <T>(sharedFacet: SharedFacet<T>): Facet<T> => {
  return sharedFacet(useContext(sharedFacetDriverContext))
}
