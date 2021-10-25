import { Facet, NO_VALUE } from '../types'
import { useRef } from 'react'
import { useFacetEffect } from './useFacetEffect'
import { NoValue } from '..'
import { ReactFacetDevTools } from '@react-facet/dev-tools'

export const useFacetRef = <T>(facet: Facet<T>) => {
  const value = facet.get()
  const ref = useRef<T | NoValue>(value)

  useFacetEffect(
    (value) => {
      ref.current = value
    },
    [],
    facet,
  )

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((global as any).__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__ as ReactFacetDevTools).send({
      hookName: 'useFacetCallback',
      facets: [facet],
    })
  }

  return ref
}
