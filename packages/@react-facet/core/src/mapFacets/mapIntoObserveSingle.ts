import { EqualityCheck, Listener, NO_VALUE, Observe, Facet, NoValue } from '../types'

export function mapIntoObserveSingle<T, M>(facet: Facet<T>, fn: (value: T) => M | NoValue): Observe<M> {
  return (listener: Listener<M>) => {
    return facet.observe((value: T) => {
      const result = fn(value)
      if (result === NO_VALUE) return

      listener(result)
    })
  }
}

// The default equality checker is inlined here as an
// optimization for the most common equality checker
export function mapIntoObserveSingleDefaultEqualityCheck<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
): Observe<M> {
  return (listener: Listener<M>) => {
    let currentValue: M | typeof NO_VALUE = NO_VALUE

    // Check if we have an initial value
    const initialFacetValue = facet.get()
    if (initialFacetValue !== NO_VALUE) {
      const initialResult = fn(initialFacetValue)
      if (initialResult !== NO_VALUE) {
        // Save the initial value on first run
        currentValue = initialResult
        listener(initialResult)
      }
    }

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

      listener(result)
    })
  }
}

export function mapIntoObserveSingleCustomEqualityCheck<T, M>(
  facet: Facet<T>,
  fn: (value: T) => M | NoValue,
  equalityCheck: EqualityCheck<M>,
): Observe<M> {
  // Finally we use the custom equality check
  return (listener: Listener<M>) => {
    const checker = equalityCheck()

    // Check if we have an initial value
    const initialFacetValue = facet.get()

    if (initialFacetValue !== NO_VALUE) {
      const initialResult = fn(initialFacetValue)
      if (initialResult !== NO_VALUE) {
        // Run the checker to save the initial value on first run
        if (!checker(initialResult)) {
          listener(initialResult)
        }
      }
    }

    return facet.observe((value: T) => {
      const result = fn(value)

      if (result === NO_VALUE) return
      if (checker(result)) return

      listener(result)
    })
  }
}
