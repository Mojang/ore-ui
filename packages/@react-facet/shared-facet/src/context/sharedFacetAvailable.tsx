import { createContext } from 'react'

export type SharedFacetNotAvailableCallback = () => void

const noop = () => {}

export const sharedFacetsAvailableContext = createContext<SharedFacetNotAvailableCallback>(noop)
