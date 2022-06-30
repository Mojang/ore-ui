import React, { ReactElement } from 'react'
import { useFacetMap, useFacetMemo, useFacetUnwrap } from '../hooks'
import { EqualityCheck, Facet, NO_VALUE } from '../types'

export type MapProps<T> = {
  array: Facet<T[]>
  children: (item: Facet<T>, index: number) => ReactElement
  equalityCheck?: EqualityCheck<T>
}

export const Map = <T,>({ array, children, equalityCheck }: MapProps<T>) => {
  const countValue = useFacetUnwrap(useFacetMap((array) => array.length, [], [array])) ?? 0

  return (
    <>
      {times(
        (index) =>
          equalityCheck != null ? (
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
  children: (item: Facet<T>, index: number) => ReactElement
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
  children: (item: Facet<T>, index: number) => ReactElement
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

export type MapWithKeyProps<T> = MapProps<T> & { keySelector?: (item: T) => React.Key }

export const MapWithKey = <T,>({ array, children, equalityCheck, keySelector }: MapWithKeyProps<T>) => {
  const arrayLength = useFacetUnwrap(useFacetMap((array) => array.length, [], [array]))
  const arrayUnwrapped = array.get()

  if (arrayLength === NO_VALUE || arrayUnwrapped == NO_VALUE) return null

  return (
    <>
      {arrayUnwrapped.map((item, index) => {
        const key = keySelector?.(item) ?? index

        return (
          <MapWithKeyChild<T>
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
type MapWithKeyChildProps<T> = {
  arrayFacet: Facet<T[]>
  item: T
  index: number
  children: (item: Facet<T>, index: number) => ReactElement
  equalityCheck?: EqualityCheck<T>
}

const MapWithKeyChild = <T,>({ arrayFacet, children, index, equalityCheck }: MapWithKeyChildProps<T>) => {
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
