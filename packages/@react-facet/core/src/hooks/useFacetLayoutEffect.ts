import { useLayoutEffect } from 'react'
import { createUseFacetEffect } from './useFacetEffect'

/**
 * Allows running an effect based on facet updates. Similar to React's useLayoutEffect.
 *
 * @param effect function that will do the side-effect (ex: update the DOM)
 * @param dependencies variable used by the map that are available in scope (similar as dependencies of useEffect)
 * @param facets facets that the effect listens to
 *
 * We pass the dependencies of the callback as the second argument so we can leverage the eslint-plugin-react-hooks option for additionalHooks.
 * Having this as the second argument allows the linter to work.
 */
export const useFacetLayoutEffect = createUseFacetEffect(useLayoutEffect)
