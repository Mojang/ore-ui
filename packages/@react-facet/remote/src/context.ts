import { Facet } from '@react-facet/core'
import { createContext, useContext } from 'react'
import { RemoteFacet, RemoteFacetDriver } from './types'

const dummyConstructor = () => () => {}

export const remoteFacetDriverContext = createContext<RemoteFacetDriver>(dummyConstructor)

export const RemoteFacetDriverProvider = remoteFacetDriverContext.Provider

export const useRemoteFacet = <T>(remoteFacet: RemoteFacet<T>): Facet<T> => {
  return remoteFacet(useContext(remoteFacetDriverContext))
}
