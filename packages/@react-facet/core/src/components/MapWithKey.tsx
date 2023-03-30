import React, { ReactElement, useRef, useState, memo } from 'react'
import { createFacet } from '../facet/createFacet'
import { useFacetEffect } from '../hooks/useFacetEffect'
import { mapFacetSingleLightweight } from '../mapFacets'
import { EqualityCheck, Facet, WritableFacet, NO_VALUE } from '../types'

type KeySelector<T> = (item: T) => React.Key
type Children<T> = (item: Facet<T>, index: number) => ReactElement | null

type MapWithKeyProps<T> = {
  array: Facet<T[]>
  keySelector?: KeySelector<T>
  children: Children<T>
  equalityCheck?: EqualityCheck<T>
}

type ChildBaseProps<T> = {
  itemFacet: Facet<T>
  key: React.Key
}

type ChildProps<T> = ChildBaseProps<T> & {
  children: Children<T>
  index: number
}

export const MapWithKey = <T,>({ array, children, keySelector, equalityCheck }: MapWithKeyProps<T>) => {
  const currentEqualityCheckRef = useRef<EqualityCheck<T> | undefined>(equalityCheck)
  const itemFacetsMap = useRef<Map<React.Key, Facet<T>>>(new Map())

  const [childrenProps, setChildrenProps] = useState<ChildBaseProps<T>[]>(() => {
    const childrenProps: ChildBaseProps<T>[] = []
    const unwrappedArray = array.get()
    const usingLightweightItemFacets = keySelector == null && equalityCheck == null
    if (unwrappedArray == NO_VALUE) return childrenProps

    for (let i = 0; i < unwrappedArray.length; i++) {
      const item = unwrappedArray[i]
      const key = keySelector != null ? keySelector(item) : i
      const itemFacet = !usingLightweightItemFacets
        ? createFacet({ initialValue: item, equalityCheck })
        : mapFacetSingleLightweight(array, (a) => a[i])
      itemFacetsMap.current.set(key, itemFacet)
      childrenProps.push({ key, itemFacet })
    }

    return childrenProps
  })

  useFacetEffect(
    (unwrappedArray) => {
      const equalityCheckUpdated = currentEqualityCheckRef.current !== equalityCheck
      if (equalityCheckUpdated) {
        // There is no way of updating a facet with a new equality check so we flush the cache and recreate them instead.
        // We could of course add that to the facet API, however updating the equality check dynamically is very rare
        // and it's therefore not worth it.
        itemFacetsMap.current.clear()
        currentEqualityCheckRef.current = equalityCheck
      }
      const usingLightweightItemFacets = keySelector == null && equalityCheck == null
      setChildrenProps((currentChildrenProps) => {
        const lengthUpdated = unwrappedArray.length !== currentChildrenProps.length
        if (!lengthUpdated && usingLightweightItemFacets) return currentChildrenProps

        let shouldUpdate = lengthUpdated || equalityCheckUpdated
        const newChildrenProps = []

        for (let i = 0; i < unwrappedArray.length; i++) {
          const item = unwrappedArray[i]
          const key = keySelector != null ? keySelector(item) : i
          let itemFacet: Facet<T> | undefined = undefined

          if (itemFacetsMap.current.has(key)) {
            itemFacet = itemFacetsMap.current.get(key) as Facet<T>

            if (!usingLightweightItemFacets) {
              const writeableItemFacet = itemFacet as WritableFacet<T>
              writeableItemFacet.set(item)
            }

            const currentChildProps = currentChildrenProps[i]
            shouldUpdate = shouldUpdate || currentChildProps == null || currentChildProps.key !== key
          } else {
            itemFacet = !usingLightweightItemFacets
              ? createFacet({ initialValue: item, equalityCheck })
              : mapFacetSingleLightweight(array, (a) => a[i])
            itemFacetsMap.current.set(key, itemFacet)

            shouldUpdate = true
          }

          newChildrenProps.push({ key, itemFacet })
        }

        return shouldUpdate ? newChildrenProps : currentChildrenProps
      })
    },
    [keySelector, equalityCheck, array],
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
