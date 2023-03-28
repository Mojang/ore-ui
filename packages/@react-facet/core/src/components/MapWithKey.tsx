import React, { ReactElement, useRef, useState, memo, useMemo } from 'react'
import { createFacet } from '../facet/createFacet'
import { useFacetEffect } from '../hooks/useFacetEffect'
import { EqualityCheck, Facet, NO_VALUE } from '../types'

export type MapWithKeysProps<T> = {
  array: Facet<T[]>
  keySelector: (item: T) => React.Key
  children: (item: Facet<T>, index: number) => ReactElement | null
  equalityCheck?: EqualityCheck<T>
}

export const MapWithKey = <T,>({ array, children, keySelector, equalityCheck }: MapWithKeysProps<T>) => {
  const currentKeys = useRef<React.Key[]>([])
  const [, rerender] = useState(0)

  useFacetEffect(
    (array) => {
      let shouldRerender = array.length != currentKeys.current.length
      const newKeys = []

      // Even though shouldRerender is true, we still need to loop through every item in the array
      // in order to make sure no keys have changed and update previousKeys accordingly.
      for (let i = 0; i < array.length; i++) {
        const key = keySelector(array[i])
        newKeys.push(key)

        if (!shouldRerender && newKeys[i] !== currentKeys.current[i]) {
          shouldRerender = true
        }
      }

      if (shouldRerender) {
        currentKeys.current = newKeys
        rerender((value) => value + 1)
      }
    },
    [keySelector],
    [array],
  )

  const unwrappedArray = array.get()
  if (unwrappedArray === NO_VALUE) return null

  return (
    <>
      {unwrappedArray.map((item, index) => {
        return (
          <MemoizedMapChild
            key={currentKeys.current[index]}
            memoKey={currentKeys.current[index]}
            index={index}
            children={children as (item: Facet<unknown>, index: number) => ReactElement | null}
            item={item}
            equalityCheck={equalityCheck as EqualityCheck<unknown> | undefined}
          />
        )
      })}
    </>
  )
}

type MapChildProps<T> = {
  item: T
  index: number
  children: (item: Facet<T>, index: number) => ReactElement | null
  equalityCheck?: EqualityCheck<T>
  memoKey: React.Key
}

const MapChild = <T,>({ item, children, index, equalityCheck }: MapChildProps<T>) => {
  const itemFacet = useMemo(
    () => createFacet<T>({ initialValue: item, equalityCheck }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return children(itemFacet, index)
}

const arePropsEqual = (oldProps: MapChildProps<unknown>, newProps: MapChildProps<unknown>) => {
  return oldProps.memoKey === newProps.memoKey
}
const MemoizedMapChild = memo(MapChild, arePropsEqual)
