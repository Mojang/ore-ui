// Copyright (c) Mojang AB. All rights reserved.

import { ReactElement } from 'react'
import { useFacetUnwrap } from '../hooks'
import { Facet, NO_VALUE, Value } from '../types'

/**
 * Renders a child with an unwrapped given facet value
 *
 * @param data facet value
 * @param children render prop which receives the unwrapped facet
 */
export const Unwrap = <T extends Value>({
  data,
  children,
}: {
  data: Facet<T>
  children: (data: T) => ReactElement | null
}) => {
  const unwrapped = useFacetUnwrap(data)
  return unwrapped === NO_VALUE ? null : children(unwrapped)
}
