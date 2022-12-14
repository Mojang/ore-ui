import React from 'react'
import { useFacetMap } from '@react-facet/core'
import { FacetProp } from '../types'
import { MountProps, NO_MOUNT_VALUE } from './Mount'
import { FastDivProps } from '@react-facet/dom-fiber'

type ShowProps<T> = MountProps<T> & FastDivProps

export const ShowDiv = <T,>({ when, children, is = true, not = NO_MOUNT_VALUE, ...props }: ShowProps<T>) => {
  const displayStyle = useFacetMap(
    (when) => {
      const shouldShowChildren = not !== NO_MOUNT_VALUE ? when !== not : when === is
      return shouldShowChildren ? 'unset' : 'none'
    },
    [is, not],
    [when],
  )

  return (
    <fast-div style={{ display: displayStyle }} {...props}>
      <>{children}</>
    </fast-div>
  )
}
