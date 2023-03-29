import React, { ReactElement, useRef, useState, memo, useCallback } from 'react'
import { createFacet } from '../facet/createFacet'
import { useFacetEffect } from '../hooks/useFacetEffect'
import { EqualityCheck, Facet, WritableFacet, NO_VALUE } from '../types'

type MapWithKeyProps<T> = {
  array: Facet<T[]>
  keySelector?: (item: T) => React.Key
  children: (item: Facet<T>, index: number) => ReactElement | null
  equalityCheck?: EqualityCheck<T>
}

type ChildBaseProps<T> = {
  itemFacet: Facet<T>
  key: React.Key
}

type ChildProps<T> = ChildBaseProps<T> & {
  children: (item: Facet<T>, index: number) => ReactElement | null
  index: number
}

export const MapWithKey = <T,>({ array, children, keySelector, equalityCheck }: MapWithKeyProps<T>) => {
  const currentEqualityCheckRef = useRef<EqualityCheck<T> | undefined>(equalityCheck)
  const itemFacetsMap = useRef<Map<React.Key, WritableFacet<T>>>(new Map())
  const createInitialChildrenProps = useCallback(() => {
    const childrenProps: ChildBaseProps<T>[] = []
    const unwrappedArray = array.get()
    if (unwrappedArray == NO_VALUE) return childrenProps

    for (let i = 0; i < unwrappedArray.length; i++) {
      const item = unwrappedArray[i]
      const key = keySelector != null ? keySelector(item) : i
      const itemFacet = createFacet({ initialValue: item, equalityCheck })
      itemFacetsMap.current.set(key, itemFacet)
      childrenProps.push({ key, itemFacet })
    }

    return childrenProps
  }, [equalityCheck, keySelector, array])
  const [childrenProps, setChildrenProps] = useState<ChildBaseProps<T>[]>(createInitialChildrenProps)

  useFacetEffect(
    (array) => {
      const equalityCheckUpdated = currentEqualityCheckRef.current !== equalityCheck
      if (equalityCheckUpdated) {
        // There is no way of updating a facet with a new equality check so we recreate them instead.
        // We could of course add that to the facet API, however updating the equality check dynamically
        // is very rare and it's therefore not worth it.
        itemFacetsMap.current.clear()
        currentEqualityCheckRef.current = equalityCheck
      }

      setChildrenProps((currentChildrenProps) => {
        let shouldUpdate = array.length !== currentChildrenProps.length || equalityCheckUpdated
        const newChildrenProps = []

        for (let i = 0; i < array.length; i++) {
          const item = array[i]
          const key = keySelector != null ? keySelector(array[i]) : i
          let itemFacet: WritableFacet<T> | undefined = undefined

          if (itemFacetsMap.current.has(key)) {
            itemFacet = itemFacetsMap.current.get(key) as WritableFacet<T>
            itemFacet.set(item)

            const currentChildProps = currentChildrenProps[i]
            shouldUpdate = shouldUpdate || currentChildProps == null || currentChildProps.key !== key
          } else {
            itemFacet = createFacet({ initialValue: item, equalityCheck })
            itemFacetsMap.current.set(key, itemFacet)

            shouldUpdate = true
          }

          newChildrenProps.push({ key, itemFacet })
        }

        return shouldUpdate ? newChildrenProps : currentChildrenProps
      })
    },
    [keySelector, equalityCheck],
    [array],
  )

  return (
    <>
      {childrenProps.map((childProps, index) => {
        return (
          <MemoizedMapChild
            {...childProps}
            children={children as (item: Facet<unknown>, index: number) => ReactElement | null}
            index={index}
          />
        )
      })}
    </>
  )
}

const MapChild = <T,>({ itemFacet, children, index }: ChildProps<T>) => {
  return children(itemFacet, index)
}
const MemoizedMapChild = memo(MapChild)
