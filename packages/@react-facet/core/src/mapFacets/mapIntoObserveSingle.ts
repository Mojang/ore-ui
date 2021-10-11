import { defaultEqualityCheck } from '../equalityChecks'
import { EqualityCheck, Listener, NO_VALUE, Observe, Facet, NoValue } from '../types'

export function mapIntoObserveSingle<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Observe<M> {
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
    const checker = equalityCheck()

    return facet.observe((value: T) => {
      const result = fn(value)
      if (result === NO_VALUE) return
      if (checker(result)) return

      return listener(result)
    })
  }
}
