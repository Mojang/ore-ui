import { createContext } from 'react'
import { SharedFacetDriver } from './types'

const dummyDriver: SharedFacetDriver = {
  observe: () => {
    return () => {}
  },
  set: () => {},
}

export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyDriver)

export const SharedFacetDriverProvider = sharedFacetDriverContext.Provider
