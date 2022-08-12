import { Facet, useFacetEffect } from '@react-facet/core'

/**
 * Listens to and logs the current value of the facet.
 *
 * @param facet facet to be listened to and logged
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export function useFacetLog(facet: Facet<unknown>) {
  useFacetEffect(
    (value) => {
      console.log(value)
    },
    [],
    [facet],
  )
}
