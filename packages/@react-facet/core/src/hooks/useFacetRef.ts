import { useRef, MutableRefObject } from 'react'
import { Facet } from '../types'
import { useFacetEffect } from './useFacetEffect'
import { NO_VALUE, Option } from '..'

export function useFacetRef<T>(facet: Facet<T>): MutableRefObject<Option<T>>
export function useFacetRef<T>(facet: Facet<T>, defaultValue: T): MutableRefObject<T>
export function useFacetRef<T>(facet: Facet<T>, defaultValue?: T): MutableRefObject<T> {
  let value = facet.get()
  if (value === NO_VALUE && defaultValue != undefined) {
    value = defaultValue
  }

  const ref = useRef<Option<T>>(value)
  useFacetEffect(
    (value) => {
      ref.current = value
    },
    [],
    [facet],
  )

  return ref as MutableRefObject<T>
}
