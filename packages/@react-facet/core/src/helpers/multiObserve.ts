import { Facet, Unsubscribe, Cleanup, NO_VALUE, ExtractFacetValues } from '../types'

/**
 * Allows running an effect based on facet updates. Similar to React's useEffect.
 *
 * @param effect function that will do the side-effect (ex: update the DOM)
 * @param dependencies variable used by the map that are available in scope (similar as dependencies of useEffect)
 * @param facets facets that the effect listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function multiObserve<Y extends Facet<unknown>[], T extends [...Y]>(
  effect: (...args: ExtractFacetValues<T>) => void | Cleanup,
  facets: T,
) {
  if (facets.length === 1) {
    return facets[0].observe(effect as (...args: unknown[]) => ReturnType<typeof effect>)
  }

  let cleanup: void | Cleanup
  let hasAllDependencies = false
  const unsubscribes: Unsubscribe[] = []
  const values: unknown[] = facets.map(() => NO_VALUE)

  for (let i = 0; i < facets.length; i++) {
    unsubscribes[i] = facets[i].observe((value) => {
      values[i] = value
      hasAllDependencies = hasAllDependencies || values.every((value) => value !== NO_VALUE)

      if (hasAllDependencies) {
        if (cleanup !== undefined) {
          cleanup()
        }

        cleanup = effect(...(values as ExtractFacetValues<T>))
      }
    })
  }

  return () => {
    for (let index = 0; index < unsubscribes.length; index++) {
      unsubscribes[index]()
    }
    if (cleanup !== undefined) {
      cleanup()
    }
  }
}
