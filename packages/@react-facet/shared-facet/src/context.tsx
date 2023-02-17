import { createFacet, createStaticFacet, Facet, NO_VALUE } from '@react-facet/core'
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { SharedFacet, SharedFacetDriver } from './types'

type Cleanup = () => void

type GetFacetReference<T> = (definition: SharedFacet<T>) => [Facet<T>, Cleanup]

const defaultValue: GetFacetReference<unknown> = () => [createStaticFacet(undefined), () => {}]

const getFacetReferenceContext = createContext<GetFacetReference<unknown>>(defaultValue)

export const SharedFacetDriverProvider: React.FC<{ value: SharedFacetDriver }> = ({
  value: sharedFacetDriver,
  children,
}) => {
  const referenceCount = useMemo(() => new Map<string, number>(), [])
  const instancePool = useMemo(() => new Map<string, Facet<unknown>>(), [])

  const getFacetReference = useCallback(
    <T,>(definition: SharedFacet<T>): [Facet<T>, () => void] => {
      const facetReferenceCount = referenceCount.get(definition) ?? 0
      let facetInstance = instancePool.get(definition) as Facet<T> | undefined

      if (facetInstance == null) {
        facetInstance = createFacet<T>({
          initialValue: NO_VALUE,
          startSubscription: (update) => {
            return sharedFacetDriver(definition, update)
          },
        })

        instancePool.set(definition, facetInstance)
      }

      // increment the reference count
      referenceCount.set(definition, facetReferenceCount + 1)

      return [
        facetInstance,
        () => {
          const currentFacetReferenceCount = referenceCount.get(definition) ?? 0

          if (currentFacetReferenceCount === 1) {
            // if it is the last reference, we can stop tracking
            // and remove it from the instance pool
            instancePool.delete(definition)
            referenceCount.delete(definition)
          } else {
            referenceCount.set(definition, currentFacetReferenceCount - 1)
          }
        },
      ]
    },
    [sharedFacetDriver, instancePool, referenceCount],
  )

  return <getFacetReferenceContext.Provider value={getFacetReference}>{children}</getFacetReferenceContext.Provider>
}

export const useSharedFacet = <T,>(sharedFacet: SharedFacet<T>): Facet<T> => {
  const getSharedFacet = useContext(getFacetReferenceContext) as GetFacetReference<T>
  const [instance, cleanup] = useMemo(() => getSharedFacet(sharedFacet), [sharedFacet, getSharedFacet])
  useEffect(() => cleanup, [cleanup])

  return instance
}
