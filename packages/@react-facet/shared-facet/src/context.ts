import { Facet } from '@react-facet/core'
import { createContext, useContext } from 'react'
import { SharedFacet, SharedFacetDriver } from './types'

const dummyConstructor = () => () => {}

export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyConstructor)

export const SharedFacetDriverProvider = sharedFacetDriverContext.Provider

type InferFacet<T> = T extends SharedFacet<infer U> ? Facet<U> : never

export const useSharedFacet = <T extends SharedFacet<unknown>>(sharedFacet: T): InferFacet<T> => {
  const driver = useContext(sharedFacetDriverContext)
  return sharedFacet(driver) as InferFacet<T>
}
