---
sidebar_position: 8
---

# Equality Checks

In order to avoid triggering unnecessary updates via the facets, there is a mechanism for prevent updates by passing equality checks to
them.

The built-in equality checks are aware of mutating objects and arrays, and that is why their APIs might seem counter-intuitive at first.

These are the equality checks currently available:

## `strictEqualityCheck`

Checks that the current value is exactly the same as the other previous one. Accepts value of type function, number, boolean, string, undefined or null.

```tsx twoslash
//@esModuleInterop
import { strictEqualityCheck } from '@react-facet/core'

const equalityCheck = strictEqualityCheck()

equalityCheck(0)

console.log(equalityCheck(0)) // true
console.log(equalityCheck(1)) // false
console.log(equalityCheck(1)) // true
```

## `shallowObjectEqualityCheck` and `nullableShallowObjectEqualityCheck`

Equality check that verifies the values of each key of an object.

Each value must be a primitive (boolean, number or string).

There is also a variant that supports "nullable values" (`undefined` and `null`).

```tsx twoslash
//@esModuleInterop
import { shallowObjectEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowObjectEqualityCheck()

equalityCheck({ name: 'Alex', height: 2 })

console.log(equalityCheck({ name: 'Alex', height: 2 })) // true
console.log(equalityCheck({ name: 'Steve', height: 2 })) // false
console.log(equalityCheck({ name: 'Steve', height: 2 })) // true
```

## `shallowObjectArrayEqualityCheck` and `nullableShallowObjectArrayEqualityCheck`

Does a shallow object equality check for each element in an array.

There is also a variant that supports "nullable values" (`undefined` and `null`).

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowObjectArrayEqualityCheck()

equalityCheck([{ name: 'Alex' }, { name: 'Steve' }])

console.log(equalityCheck([{ name: 'Alex' }, { name: 'Steve' }])) // true
console.log(equalityCheck([{ name: 'Alex' }])) // false
console.log(equalityCheck([{ name: 'Alex' }])) // true
console.log(equalityCheck([{ name: 'Steve' }])) // false
```

## `shallowArrayEqualityCheck` and `nullableShallowArrayEqualityCheck`

Shallow equality check of primitives in an array.

There is also a variant that supports "nullable values" (`undefined` and `null`).

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowArrayEqualityCheck()

equalityCheck([0, 1, 2])

console.log(equalityCheck([0, 1, 2])) // true
console.log(equalityCheck([0, 1, 2, 3])) // false
console.log(equalityCheck([0, 1, 2, 3])) // true
console.log(equalityCheck([0, 1, 3])) // false
console.log(equalityCheck([0, 1, 3])) // true
```

## `defaultEqualityCheck`

- The default equality check that assumes data can be mutated.
- It is used internally by default, so there is no need to provide it.

```tsx twoslash
//@esModuleInterop
import { defaultEqualityCheck } from '@react-facet/core'

const equalityCheck = defaultEqualityCheck()

equalityCheck(0)

console.log(equalityCheck(0)) // true
console.log(equalityCheck(1)) // false
console.log(equalityCheck(1)) // true
```

## `createUniformObjectEqualityCheck`

Creates an equality check that tests that the values of all the properties in an object
haven't changed.

The comparison used for the value of the properties is passed to it as an argument.

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = createUniformObjectEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck({
  a: [1, 2],
  b: [3],
})

console.log(
  equalityCheck({
    a: [1, 2],
    b: [3],
  }),
) // true
console.log(
  equalityCheck({
    a: [1, 5],
    b: [3],
  }),
) // false
console.log(
  equalityCheck({
    a: [1, 5],
    b: [3],
  }),
) // true
```

## `createUniformArrayEqualityCheck`

Creates an equality check that tests that the items in an array haven't changed.

The comparison used for the individual items is passed to it as an argument.

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck([[1, 2], [3]])

console.log(equalityCheck([[1, 2], [3]])) // true
console.log(
  equalityCheck([
    [1, 2],
    [3, 1],
  ]),
) // false
console.log(
  equalityCheck([
    [1, 2],
    [3, 1],
  ]),
) // true
```

## `createObjectWithKeySpecificEqualityCheck`

Creates an equality check that tests whether each property of the target object has changed.
Each property is tested with a different comparator, so that they can be of different types.

The comparator are passed down to it as an object with the same keys as the target object, but
comparators for each property as values.

```tsx twoslash
//@esModuleInterop
import {
  createObjectWithKeySpecificEqualityCheck,
  shallowArrayEqualityCheck,
  strictEqualityCheck,
} from '@react-facet/core'

const equalityCheck = createObjectWithKeySpecificEqualityCheck({
  name: strictEqualityCheck,
  items: shallowArrayEqualityCheck,
})()

equalityCheck({
  name: 'Steve',
  items: [1, 54, 97],
})

console.log(
  equalityCheck({
    name: 'Steve',
    items: [1, 54, 97],
  }),
) // true

console.log(
  equalityCheck({
    name: 'Alex',
    items: [1, 54, 97],
  }),
) // false

console.log(
  equalityCheck({
    name: 'Alex',
    items: [1, 54, 97],
  }),
) // true
```

## `createOptionalValueEqualityCheck`

Creates an equality check that tests whether the value changed from null to defined or stayed the same

If the value was not null before and it is not null currently, the comparison is done by the equality check
provided as an argument to this creator.

This creator is useful to be able to make equality checkers for optional properties when you already have
an equality check for the underlying type.

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck([1, 2, 3])

console.log(equalityCheck([1, 2, 3])) // true

console.log(equalityCheck(null)) // false

