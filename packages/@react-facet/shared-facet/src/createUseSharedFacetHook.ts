import { createFacet, Facet, NO_VALUE } from '@react-facet/core'
import { useContext, useMemo } from 'react'
import { sharedFacetDriverContext } from './context'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUseSharedFacetHook = <T extends Record<string, any>>() => {
  function useSharedFacet<K extends keyof T>(arg: K): Facet<T[K]>
  function useSharedFacet<K extends keyof T, Y extends keyof T[K]>(arg: K, arg2: Y): Facet<T[K][Y]>
  function useSharedFacet<K extends keyof T, Y extends keyof T[K], Z extends keyof T[K][Y]>(
    arg: K,
    arg2: Y,
    arg3: Z,
  ): Facet<T[K][Y][Z]>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useSharedFacet(...args: any[]): Facet<any> {
    const driver = useContext(sharedFacetDriverContext)

    const facet = useMemo(
      () =>
        createFacet({
          initialValue: NO_VALUE,
          startSubscription: (update) => {
            return driver(args, update)
          },
        }),
      [args, driver],
    )

    return facet
  }

  return useSharedFacet
}
