import { ReactElement } from 'react'
import { useFacetMemo } from '../hooks/useFacetMemo'
import { useFacetUnwrap } from '../hooks/useFacetUnwrap'
import { useFacetMap } from '../hooks/useFacetMap'
import { Facet, NO_VALUE } from '../types'

type WithProps<T> = {
  data: Facet<T | null | undefined>
  children: (data: Facet<T>) => ReactElement | null
}

/**
 * Conditionally renders a child if a given facet value is not null or undefined
 *
 * @param data facet value which can be null or undefined
 * @param children render prop which receives the transformed facet
 */
export const With = <T,>({ data, children }: WithProps<T>) => {
  const shouldRenderFacet = useFacetMap((data) => data !== null && data !== undefined, [], [data])
  const shouldRender = useFacetUnwrap(shouldRenderFacet)
  const nonNullData = useFacetMemo((data) => (data !== null && data !== undefined ? data : NO_VALUE), [], [data])
  return shouldRender === true ? children(nonNullData) : null
}
