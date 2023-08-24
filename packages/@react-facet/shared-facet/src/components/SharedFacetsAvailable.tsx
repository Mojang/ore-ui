import React, { ReactNode, useCallback, useState } from 'react'
import { sharedFacetsAvailableContext } from '../context/sharedFacetAvailable'

export type SharedFacetsAvailableProp = {
  children: ReactNode
}

export const SharedFacetsAvailable = ({ children }: SharedFacetsAvailableProp) => {
  const [shouldUnmountChildren, setShouldUnmountChildren] = useState(false)

  const sharedFacetNotAvailableCallback = useCallback(() => {
    setShouldUnmountChildren(true)
  }, [setShouldUnmountChildren])

  return shouldUnmountChildren ? null : (
    <sharedFacetsAvailableContext.Provider value={sharedFacetNotAvailableCallback}>
      {children}
    </sharedFacetsAvailableContext.Provider>
  )
}
