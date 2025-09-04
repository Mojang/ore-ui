import { useLayoutEffect, useMemo, useRef, useState } from 'react'
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
  const initializationCleanup = useMemo(() => {
    if (!isFacet(prop)) return () => {}
    return prop.observe(() => {})
  }, [prop])

  const [state, setState] = useState<{ value: T | NoValue }>(() => {
    if (!isFacet(prop)) return { value: prop }

    return {
      value: prop.get(),
    }
  })

  // Creates a ref, and keep it updated (used for equality check within the effect)
  const previousStateRef = useRef(state)
  previousStateRef.current = state

  useLayoutEffect(() => {
    if (isFacet(prop)) {
      // Initialize the equalityCheck
      const isEqual = equalityCheck()
      const startValue = prop.get()
      if (startValue !== NO_VALUE) {
        isEqual(startValue)
      }

      const cleanup = prop.observe((value) => {
        const { value: previousValue } = previousStateRef.current

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

          // Even though we set the previous ref in the render (which should be triggered by
          // the setState), the setState re-render is delayed until all of the .set changes are
          // flushed. So we update the previous ref here to provide the correct value for subsequent
          // runs.
          // As an example:
          //    useEffect(() => {
          //      myFacet.set(true)
          //      myFacet.set(false)
          //    }, [])
          // This would flush both sets before the setState below causes a re-render to update the ref.
          // The line below fixes the above scenario.
          previousStateRef.current = { value }
          return setState({ value })
        }

        if (previousValue !== NO_VALUE && isEqual(value)) {
          return
        }

        return setState({ value })
      })

      initializationCleanup()

      return cleanup
    }
  }, [prop, equalityCheck, initializationCleanup])

  return isFacet(prop) ? state.value : prop
}
