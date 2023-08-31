import React, { ReactNode, createContext } from 'react'
import { SharedFacetDriver } from '../types'

const dummyConstructor = () => () => {}

export type SharedFacetDriverProviderProps = {
  children: ReactNode
  driver: SharedFacetDriver
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyConstructor)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SharedFacetDriverProvider = ({ children, driver }: SharedFacetDriverProviderProps) => {
  return <sharedFacetDriverContext.Provider value={driver}>{children}</sharedFacetDriverContext.Provider>
}
