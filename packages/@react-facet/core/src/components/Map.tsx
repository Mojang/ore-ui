import React, { ReactElement, useMemo, useEffect } from 'react'
import { useFacetMap, useFacetUnwrap, useFacetMemo, useFacetWrap } from '../hooks'
import { EqualityCheck, Facet, NO_VALUE, FacetProp } from '../types'
import { createFacet } from '../facet'

export type MapProps<T> = {
  children: (item: Facet<T>, index: number) => ReactElement
  array: Facet<T[]>
  keySelector?: (item: T) => string
  equalityCheck?: EqualityCheck<T>
}

export const Map = <T,>({ array, children, equalityCheck, keySelector }: MapProps<T>) => {
  const arrayLength = useFacetUnwrap(useFacetMap((array) => array.length, [], [array]))
  const arrayUnwrapped = array.get()

  if (arrayLength === NO_VALUE || arrayUnwrapped == NO_VALUE) return null

  return (
    <>
      {arrayUnwrapped.map((item, index) => {
        const key = keySelector?.(item) ?? index
        return (
          <Child<T>
            arrayFacet={array}
            key={key}
            index={index}
            item={item}
            children={children}
            equalityCheck={equalityCheck}
          />
        )
      })}
    </>
  )
}

type ChildProps<T> = {
  arrayFacet: Facet<T[]>
  item: T
  index: number
  children: (item: Facet<T>, index: number) => ReactElement
  equalityCheck?: EqualityCheck<T>
}

const Child = <T,>({ arrayFacet, children, index, equalityCheck }: ChildProps<T>) => {
  const childFacet = useFacetMemo(
    (array) => {
      if (index < array.length) return array[index]
      return NO_VALUE
    },
    [index],
    [arrayFacet],
    equalityCheck,
  )

  return children(childFacet, index)
}
