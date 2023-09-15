import { Facet } from '@react-facet/core'
import { createContext, useContext, useEffect } from 'react'
import { SharedFacet, SharedFacetDriver } from './types'

const dummyConstructor = () => () => {}

export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyConstructor)

export const SharedFacetDriverProvider = sharedFacetDriverContext.Provider

export const useSharedFacet = <T>(sharedFacet: SharedFacet<T>, onError?: (error: string) => void): Facet<T> => {
  const facet = sharedFacet(useContext(sharedFacetDriverContext))

  useEffect(() => {
    if (onError) {
      return facet.onError(onError)
    } else {
      return facet.onError((error) => {
        throw new SharedFacetError(error)
      })
    }
  }, [facet, onError])

  return facet
}

export class SharedFacetError extends Error {
  error: string

  constructor(error: string) {
    super()
    this.error = error
  }
}
