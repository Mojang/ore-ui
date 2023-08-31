import { useContext } from 'react'
import { Facet } from '@react-facet/core'
import { sharedFacetDriverContext } from '../context/sharedFacetDriver'
import { SharedFacet } from '../types'
import { sharedFacetsAvailableContext } from '../context'

export const useSharedFacet = <T>(sharedFacet: SharedFacet<T>): Facet<T> => {
  const sharedFacetDriver = useContext(sharedFacetDriverContext)
  const unmountChildrenCallback = useContext(sharedFacetsAvailableContext)
  return sharedFacet.initializer(sharedFacetDriver, unmountChildrenCallback)
}
