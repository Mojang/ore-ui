import { Facet } from '@react-facet/core'
import { createContext, useContext } from 'react'
import { SharedFacet, SharedFacetDriver } from './types'

const dummyConstructor = () => () => {}

export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyConstructor)

export const SharedFacetDriverProvider = sharedFacetDriverContext.Provider

export const useSharedFacet = <T>(sharedFacet: SharedFacet<T>): Facet<T> => {
  return sharedFacet(useContext(sharedFacetDriverContext))
}
