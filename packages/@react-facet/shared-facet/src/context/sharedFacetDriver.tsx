import React, { ReactNode, createContext } from 'react'
import { SharedFacetDriver } from '../types'

const dummyConstructor = () => () => {}

export type SharedFacetDriverProviderProps<E> = {
  children: ReactNode
  driver: SharedFacetDriver<E>
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sharedFacetDriverContext = createContext<SharedFacetDriver<any>>(dummyConstructor)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SharedFacetDriverProvider = ({ children, driver }: SharedFacetDriverProviderProps<any>) => {
  return <sharedFacetDriverContext.Provider value={driver}>{children}</sharedFacetDriverContext.Provider>
}
