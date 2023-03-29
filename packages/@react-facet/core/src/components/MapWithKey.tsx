import React, { ReactElement, useRef, useState, memo, useMemo } from 'react'
import { createFacet } from '../facet/createFacet'
import { useFacetEffect } from '../hooks/useFacetEffect'
import { EqualityCheck, Facet, NO_VALUE, WritableFacet } from '../types'

export type MapWithKeysProps<T> = {
  array: Facet<T[]>
  keySelector?: (item: T) => React.Key
  children: (item: Facet<T>, index: number) => ReactElement | null
  equalityCheck?: EqualityCheck<T>
}

export const MapWithKey = <T,>({ array, children, keySelector, equalityCheck }: MapWithKeysProps<T>) => {
  const currentKeys = useRef<React.Key[]>([])
  const itemFacetsMap = useRef<Map<React.Key, WritableFacet<T>>>(new Map())
  const [, rerender] = useState(0)

  useFacetEffect(
    (array) => {
      let shouldRerender = array.length != currentKeys.current.length
      const newKeys = []

      for (let i = 0; i < array.length; i++) {
        const item = array[i]
        // Get key
        const key = keySelector != null ? keySelector(array[i]) : i
        newKeys.push(key)

        // Update the item facet
        const itemFacet = itemFacetsMap.current.get(key)
        if (itemFacet != null) {
          itemFacet.set(item)
        }

        // Determine if we need to rerender
        shouldRerender = shouldRerender || key !== currentKeys.current[i]
      }

      if (shouldRerender) {
        currentKeys.current = newKeys
        rerender((value) => value + 1)
      }
    },
    [keySelector, equalityCheck],
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
            itemFacetsMap={itemFacetsMap}
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
  itemFacetsMap: React.MutableRefObject<Map<React.Key, Facet<T>>>
}

const MapChild = <T,>({ item, children, index, equalityCheck, itemFacetsMap, memoKey }: MapChildProps<T>) => {
  const itemFacet = useMemo(
    () => {
      // Create the facet
      const facet = createFacet<T>({ initialValue: item, equalityCheck })
      // Update the facet map
      itemFacetsMap.current.set(memoKey, facet)
      return facet
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return children(itemFacet, index)
}

const arePropsEqual = (oldProps: MapChildProps<unknown>, newProps: MapChildProps<unknown>) => {
  return oldProps.memoKey === newProps.memoKey
}
const MemoizedMapChild = memo(MapChild, arePropsEqual)
