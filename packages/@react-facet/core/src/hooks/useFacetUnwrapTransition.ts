import { useLayoutEffect, useState, useTransition } from 'react'
import { NoValue } from '..'
import { FacetProp, isFacet, Value } from '../types'

/**
 * Hook that allows consuming values from a Facet as plain React State values.
 *
 * Unwraps as a transition (useTransition), yielding to more urgent updates such as clicks.
 *
 * @param facet
 * @return a boolean indicating if the transition is pending, plus the unwrapped value.
 */
export function useFacetUnwrapTransition<T extends Value>(prop: FacetProp<T>): [boolean, T | NoValue] {
  const [state, setState] = useState<{ value: T | NoValue }>(() => {
    if (!isFacet(prop)) return { value: prop }

    return {
      value: prop.get(),
    }
  })

  const [isPending, startTransition] = useTransition()

  useLayoutEffect(() => {
    if (isFacet(prop)) {
      return prop.observe((value: T) => {
        startTransition(() => {
          setState((previousState) => {
            const { value: previousValue } = previousState

            const typeofValue = typeof previousValue

            /**
             * Performs this equality check locally to prevent triggering two consecutive renderings
             * for facets that have immutable values (unfortunately we can't handle mutable values).
             *
             * The two renderings might happen for the same state value if the Facet has a value on mount.
             *
             * The unwrap will get the value:
             * - Once on initialization of the useState above
             * - And another time on this observe initialization
             */
            if (
              (typeofValue === 'number' ||
                typeofValue === 'string' ||
                typeofValue === 'boolean' ||
                value === undefined ||
                value === null) &&
              value === previousValue
            ) {
              return previousState
            }

            return { value }
          })
        })
      })
    }
  }, [prop, startTransition])

  return [isPending, isFacet(prop) ? state.value : prop]
}
