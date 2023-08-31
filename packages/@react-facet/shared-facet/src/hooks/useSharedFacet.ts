import { useContext } from 'react'
import { Facet } from '@react-facet/core'
import { sharedFacetDriverContext } from '../context/sharedFacetDriver'
import { SharedFacet, SharedFacetError } from '../types'
import { sharedFacetsErrorBoundaryContext } from '../context'

export const useSharedFacet = <T>(
  sharedFacet: SharedFacet<T>,
  onErrorCallback?: (error: SharedFacetError) => void,
): Facet<T> => {
  const sharedFacetDriver = useContext(sharedFacetDriverContext)
  const onErrorWrapper = useContext(sharedFacetsErrorBoundaryContext)
  return sharedFacet.initializer(sharedFacetDriver, onErrorCallback ?? onErrorWrapper)
}
