---
sidebar_position: 10
---

# Custom Equality Checks

You can create your own custom equality checks to handle specific data structures or comparison logic beyond what the built-in checks provide.

## The EqualityCheck Interface

An equality check follows the `EqualityCheck<T>` interface:

```typescript
interface EqualityCheck<T> {
  (): (current: T) => boolean
}
```

## How Equality Checks Work

Equality checks use a **two-function closure pattern**:

1. **Initializer function** `() =>` - Called once to set up the checker and initialize state
2. **Checker function** `(current: T) =>` - Called each time a value needs to be checked, maintains state across calls

The checker function compares the current value with the previous value stored in the closure and returns:

- `true` - Values are equal, **skip facet update**
- `false` - Values differ, **trigger facet update**

**First call behavior**: Always returns `false` (no previous value to compare).

:::warning Critical: Always Maintain Stable References
When using custom equality checks with `useFacetMap` or `useFacetMemo`, you **must maintain a stable reference** to the equality check function. If the equality check reference changes on every render, the facet gets recreated and **all internal state is lost**.

**Two approaches to maintain stable references:**

**1. Define outside the component** (preferred for static configurations):

```tsx
// ✅ CORRECT - Defined outside component, stable across all renders
const temperatureCheck = tolerantNumberEqualityCheck(0.5)

const Component = () => {
  const result = useFacetMap((temp) => temp * 2, [], [tempFacet], temperatureCheck)
}
```

**2. Use `useMemo` inside the component** (for dynamic configurations):

```tsx
const Component = ({ tolerance }: { tolerance: number }) => {
  // ✅ CORRECT - Memoized, stable reference unless tolerance changes
  const equalityCheck = useMemo(() => tolerantNumberEqualityCheck(tolerance), [tolerance])
  const result = useFacetMap((temp) => temp * 2, [], [tempFacet], equalityCheck)
}
```

**Common mistake:**

```tsx
const Component = () => {
  // ❌ WRONG - Creates new reference every render, loses state!
  const result = useFacetMap(
    (temp) => temp * 2,
    [],
    [tempFacet],
    tolerantNumberEqualityCheck(0.5), // New function reference on every render
  )
}
```

:::

## Basic Custom Equality Check

Here's a simple example for case-insensitive string comparison:

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

## Advanced Custom Equality Checks

### Parameterized Equality Check

Add an outer function to accept configuration parameters:

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

### Deep Object Equality Check

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

:::warning Performance Note
Using `JSON.stringify` for deep equality is convenient but can be slow for large objects. Consider using a dedicated deep-equality library like `lodash.isEqual` for production code.
:::

### Custom Array Equality Check

Check arrays by specific criteria (e.g., by ID, ignoring order):

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

### Date Comparison

Compare dates by day, ignoring time:

```tsx twoslash
//@esModuleInterop
import { EqualityCheck } from '@react-facet/core'

export const sameDayEqualityCheck: EqualityCheck<Date> = () => {
  let previousDay: string | undefined

  return (currentValue: Date) => {
    const currentDay = currentValue.toDateString()

    if (previousDay === undefined) {
      previousDay = currentDay
      return false
    }

    const isEqual = previousDay === currentDay
    previousDay = currentDay
    return isEqual
  }
}

// Usage
const check = sameDayEqualityCheck()

console.log(check(new Date('2025-10-16T10:00:00'))) // false (first call)
console.log(check(new Date('2025-10-16T14:30:00'))) // true (same day)
console.log(check(new Date('2025-10-17T10:00:00'))) // false (different day)
```

### Partial Object Comparison

Compare only specific fields of an object:

```tsx twoslash
//@esModuleInterop
import { EqualityCheck } from '@react-facet/core'

type User = {
  id: number
  name: string
  lastLogin: Date
  preferences: object
}

// Only compare id and name, ignore other fields
export const userIdentityEqualityCheck: EqualityCheck<User> = () => {
  let previousId: number | undefined
  let previousName: string | undefined

  return (currentValue: User) => {
    if (previousId === undefined) {
      previousId = currentValue.id
      previousName = currentValue.name
      return false
    }

    const isEqual = previousId === currentValue.id && previousName === currentValue.name

    previousId = currentValue.id
    previousName = currentValue.name

    return isEqual
  }
}
```

## Using Custom Equality Checks with Facets

Custom equality checks work with any facet hook that accepts an equality check parameter:

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useMemo } from 'react'
import { useFacetMap, useFacetWrap, EqualityCheck } from '@react-facet/core'

