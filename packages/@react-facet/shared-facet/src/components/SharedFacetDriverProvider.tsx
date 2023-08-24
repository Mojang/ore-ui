import React, { ReactNode } from 'react'
import { sharedFacetDriverContext } from '../context/sharedFacetDriver'
import { SharedFacetDriver } from '../types'
import { SharedFacetsAvailable } from './SharedFacetsAvailable'

export type SharedFacetDriverProviderProps = {
  children: ReactNode
  driver: SharedFacetDriver
}

export const SharedFacetDriverProvider = ({ children, driver }: SharedFacetDriverProviderProps) => {
  return (
    <sharedFacetDriverContext.Provider value={driver}>
      <SharedFacetsAvailable>{children}</SharedFacetsAvailable>
    </sharedFacetDriverContext.Provider>
  )
}
