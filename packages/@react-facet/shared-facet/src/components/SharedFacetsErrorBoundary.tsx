import React, { ReactNode } from 'react'
import { sharedFacetsErrorBoundaryContext } from '../context/sharedFacetAvailable'
import { SharedFacetError } from '../types'

export type SharedFacetsErrorBoundaryProps = {
  children: ReactNode
  onError: (args: SharedFacetError) => void
}

export const SharedFacetsErrorBoundary = ({ onError, children }: SharedFacetsErrorBoundaryProps) => {
  return (
    <sharedFacetsErrorBoundaryContext.Provider value={onError}>{children}</sharedFacetsErrorBoundaryContext.Provider>
  )
}
