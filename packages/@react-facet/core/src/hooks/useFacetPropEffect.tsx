import { useEffect } from 'react'
import { wrapFacets } from '../facet'
import { Unsubscribe, Cleanup, NO_VALUE, FacetProp, ExtractFacetPropValues, isFacet } from '../types'

/**
 * Allows running an effect based on facet updates. Similar to React's useEffect.
 *
 * @param effect function that will do the side-effect (ex: update the DOM)
 * @param facetProps facets that the effect listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetPropEffect<Y extends FacetProp<unknown>[], T extends [...Y]>(
  effect: (...args: ExtractFacetPropValues<T>) => void | Cleanup,
  facetProps: T,
) {
  useEffect(() => {
    const effectTyped = effect as (...args: unknown[]) => ReturnType<typeof effect>

    if (facetProps.length === 1) {
      const facetProp = facetProps[0]

      return isFacet(facetProp) ? facetProp.observe(effectTyped) : effectTyped(facetProp)
    }

    let cleanup: void | Cleanup
    let hasAllDependencies = false
    const unsubscribes: Unsubscribe[] = []
    const values: unknown[] = facetProps.map(() => NO_VALUE)

    wrapFacets(facetProps).forEach((facet, index) => {
      unsubscribes[index] = facet.observe((value) => {
        values[index] = value
        hasAllDependencies = hasAllDependencies || values.every((value) => value != NO_VALUE)

        if (hasAllDependencies) {
          if (cleanup != null) {
            cleanup()
          }

          cleanup = effect(...(values as ExtractFacetPropValues<T>))
        }
      })
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
      if (cleanup != null) {
        cleanup()
      }
    }

    // We care about each individual facet and if any is a different reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, ...facetProps])
}
