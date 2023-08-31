import React, { ReactNode } from 'react'
import { sharedFacetsAvailableContext } from '../context/sharedFacetAvailable'

export type SharedFacetsAvailableProp = {
  children: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (...args: any[]) => void
}

export const SharedFacetsAvailable = ({ onError, children }: SharedFacetsAvailableProp) => {
  return <sharedFacetsAvailableContext.Provider value={onError}>{children}</sharedFacetsAvailableContext.Provider>
}
