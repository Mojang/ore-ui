import { EqualityCheck } from './types'

/**
 * Creates an equality check that tests that the values of all the properties in an object
 * haven't changed.
 *
 * The comparison used for the value of the properties is passed to it as an argument.
 *
 * @param comparator the equality check to be run for each property
 */
export const createUniformObjectEqualityCheck =
  <T>(comparator: EqualityCheck<T[Extract<keyof T, string>]>) =>
  () => {
    const previous: Partial<{ [K in keyof T]: ReturnType<typeof comparator> }> = {}
    let previousKeys: Set<keyof T> = new Set()
    let initialized = false

    return (current: T) => {
      let isEquals = true
      for (const key in current) {
        if (!(key in previous)) {
          previous[key] = comparator()
        }
        if (!previous[key]?.(current[key])) {
          isEquals = false
        }
        previousKeys.delete(key)
      }
      if (previousKeys.size > 0) {
        for (const key of previousKeys) {
          delete previous[key]
        }
        isEquals = false
      }

      previousKeys = new Set()
      for (const key in current) {
        previousKeys.add(key)
      }

      if (!initialized) {
        initialized = true
        return false
      }

      return isEquals
    }
  }

/**
 * Creates an equality check that tests that the items in an array
 * haven't changed.
 *
 * The comparison used for the individual items is passed to it as an argument.
 *
 * @param comparator the equality check to be run for each item
 */
export const createUniformArrayEqualityCheck =
  <T>(comparator: EqualityCheck<T>) =>
  () => {
    const previous: ReturnType<typeof comparator>[] = []
    let initialized = false

    return (current: T[]) => {
      const longestLength = Math.max(previous?.length ?? 0, current?.length ?? 0)

      let isEquals = true
      for (let i = 0; i < longestLength; i++) {
        if (previous[i] == null) {
          previous[i] = comparator()
        }
        if (!previous[i](current[i])) {
          isEquals = false
        }
      }
      if (!initialized) {
        initialized = true
        return false
      }
      return isEquals
    }
  }

/**
 * Creates an equality check that tests whether each property of the target object has changed.
 * Each property is tested with a different comparator, so that they can be of different types.
 *
 * The comparator are passed down to it as an object with the same keys as the target object, but
 * comparators for each property as values.
 *
 * @param comparators the object containing the equality checks to be run for each property
 */
export const createObjectWithKeySpecificEqualityCheck =
  <T>(comparators: { [K in keyof T]: EqualityCheck<T[K]> }) =>
  () => {
    const initializingComparators: Partial<{ [K in keyof T]: (current: T[K]) => boolean }> = {}

    for (const key in comparators) {
      initializingComparators[key] = comparators[key]()
    }

    const initializedComparators = initializingComparators as { [K in keyof T]: (current: T[K]) => boolean }

    return (current: T) => {
      let isEqual = true
      for (const key in current) {
        if (!initializedComparators[key](current[key])) {
          // We don't break or skip the next comparators because we need all comparators
          // to run for their internal values to update, so we complete the for loop
          // even if one of the comparators reports false early on
          isEqual = false
        }
      }

      return isEqual
    }
  }

/**
 * Creates an equality check that tests whether the value changed from null to defined or stayed the same
 *
 * If the value was not null before and it is not null currently, the comparison is done by the equality check
 * provided as an argument to this creator.
 *
 * This creator is useful to be able to make equality checkers for optional properties when you already have
 * an equality check for the underlying type.
 *
 * @param comparator the equality check to be run in case the value was defined before and now
 */
export const createOptionalValueEqualityCheck =
  <T>(comparator: EqualityCheck<T>) =>
  () => {
    let previousWasNullish = true
    let initializedComparator = comparator()

    return (current: T | undefined | null) => {
      if (current == null) {
        if (previousWasNullish) {
          return true
        }

        // If the next value is nullish, the current comparator will be outdated.
        // We cannot simply pass a nullish value to it, since it doesn't accept nullish.
        // Instead, we need to initialize a new comparator to reset it
        initializedComparator = comparator()
        previousWasNullish = true
        return false
      }

      previousWasNullish = false
      return initializedComparator(current)
    }
  }
