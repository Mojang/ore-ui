import { defaultEqualityCheck } from '../equalityChecks'
import { EqualityCheck, Listener, NO_VALUE, Observe, Facet, NoValue } from '../types'

export function mapIntoObserveSingle<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
  onCleanup?: () => void,
): Observe<M> {
  // Most common scenario is not having any equality check
  if (equalityCheck === undefined) {
    return (listener: Listener<M>) => {
      const unsubscribe = facet.observe((value: T) => {
        const result = fn(value)
        if (result === NO_VALUE) return

        listener(result)
      })
      return () => {
        unsubscribe()
        onCleanup?.()
      }
    }
  }

  // Then we optimize for the second most common scenario of using the defaultEqualityCheck (by inline its implementation)
  if (equalityCheck === defaultEqualityCheck) {
    return (listener: Listener<M>) => {
      let currentValue: M | typeof NO_VALUE = NO_VALUE

      const unsubscribe = facet.observe((value: T) => {
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

        listener(result)
      })
      return () => {
        unsubscribe()
        onCleanup?.()
      }
    }
  }

  // Finally we use the custom equality check
  return (listener: Listener<M>) => {
    const checker = equalityCheck()

    const unsubscribe = facet.observe((value: T) => {
      const result = fn(value)
      if (result === NO_VALUE) return
      if (checker(result)) return

      listener(result)
    })
    return () => {
      unsubscribe()
      onCleanup?.()
    }
  }
}
