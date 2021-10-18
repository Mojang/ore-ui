import { ReactFacetDevTools } from '.'

const hooks = []

export const __REACT_FACET_DEV_TOOLS__: ReactFacetDevTools = {
  send: ({ hookName, facets, newFacet }) => {
    hooks.push({ hookName, facets, newFacet })
  },
}
