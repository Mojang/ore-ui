import { useCallback, useEffect, useLayoutEffect } from 'react'
import { Facet, Unsubscribe, Cleanup, NO_VALUE, ExtractFacetValues } from '../types'
import { cancelScheduledTask, scheduleTask } from '../scheduler'

export const createUseFacetEffect = (useHook: typeof useEffect | typeof useLayoutEffect) => {
  return function <Y extends Facet<unknown>[], T extends [...Y]>(
    effect: (...args: ExtractFacetValues<T>) => undefined | Cleanup,
    dependencies: unknown[],
    facets: T,
  ) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const effectMemoized = useCallback(effect as (...args: unknown[]) => ReturnType<typeof effect>, dependencies)

    useHook(() => {
      let cleanup: undefined | Cleanup

      if (facets.length === 1) {
        const unsubscribe = facets[0].observe((value) => {
          if (cleanup !== undefined) {
            cleanup()
          }

          cleanup = effectMemoized(value)
        })

        return () => {
          unsubscribe()
          if (cleanup !== undefined) {
            cleanup()
          }
        }
      }

      let hasAllDependencies = false
      const unsubscribes: Unsubscribe[] = []
      const values: unknown[] = facets.map(() => NO_VALUE)

      const task = () => {
        hasAllDependencies = hasAllDependencies || values.every((value) => value !== NO_VALUE)

        if (hasAllDependencies) {
          if (cleanup !== undefined) {
            cleanup()
          }

          cleanup = effectMemoized(...(values as ExtractFacetValues<T>))
        }
      }

      facets.forEach((facet, index) => {
        unsubscribes[index] = facet.observe((value) => {
          values[index] = value
          if (hasAllDependencies) {
            scheduleTask(task)
          } else {
            task()
          }
        })
      })

      return () => {
        cancelScheduledTask(task)
        unsubscribes.forEach((unsubscribe) => unsubscribe())
        if (cleanup !== undefined) {
          cleanup()
        }
      }

      // We care about each individual facet and if any is a different reference
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectMemoized, ...facets])
  }
}

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
export const useFacetEffect = createUseFacetEffect(useEffect)
