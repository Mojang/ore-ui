import { Facet } from '../types'
import { useRef } from 'react'
import { useFacetEffect } from './useFacetEffect'
import { NoValue } from '..'

export const useFacetRef = <T>(facet: Facet<T>) => {
  const value = facet.get()
  const ref = useRef<T | NoValue>(value)

  useFacetEffect(
    (value) => {
      ref.current = value
    },
    [],
    [facet],
  )

  return ref
}
