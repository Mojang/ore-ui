import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Facet, isFacet, Value, NoValue, Option } from '../types'
import { NO_VALUE } from '@react-facet/core'
import { asPromise } from '../helpers'

/**
 * Hook that allows consuming values from a Facet
 * It acts as a regular react state, triggering a re-render of the component
 *
 * @param facet
 */
export function useFacetUnwrap<T extends Value>(prop: Facet<T>): T {
  // const [state, setState] = useState<{ value: T | NoValue }>(() => {
  //   if (!isFacet(prop)) return { value: prop }

  //   return {
  //     value: prop.get(),
  //   }
  // })

  const value = useSyncExternalStore<Option<T>>(prop.observe, prop.get)

  if (value === NO_VALUE) {
    throw asPromise(prop)
  }

  return value

  // useLayoutEffect(() => {
  //   if (isFacet(prop)) {
  //     return prop.observe((value) => {
  //       setState((previousState) => {
  //         const { value: previousValue } = previousState

  //         const typeofValue = typeof previousValue

  //         /**
  //          * Performs this equality check locally to prevent triggering two consecutive renderings
  //          * for facets that have immutable values (unfortunately we can't handle mutable values).
  //          *
  //          * The two renderings might happen for the same state value if the Facet has a value on mount.
  //          *
  //          * The unwrap will get the value:
  //          * - Once on initialization of the useState above
  //          * - And another time on this observe initialization
  //          */
  //         if (
  //           (typeofValue === 'number' ||
  //             typeofValue === 'string' ||
  //             typeofValue === 'boolean' ||
  //             value === undefined ||
  //             value === null) &&
  //           value === previousValue
  //         ) {
  //           return previousState
  //         }

  //         return { value }
  //       })
  //     })
  //   }
  // }, [prop])

  // return isFacet(prop) ? state.value : prop
}
