import { createContext } from 'react'
import { SharedFacetDriver } from '../types'

const dummyConstructor = () => () => {}

export const sharedFacetDriverContext = createContext<SharedFacetDriver>(dummyConstructor)
