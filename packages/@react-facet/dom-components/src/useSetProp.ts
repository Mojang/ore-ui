import { useEffect } from 'react'
import { FacetProp, isFacet } from '@react-facet/core'

type Scalar = string | number | boolean | undefined

export function useSetProp<T extends Scalar>(prop: FacetProp<T> | undefined, update: (value: T | undefined) => void) {
  useEffect(() => {
    if (isFacet(prop)) {
      return prop.observe(update)
    } else {
      update(prop)
    }
  }, [prop, update])
}
