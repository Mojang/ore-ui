import { createContext } from 'react'
import { SharedFacetError } from '../types'

export type SharedFacetErrorBoundaryCallback = (error: SharedFacetError) => void

const noop = () => {}

export const sharedFacetsErrorBoundaryContext = createContext<SharedFacetErrorBoundaryCallback>(noop)
