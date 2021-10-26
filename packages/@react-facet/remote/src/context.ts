import { Facet } from '@react-facet/core'
import { ReactFacetDevTools } from '@react-facet/dev-tools'
import { createContext, useContext } from 'react'
import { RemoteFacet, RemoteFacetDriver } from './types'

const dummyConstructor = () => () => {}

export const remoteFacetDriverContext = createContext<RemoteFacetDriver>(dummyConstructor)

export const RemoteFacetDriverProvider = remoteFacetDriverContext.Provider

export const useRemoteFacet = <T>(remoteFacet: RemoteFacet<T>): Facet<T> => {
  const facet = remoteFacet(useContext(remoteFacetDriverContext))
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((global as any).__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__ as ReactFacetDevTools).send({
      hookName: 'useRemoteFacet',
      facets: [facet],
    })
  }

  return facet
}
