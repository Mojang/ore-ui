import { ReactElement } from 'react'
import { useFacetUnwrap } from '../hooks/useFacetUnwrap'
import { useFacetMap } from '../hooks/useFacetMap'
import { Facet, NoValue } from '../types'

type WithProps<T> = {
  data: Facet<T | null | undefined>
  children: (data: Facet<T>) => ReactElement | null
}

const hasData = <T,>(_: Facet<T | null | undefined>, shouldRender: boolean | NoValue): _ is Facet<T> => {
  return shouldRender === true
}

export const With = <T,>({ data, children }: WithProps<T>) => {
  const shouldRenderFacet = useFacetMap((data) => data !== null && data !== undefined, [], [data])
  const shouldRender = useFacetUnwrap(shouldRenderFacet)
  return hasData(data, shouldRender) ? children(data) : null
}
