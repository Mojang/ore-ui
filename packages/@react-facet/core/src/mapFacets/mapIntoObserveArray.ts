import { cancelScheduledTask, scheduleTask } from '../scheduler'
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
    let isFirstTimeRunning = true

    const dependencyValues: Option<unknown>[] = facets.map(() => NO_VALUE)
    let hasAllDependencies = false

    const task =
      checker === undefined
        ? () => {
            hasAllDependencies = hasAllDependencies || dependencyValues.every((value) => value !== NO_VALUE)
            if (!hasAllDependencies) return

            const result = fn(...dependencyValues)
            if (result === NO_VALUE) return

            listener(result)
          }
        : equalityCheck === defaultEqualityCheck
        ? () => {
            hasAllDependencies = hasAllDependencies || dependencyValues.every((value) => value !== NO_VALUE)
            if (!hasAllDependencies) return

            const result = fn(...dependencyValues)

            if (isFirstTimeRunning) {
              isFirstTimeRunning = false
              if (result !== NO_VALUE) {
                // Save the initial value on first run
                currentValue = result
                listener(result)
                return
              }
            }

            const typeofValue = typeof currentValue
            const isValuePrimitive =
              typeofValue === 'number' ||
              typeofValue === 'string' ||
              typeofValue === 'boolean' ||
              currentValue === null ||
              currentValue === undefined
            const isResultMatchingCurrentValue = currentValue === result

            if (result === NO_VALUE) return
            if (isValuePrimitive && isResultMatchingCurrentValue) return

            currentValue = result

            listener(result)
          }
        : () => {
            hasAllDependencies = hasAllDependencies || dependencyValues.every((value) => value !== NO_VALUE)
            if (!hasAllDependencies) return

            const result = fn(...dependencyValues)

            if (isFirstTimeRunning) {
              isFirstTimeRunning = false
              if (result !== NO_VALUE) {
                // Run the checker to save the initial value on first run
                if (!checker(result)) {
                  listener(result)
                }
                return
              }
            }

            if (result === NO_VALUE) return
            if (checker(result)) return

            listener(result)
          }

    const subscriptions = facets.map((facet, index) => {
      return facet.observe((value) => {
        dependencyValues[index] = value
        if (hasAllDependencies) {
          scheduleTask(task)
        } else {
          task()
        }
      })
    })

    return () => {
      cancelScheduledTask(task)
      subscriptions.forEach((unsubscribe) => unsubscribe())
    }
  }
}
