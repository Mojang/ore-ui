import React, { ReactNode, createContext } from 'react'
import { SharedFacetDriver } from '../types'

const dummyConstructor = () => () => {}

export type SharedFacetDriverProviderProps = {
  children: ReactNode
  driver: SharedFacetDriver
}
export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyConstructor)

export const SharedFacetDriverProvider = ({ children, driver }: SharedFacetDriverProviderProps) => {
  return <sharedFacetDriverContext.Provider value={driver}>{children}</sharedFacetDriverContext.Provider>
}
