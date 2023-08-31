import { createContext } from 'react'
import { SharedFacetError } from '../types'

export type SharedFacetNotAvailableCallback = (error: SharedFacetError) => void

const noop = () => {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sharedFacetsAvailableContext = createContext<SharedFacetNotAvailableCallback>(noop)
