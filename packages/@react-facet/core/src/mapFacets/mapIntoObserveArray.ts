import { defaultEqualityCheck } from '../equalityChecks'
import { EqualityCheck, Listener, Option, NO_VALUE, Observe, Facet, NoValue } from '../types'

export function mapIntoObserveArray<M>(
  facets: Facet<unknown>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (...value: any[]) => M | NoValue,
  equalityCheck?: EqualityCheck<M>,
): Observe<M> {
  return (listener: Listener<M>) => {
    let currentValue: Option<M> = NO_VALUE
    const checker = equalityCheck?.()

    const dependencyValues: Option<unknown>[] = facets.map(() => NO_VALUE)
    let hasAllDependencies = false

    const subscriptions = facets.map((facet, index) => {
      // Most common scenario is not having any equality check
      if (equalityCheck == null) {
        return facet.observe((value) => {
          dependencyValues[index] = value

          hasAllDependencies = hasAllDependencies || dependencyValues.every((value) => value != NO_VALUE)

          if (hasAllDependencies) {
            const result = fn(...dependencyValues)
            if (result === NO_VALUE) return

            return listener(result)
          }
        })
      }

      // Then we optimize for the second most common scenario of using the defaultEqualityCheck (by inline its implementation)
      if (equalityCheck === defaultEqualityCheck) {
        return facet.observe((value) => {
          dependencyValues[index] = value

          hasAllDependencies = hasAllDependencies || dependencyValues.every((value) => value != NO_VALUE)

          if (hasAllDependencies) {
            const result = fn(...dependencyValues)
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
          }
        })
      }

      // Just a type-check guard, it will never happen
      if (checker == null) return () => {}

      // Finally we use the custom equality check
      return facet.observe((value) => {
        dependencyValues[index] = value

        hasAllDependencies = hasAllDependencies || dependencyValues.every((value) => value != NO_VALUE)

        if (hasAllDependencies) {
          const result = fn(...dependencyValues)
          if (result === NO_VALUE) return
          if (checker(result)) return

          return listener(result)
        }
      })
    })

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe())
    }
  }
}