console.log(equalityCheck(null)) // true
```

## Creating Custom Equality Checks

You can create your own custom equality checks to handle specific data structures or comparison logic. An equality check follows the `EqualityCheck<T>` interface:

```typescript
interface EqualityCheck<T> {
  (): (current: T) => boolean
}
```

### How Equality Checks Work

Equality checks use a **two-function closure pattern**:

1. **Initializer function** `() =>` - Called once to set up the checker and initialize state
2. **Checker function** `(current: T) =>` - Called each time a value needs to be checked, maintains state across calls

The checker function compares the current value with the previous value stored in the closure and returns `true` if they're equal.

### Basic Custom Equality Check Example

Here's a simple example of a custom equality check for case-insensitive string comparison:

```tsx twoslash
//@esModuleInterop
import { EqualityCheck, Option, NO_VALUE } from '@react-facet/core'

// Simple equality check without parameters
export const caseInsensitiveStringCheck: EqualityCheck<string> = () => {
  let previous: Option<string> = NO_VALUE

  return (current: string) => {
    const currentLower = current.toLowerCase()
    const previousLower = previous === NO_VALUE ? NO_VALUE : previous.toLowerCase()

    if (previousLower !== currentLower) {
      previous = current
      return false
    }

    return true
  }
}

// Usage example
const equalityCheck = caseInsensitiveStringCheck()

console.log(equalityCheck('Hello')) // false (first call)
console.log(equalityCheck('HELLO')) // true (case insensitive match)
console.log(equalityCheck('hello')) // true (still matches)
console.log(equalityCheck('World')) // false (different value)
```

### Advanced Custom Equality Check Examples

#### Parameterized Equality Check

For more flexibility, you can add an outer function to accept parameters:

```tsx twoslash
//@esModuleInterop
import { EqualityCheck } from '@react-facet/core'

// Custom equality check that treats numbers within a tolerance as equal
export const tolerantNumberEqualityCheck = (tolerance: number = 0.01): EqualityCheck<number> => {
  return () => {
    let previousValue: number | undefined

    return (currentValue: number) => {
      if (previousValue === undefined) {
        previousValue = currentValue
        return false
      }

      const isEqual = Math.abs(currentValue - previousValue) < tolerance
      previousValue = currentValue
      return isEqual
    }
  }
}

// Usage example
const equalityCheck = tolerantNumberEqualityCheck(0.5)()

console.log(equalityCheck(1.0)) // false (first call)
console.log(equalityCheck(1.4)) // true (within 0.5 tolerance)
console.log(equalityCheck(2.0)) // false (outside tolerance)
```

#### Deep Object Equality Check

For comparing objects with nested structures:

```tsx twoslash
//@esModuleInterop
import { EqualityCheck } from '@react-facet/core'

type DeepObject = Record<string, unknown>

export const deepObjectEqualityCheck: EqualityCheck<DeepObject> = () => {
  let previousValue: DeepObject | undefined

  return (currentValue: DeepObject) => {
    if (previousValue === undefined) {
      previousValue = currentValue
      return false
    }

    // Simple deep equality check (consider using a library like lodash for production)
    const isEqual = JSON.stringify(previousValue) === JSON.stringify(currentValue)
    previousValue = currentValue
    return isEqual
  }
}
```

#### Custom Array Equality Check

For arrays where you care about specific comparison logic:

```tsx twoslash
//@esModuleInterop
import { EqualityCheck } from '@react-facet/core'

type Item = { id: string; value: number }

// Check if arrays have same items by ID, ignoring order
export const arrayByIdEqualityCheck: EqualityCheck<Item[]> = () => {
  let previousIds: Set<string> | undefined

  return (currentValue: Item[]) => {
    const currentIds = new Set(currentValue.map((item) => item.id))

    if (previousIds === undefined) {
      previousIds = currentIds
      return false
    }

    // Check if sets are equal
    if (previousIds.size !== currentIds.size) {
      previousIds = currentIds
      return false
    }

    for (const id of currentIds) {
      if (!previousIds.has(id)) {
        previousIds = currentIds
        return false
      }
    }

    previousIds = currentIds
    return true
  }
}
```

### Using Custom Equality Checks with Facets

Custom equality checks can be used with any facet hook that accepts an equality check parameter.

:::info Important
The equality check type must match the **return type** of the mapping function, not the input facet type. The equality check receives the value **returned** by the mapping function and compares it with the previous returned value.
:::

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetState, EqualityCheck } from '@react-facet/core'

// Custom equality check
const tolerantNumberEqualityCheck = (tolerance: number = 0.01): EqualityCheck<number> => {
  return () => {
    let previousValue: number | undefined
    return (currentValue: number) => {
      if (previousValue === undefined) {
        previousValue = currentValue
        return false
      }
      const isEqual = Math.abs(currentValue - previousValue) < tolerance
      previousValue = currentValue
      return isEqual
    }
  }
}

const TemperatureMonitor = () => {
  const [tempFacet] = useFacetState(20.0)

  const roundedTemp = useFacetMap(
    (temp) => Math.round(temp * 10) / 10, // Returns a number which is passed into the equality checker
    [],
    [tempFacet],
    tolerantNumberEqualityCheck(0.5),
  )

  return (
    <div>
      <fast-text text={useFacetMap((t) => `${t}°C`, [], [roundedTemp])} />
    </div>
  )
}
```

### Best Practices for Custom Equality Checks

1. **Always store the previous value** - The pattern requires maintaining state across calls
2. **Return `false` on first call** - The first comparison should indicate a change
3. **Update previous value after comparison** - Always update the stored value, even when values are equal
4. **Consider performance** - Complex comparisons run frequently; keep them efficient
5. **Avoid side effects** - Equality checks should be pure functions
6. **Handle edge cases** - Consider `undefined`, `null`, and empty values
