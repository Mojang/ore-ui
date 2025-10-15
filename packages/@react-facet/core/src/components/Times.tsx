// Copyright (c) Mojang AB. All rights reserved.

import React, { ReactElement } from 'react'
import { Facet } from '../types'
import { Unwrap } from './Unwrap'

/**
 * Given a facet with a number, it renders its children "count" times.
 *
 * @param count facet with the amount of items to render
 * @param children function that will be called passing an index and the total.
 */
export const Times = ({
  count,
  children,
}: {
  count: Facet<number>
  children: (index: number, count: number) => ReactElement | null
}) => {
  return (
    <Unwrap data={count}>
      {(count) => {
        const array = new Array(count)

        for (let index = 0; index < count; index++) {
          array[index] = <React.Fragment key={index}>{children(index, count)}</React.Fragment>
        }

        return <>{array}</>
      }}
    </Unwrap>
  )
}
