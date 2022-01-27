import { Facet } from '../types'
import { useRef } from 'react'
import { useFacetLayoutEffect } from './useFacetLayoutEffect'
import { NoValue } from '..'

export const useFacetRef = <T>(facet: Facet<T>) => {
  const value = facet.get()
  const ref = useRef<T | NoValue>(value)

  useFacetLayoutEffect(
    (value) => {
      ref.current = value
    },
    [],
    [facet],
  )

  return ref
}
