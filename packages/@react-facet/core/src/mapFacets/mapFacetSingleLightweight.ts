import { defaultEqualityCheck, Listener } from '..'
import { EqualityCheck, Facet, NO_VALUE, NoValue } from '../types'

export function mapFacetSingleLightweight<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Facet<M> {
  let hasSubscription = false
  let cleanup = noop
  const listeners = new Set<Listener<M>>()
  const checker = equalityCheck != null ? equalityCheck() : null

  return {
    get: () => {
      const value = facet.get()
      if (value === NO_VALUE) return NO_VALUE

      return fn(value)
    },

    // This function has been optimized for when a custom equalityCheck
    // function is provided.
    //
    // We have inlined the mapIntoObserveSingle function to allow
    // access to a persistent listeners Set and checker function.
    //
    // Previously, every observation to this lightweight object would create
    // a new facet subscription, which would in turn run the selector and
    // equalityCheck fn on every value change. The number of calls this
    // creates grows quite rapidly.
    //
    // We now only create 1 subscription to a facet, meaning the equalityCheck
    // and selector fn are only called once. The result of those calls is
    // then provided to each listener stored in the Set.
    //
    // This approach can be tidied up, but acts as an initial proof of concept.
    observe: (() => {
      // Most common scenario is not having any equality check
      if (equalityCheck == null) {
        return (listener: Listener<M>) => {
          return facet.observe((value: T) => {
            const result = fn(value)
            if (result === NO_VALUE) return

            return listener(result)
          })
        }
      }

      // Then we optimize for the second most common scenario of using the defaultEqualityCheck (by inline its implementation)
      if (equalityCheck === defaultEqualityCheck) {
        return (listener: Listener<M>) => {
          let currentValue: M | typeof NO_VALUE = NO_VALUE

          return facet.observe((value: T) => {
            const result = fn(value)
            if (result === NO_VALUE) return

            const typeofValue = typeof currentValue

            if (
              (typeofValue === 'number' ||
                typeofValue === 'string' ||
                typeofValue === 'boolean' ||
                currentValue === null ||
                currentValue === undefined) &&
              currentValue === result
            ) {
              return
            }

            currentValue = result

            return listener(result)
          })
        }
      }

      // Finally we use the custom equality check
      return (listener: Listener<M>) => {
        listeners.add(listener)

        if (!hasSubscription) {
          hasSubscription = true

          cleanup = facet.observe((value: T) => {
            const result = fn(value)
            if (result === NO_VALUE) return
            if (checker != null && checker(result)) return

            listeners.forEach((listener) => {
              listener(result)
            })
          })
        }

        return () => {
          listeners.delete(listener)
          if (listeners.size === 0) {
            cleanup()
          }
        }
      }
    })(),
  }
}

function noop() {}
