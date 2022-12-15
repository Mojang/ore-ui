import React from 'react'
import { FacetProp, useFacetMap, useFacetWrap } from '@react-facet/core'
import { MountProps, NO_MOUNT_VALUE } from './Mount'
import { FastDivProps } from '@react-facet/dom-fiber'

type ShowProps<T> = MountProps<T> &
  Omit<FastDivProps, 'style'> & {
    display?: FacetProp<'flex' | 'none' | 'unset' | null | undefined>
  }

export const Show = <T,>({ when, children, display, is = true, not = NO_MOUNT_VALUE, ...props }: ShowProps<T>) => {
  const displayStyle = useFacetMap(
    (when, displayProp) => {
      const shouldShowChildren = not !== NO_MOUNT_VALUE ? when !== not : when === is
      return shouldShowChildren ? displayProp ?? 'unset' : 'none'
    },
    [is, not],
    [when, useFacetWrap(display)],
  )

  return (
    <fast-div style={{ display: displayStyle }} {...props}>
      <>{children}</>
    </fast-div>
  )
}
