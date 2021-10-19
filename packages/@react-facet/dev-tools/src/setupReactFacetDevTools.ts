import { ReactFacetDevTools } from '.'

export const setupReactFacetDevTools = (): ReactFacetDevTools => {
  const hooks = []

  return {
    send: ({ hookName, facets, newFacet }) => {
      hooks.push({ hookName, facets, newFacet })
    },
  }
}