// Custom equality check factory
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
  const tempFacet = useFacetWrap(20.0)

  // ✅ Memoize the equality check to maintain stable reference
  const equalityCheck = useMemo(() => tolerantNumberEqualityCheck(0.5), [])

  const roundedTemp = useFacetMap(
    (temp) => Math.round(temp * 10) / 10, // Returns a number which is passed into the equality checker
    [],
    [tempFacet],
    equalityCheck,
  )

  return (
    <div>
      <fast-text text={useFacetMap((t) => `${t}°C`, [], [roundedTemp])} />
    </div>
  )
}
```

:::info Important
The equality check type must match the **return type** of the mapping function, not the input facet type. The equality check receives the value **returned** by the mapping function and compares it with the previous returned value.
:::

## Best Practices

### 1. Always Store the Previous Value

The pattern requires maintaining state across calls:

```tsx
// ✅ Good - stores previous value
export const myCheck: EqualityCheck<T> = () => {
  let previous: T | undefined

  return (current: T) => {
    if (previous === undefined) {
      previous = current
      return false
    }
    const isEqual = /* comparison logic */ (previous = current) // Update stored value
    return isEqual
  }
}
```

### 2. Return `false` on First Call

The first comparison should always indicate a change:

```tsx
return (current: T) => {
  if (previous === undefined) {
    previous = current
    return false // ✅ First call always returns false
  }
  // ... rest of logic
}
```

### 3. Update Previous Value After Comparison

Always update the stored value, even when values are equal:

```tsx
return (current: T) => {
  // ... comparison logic
  const isEqual = /* check if equal */ (previous = current) // ✅ Always update, regardless of result
  return isEqual
}
```

### 4. Consider Performance

Complex comparisons run frequently; keep them efficient:

```tsx
// ❌ Avoid expensive operations
export const slowCheck: EqualityCheck<bigData> = () => {
  let previous: bigData | undefined
  return (current: bigData) => {
    // Avoid deep cloning or expensive serialization in hot path
    const isEqual = JSON.parse(JSON.stringify(previous)) === JSON.parse(JSON.stringify(current))
    // ...
  }
}

// ✅ Optimize for common case
export const fastCheck: EqualityCheck<bigData> = () => {
  let previousHash: string | undefined
  return (current: bigData) => {
    const currentHash = cheapHash(current) // Fast hash function
    const isEqual = previousHash === currentHash
    previousHash = currentHash
    return isEqual
  }
}
```

### 5. Avoid Side Effects

Equality checks should be pure functions:

```tsx
// ❌ Avoid side effects
export const badCheck: EqualityCheck<T> = () => {
  return (current: T) => {
    console.log('Checking value:', current) // ❌ Side effect
    updateGlobalState(current) // ❌ Side effect
    // ...
  }
}

// ✅ Pure function
export const goodCheck: EqualityCheck<T> = () => {
  let previous: T | undefined
  return (current: T) => {
    // Only comparison logic, no side effects
    const isEqual = /* ... */ (previous = current)
    return isEqual
  }
}
```

### 6. Handle Edge Cases

Consider `undefined`, `null`, and empty values:

```tsx
export const robustCheck: EqualityCheck<T | null> = () => {
  let previous: T | null | undefined

  return (current: T | null) => {
    if (previous === undefined) {
      previous = current
      return false
    }

    // Handle null values explicitly
    if (previous === null && current === null) {
      return true
    }

    if (previous === null || current === null) {
      previous = current
      return false
    }

    // Normal comparison
    const isEqual = /* compare non-null values */ (previous = current)
    return isEqual
  }
}
```

### 7. Use TypeScript for Type Safety

Leverage TypeScript to ensure type correctness:

```tsx
// ✅ Generic with constraints
export const createComparableCheck = <T extends { compare(other: T): boolean }>(): EqualityCheck<T> => {
  return () => {
    let previous: T | undefined

    return (current: T) => {
      if (previous === undefined) {
        previous = current
        return false
      }

      const isEqual = current.compare(previous)
      previous = current
      return isEqual
    }
  }
}
```

## Testing Custom Equality Checks

Always test your custom equality checks thoroughly:

```tsx
import { describe, it, expect } from '@jest/globals'

describe('caseInsensitiveStringCheck', () => {
  it('returns false on first call', () => {
    const check = caseInsensitiveStringCheck()
    expect(check('Hello')).toBe(false)
  })

  it('returns true for same case-insensitive value', () => {
    const check = caseInsensitiveStringCheck()
    check('Hello')
    expect(check('HELLO')).toBe(true)
    expect(check('hello')).toBe(true)
  })

  it('returns false for different values', () => {
    const check = caseInsensitiveStringCheck()
    check('Hello')
    expect(check('World')).toBe(false)
  })
})
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check) - For objects with uniform types
- [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check) - For objects with mixed types
- [`createOptionalValueEqualityCheck`](./create-optional-value-equality-check) - Wrap checks for nullable values
