import { createFacet, Facet, NO_VALUE } from '@react-facet/core'
import { useContext, useEffect } from 'react'
import { sharedFacetDriverContext } from './context'
import { Path, FacetSubscription } from './types'

const findFacetSubscriptionByPath = (
  path: Path,
  facetSubscriptions: FacetSubscription[],
): FacetSubscription | undefined => {
  outerLoop: for (
    let facetSubscriptionsIndex = 0;
    facetSubscriptionsIndex < facetSubscriptions.length;
    facetSubscriptionsIndex++
  ) {
    const facetSubscription = facetSubscriptions[facetSubscriptionsIndex]

    if (path.length !== facetSubscription.path.length) {
      continue
    }

    for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
      if (path[pathIndex] !== facetSubscription.path[pathIndex]) {
        continue outerLoop
      }
    }

    return facetSubscription
  }

  return undefined
}

const removeFacetSubscription = (facetSubscription: FacetSubscription, facetSubscriptions: FacetSubscription[]) => {
  let index = 0
  for (; index < facetSubscriptions.length; index++) {
    if (facetSubscriptions[index] === facetSubscription) {
      break
    }
  }

  facetSubscriptions.splice(index, 1)
}

const useRequestFacet = (path: Path, facetSubscriptions: FacetSubscription[]): FacetSubscription => {
  const driver = useContext(sharedFacetDriverContext)
  const maybeFacetSubscription = findFacetSubscriptionByPath(path, facetSubscriptions)

  if (maybeFacetSubscription != null) {
    return maybeFacetSubscription
  }

  const facet = createFacet({ initialValue: NO_VALUE })

  const unsubscriber = driver(path, facet.set)

  const newFacetSubscription = {
    facet,
    unsubscriber,
    subscriberCount: 0,
    path,
  }

  facetSubscriptions.push(newFacetSubscription)

  return newFacetSubscription
}

/**
 * Factory function to create the `useSharedFacet` hook.
 * It allows us to pass down a Record type as an argument, which
 * will be used to type check the calls to `useSharedFacet` and
 * make sure they match the expected API.
 *
 * @returns useSharedFacet
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUseSharedFacetHook = <T extends Record<string, any>>() => {
  const facetSubscriptions: FacetSubscription[] = []

  // These type overloads allow us to properly type the calls to
  // `useSharedFacet`, so that the keys match valid properties of type T,
  // (which was received as an argument of `createUseSharedHook`).
  function useSharedFacet<K1 extends keyof T>(path1: K1): Facet<T[K1]>
  function useSharedFacet<K1 extends keyof T, K2 extends keyof T[K1]>(path1: K1, path2: K2): Facet<T[K1][K2]>
  function useSharedFacet<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    path1: K1,
    path2: K2,
    path3: K3,
  ): Facet<T[K1][K2][K3]>
  function useSharedFacet<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
  >(path1: K1, path2: K2, path3: K3, path4: K4): Facet<T[K1][K2][K3][K4]>
  function useSharedFacet<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
  >(path1: K1, path2: K2, path3: K3, path4: K4, path5: K5): Facet<T[K1][K2][K3][K4][K5]>
  function useSharedFacet<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
  >(path1: K1, path2: K2, path3: K3, path4: K4, path5: K5, path6: K6): Facet<T[K1][K2][K3][K4][K5][K6]>
  function useSharedFacet<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  >(path1: K1, path2: K2, path3: K3, path4: K4, path5: K5, path6: K6, path7: K7): Facet<T[K1][K2][K3][K4][K5][K6][K7]>
  function useSharedFacet<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
  >(
    path1: K1,
    path2: K2,
    path3: K3,
    path4: K4,
    path5: K5,
    path6: K6,
    path7: K7,
    path8: K8,
  ): Facet<T[K1][K2][K3][K4][K5][K6][K7][K8]>
  function useSharedFacet<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
    K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8],
  >(
    path1: K1,
    path2: K2,
    path3: K3,
    path4: K4,
    path5: K5,
    path6: K6,
    path7: K7,
    path8: K8,
    path9: K9,
  ): Facet<T[K1][K2][K3][K4][K5][K6][K7][K8][K9]>
  /**
   * Returns a Facet connected to the data requested in the path.
   * If a Facet for that path was already requested somewhere else
   * in the application, it returns the same Facet, to minimize duplication.
   *
   * When all consumers of a particular path are unmounted or otherwise
   * removed, it tells the SharedFacetDriver to terminate the subscription
   * for that path.
   *
   * @param ...path the path of the Facet to be requested
   * @returns the Facet containing the requested data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useSharedFacet(...path: any[]): Facet<any> {
    const facetSubscription = useRequestFacet(path, facetSubscriptions)

    useEffect(() => {
      facetSubscription.subscriberCount += 1

      return () => {
        facetSubscription.subscriberCount -= 1

        if (facetSubscription.subscriberCount === 0) {
          facetSubscription.unsubscriber()

          removeFacetSubscription(facetSubscription, facetSubscriptions)
        }
      }

      // We want to listen to changes in the path, so this is correct,
      // despite the React warning (the linter cannot statically check
      // that these dependencies are valid)

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, path)

    return facetSubscription.facet
  }

  return useSharedFacet
}
