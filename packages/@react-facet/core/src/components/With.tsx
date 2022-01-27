import { ReactElement } from 'react'
import { useFacetMap, useFacetUnwrap } from '../hooks'
import { Facet } from '../types'

type WithProps<T> = {
  data: Facet<T | null | undefined>
  children: (data: Facet<T>) => ReactElement
}

export const With = <T,>({ data, children }: WithProps<T>) => {
  const shouldRenderFacet = useFacetMap((data) => data != null, [], [data])
  const shouldRender = useFacetUnwrap(shouldRenderFacet)
  return shouldRender === true ? children(data as Facet<T>) : null
}
