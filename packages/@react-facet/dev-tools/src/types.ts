import { Facet } from '@react-facet/core'

export type ReactFacetDevTools = {
  send: (options: {
    hookName: string
    facets?: Facet<unknown>[]
    newFacet?: Facet<unknown>
    styleName?: string
    typeName?: string
  }) => void
}
