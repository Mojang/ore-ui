import { useContext } from 'react'
import { Facet } from '@react-facet/core'
import { sharedFacetDriverContext } from '../context/sharedFacetDriver'
import { SharedFacet } from '../types'

export const useSharedFacet = <T>(sharedFacet: SharedFacet<T>): Facet<T> => {
  return sharedFacet.initializer(useContext(sharedFacetDriverContext))
}
