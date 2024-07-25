import { useLayoutEffect, useRef, useState } from 'react'
import { FacetProp, isFacet, Value, NoValue, EqualityCheck, NO_VALUE } from '../types'
import { defaultEqualityCheck } from '../equalityChecks'

/**
 * Hook that allows consuming values from a Facet
 * It acts as a regular react state, triggering a re-render of the component
 *
 * @param facet
 */
export function useFacetUnwrap<T extends Value>(
  prop: FacetProp<T>,
  equalityCheck: EqualityCheck<T> = defaultEqualityCheck,
): T | NoValue {
  const previousStateRef = useRef<T | NoValue>(NO_VALUE)

  const [state, setState] = useState<{ value: T | NoValue }>(() => {
    if (!isFacet(prop)) return { value: prop }

    const value = prop.get()
    previousStateRef.current = value

    return { value }
  })

  useLayoutEffect(() => {
    if (isFacet(prop)) {
      // Initialize the equalityCheck
      const isEqual = equalityCheck()
      const startValue = prop.get()
      if (startValue !== NO_VALUE) {
        isEqual(startValue)
      }

      return prop.observe((value) => {
        const previousValue = previousStateRef.current
        previousStateRef.current = value

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
        if (equalityCheck === defaultEqualityCheck) {
          const typeofValue = typeof previousValue

          if (
            (typeofValue === 'number' ||
              typeofValue === 'string' ||
              typeofValue === 'boolean' ||
              value === undefined ||
              value === null) &&
            value === previousValue
          ) {
            return
          }

          setState({ value })
          return
        }

        if (previousValue !== NO_VALUE && isEqual(value)) {
          return
        }

        setState({ value })
      })
    }
  }, [prop, equalityCheck])

  return isFacet(prop) ? state.value : prop
}
