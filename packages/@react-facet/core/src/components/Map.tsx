import React, { ReactElement } from 'react'
import { useFacetMemo } from '../hooks/useFacetMemo'
import { useFacetUnwrap } from '../hooks/useFacetUnwrap'
import { useFacetMap } from '../hooks/useFacetMap'
import { EqualityCheck, Facet, NO_VALUE } from '../types'

export type MapProps<T> = {
  array: Facet<T[]>
  children: (item: Facet<T>, index: number) => ReactElement | null
  equalityCheck?: EqualityCheck<T>
}

export const Map = <T,>({ array, children, equalityCheck }: MapProps<T>) => {
  // When mounting lists, we always want to defer
  const countValue = useFacetUnwrap(useFacetMap((array) => array.length, [], [array]))

  return (
    <>
      {times(
        (index) =>
          equalityCheck !== undefined ? (
            <MapChildMemo<T>
              key={index}
              arrayFacet={array}
              index={index}
              equalityCheck={equalityCheck}
              children={children}
            />
          ) : (
            <MapChild<T> key={index} arrayFacet={array} index={index} children={children} />
          ),
        countValue !== NO_VALUE ? countValue : 0,
      )}
    </>
  )
}

type MapChildMemoProps<T> = {
  arrayFacet: Facet<T[]>
  index: number
  children: (item: Facet<T>, index: number) => ReactElement | null
  equalityCheck: EqualityCheck<T>
}

const MapChildMemo = <T,>({ arrayFacet, index, children, equalityCheck }: MapChildMemoProps<T>) => {
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

type MapChildProps<T> = {
  arrayFacet: Facet<T[]>
  index: number
  children: (item: Facet<T>, index: number) => ReactElement | null
}

const MapChild = <T,>({ arrayFacet, index, children }: MapChildProps<T>) => {
  const childFacet = useFacetMap(
    (array) => {
      if (index < array.length) return array[index]
      return NO_VALUE
    },
    [index],
    [arrayFacet],
  )

  return children(childFacet, index)
}

interface TimesFn<T> {
  (index: number): T
}

const times = <T,>(fn: TimesFn<T>, n: number) => {
  const result = []

  for (let index = 0; index < n; index++) {
    result.push(fn(index))
  }

  return result
}
