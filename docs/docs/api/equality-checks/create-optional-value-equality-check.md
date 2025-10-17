---
sidebar_position: 9
---

# createOptionalValueEqualityCheck

Creates an equality check that handles optional/nullable values by wrapping an existing equality check. Useful for values that may be `null` or `undefined`.

## When to Use

Use when you have an equality check for a type but need to handle nullable variants:

- ✅ Wrapping any equality check to handle `null` or `undefined`
- ✅ Optional properties that may not always be present
- ✅ Values that transition between defined and undefined states
- ❌ Simple primitives (use nullable variants like `nullableShallowArrayEqualityCheck`)

## Signature

```typescript
function createOptionalValueEqualityCheck<T>(valueEqualityCheck: EqualityCheck<T>): EqualityCheck<T | null | undefined>
```

**Parameters:**

- `valueEqualityCheck` - Equality check for the non-null type

**Returns:** An equality check that handles `null` and `undefined`, delegating to the provided check for defined values.

:::warning Maintain Stable References in Components
When using `createOptionalValueEqualityCheck` with `useFacetMap` or `useFacetMemo`, **you must create a stable reference** to the equality check. Creating it inline on every render causes the facet to be recreated and internal state to be lost.

```tsx
// ❌ WRONG - Creates new equality check on every render
const Component = () => {
  const result = useFacetMap(
    (data) => transform(data),
    [],
    [dataFacet],
    createOptionalValueEqualityCheck(shallowArrayEqualityCheck), // New reference every render!
  )
}

// ✅ CORRECT - Define outside component
const optionalArrayCheck = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)

const Component = () => {
  const result = useFacetMap((data) => transform(data), [], [dataFacet], optionalArrayCheck)
}

// ✅ ALSO CORRECT - Use useMemo
const Component = () => {
  const equalityCheck = useMemo(() => createOptionalValueEqualityCheck(shallowArrayEqualityCheck), [])
  const result = useFacetMap((data) => transform(data), [], [dataFacet], equalityCheck)
}
```

See [Custom Equality Checks](./custom-equality-checks#critical-always-maintain-stable-references) for more details.
:::

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck([1, 2, 3])

console.log(equalityCheck([1, 2, 3])) // true - same array

console.log(equalityCheck(null)) // false - changed to null

console.log(equalityCheck(null)) // true - still null

console.log(equalityCheck([4, 5])) // false - back to defined value

console.log(equalityCheck([4, 5])) // true - same array
```

## Usage with Facets

### Optional User Selection

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createOptionalValueEqualityCheck,
  shallowObjectEqualityCheck,
} from '@react-facet/core'

type User = { id: number; name: string }

const UserProfile = () => {
  const selectedUserFacet = useFacetWrap<User | null>({ id: 1, name: 'Steve' })

  const userDisplayFacet = useFacetMap(
    (user) => (user ? { displayName: user.name.toUpperCase(), userId: user.id } : null),
    [],
    [selectedUserFacet],
    createOptionalValueEqualityCheck(shallowObjectEqualityCheck),
  )

  return <div>User profile</div>
}
```

### Conditional Data Loading

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createOptionalValueEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

const DataList = () => {
  const dataFacet = useFacetWrap<number[] | null>([1, 2, 3])

  const processedDataFacet = useFacetMap(
    (data) => (data ? data.map((n) => n * 2) : null),
    [],
    [dataFacet],
    createOptionalValueEqualityCheck(shallowArrayEqualityCheck),
  )

  return <div>Data list</div>
}
```

### Form Field with Optional Value

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, createOptionalValueEqualityCheck, strictEqualityCheck } from '@react-facet/core'

const FormField = () => {
  const inputFacet = useFacetWrap<string>('')

  // Parse to number or null if invalid
  const numberValueFacet = useFacetMap(
    (input) => {
      const parsed = parseInt(input)
      return isNaN(parsed) ? null : parsed
    },
    [],
    [inputFacet],
    createOptionalValueEqualityCheck(strictEqualityCheck),
  )

  return <div>Form field</div>
}
```

## How It Works

The equality check handles three cases:

1. **Both null/undefined** - Returns `true` (considered equal)
2. **One null/undefined, one defined** - Returns `false` (different)
3. **Both defined** - Delegates to the wrapped equality check

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const check = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

check(null)

console.log(check(null)) // true - both null ✅
console.log(check(undefined)) // false - null ≠ undefined ❌
console.log(check(undefined)) // true - both undefined ✅
console.log(check([5])) // false - undefined ≠ [5] ❌
console.log(check([5])) // true - both [5] ✅
console.log(check([10])) // false - [5] ≠ [10] ❌
```

## null vs undefined

The check treats `null` and `undefined` as **different values**:

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const check = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

check(null)
console.log(check(null)) // true ✅

console.log(check(undefined)) // false - null ≠ undefined ❌

check(undefined)
console.log(check(undefined)) // true ✅
```

If you need to treat them as equivalent, create a custom equality check.

## Combining with Other Checks

### With Object Equality

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowObjectEqualityCheck } from '@react-facet/core'

type Config = { theme: string; language: string }

const check = createOptionalValueEqualityCheck(shallowObjectEqualityCheck)()

check(null)
console.log(check(null)) // true ✅

console.log(check({ theme: 'dark', language: 'en' })) // false - null → defined ❌

console.log(check({ theme: 'dark', language: 'en' })) // true - same object values ✅
```

### With Array Equality

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const check = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

check([1, 2, 3])

console.log(check([1, 2, 3])) // true ✅
console.log(check(null)) // false - defined → null ❌
console.log(check(null)) // true ✅
```

### With Nested Checks

```tsx twoslash
//@esModuleInterop
import {
  createOptionalValueEqualityCheck,
  createUniformArrayEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

// Optional 2D array
const check = createOptionalValueEqualityCheck(createUniformArrayEqualityCheck(shallowArrayEqualityCheck))()

check(null)
console.log(check(null)) // true ✅

console.log(
  check([
    [1, 2],
    [3, 4],
  ]),
) // false - null → defined ❌

console.log(
  check([
    [1, 2],
    [3, 4],
  ]),
) // true - same nested arrays ✅
```

## Important Notes

### First Call Behavior

Like all equality checks, the first call always returns `false`:

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const check = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

console.log(check([5])) // false - first call ❌
console.log(check([5])) // true - subsequent call with same value ✅
```

### Null vs Undefined Distinction

Be explicit about which you're using:

```tsx
// ✅ Explicit type
type MaybeUser = User | null // Clear: null indicates "no user selected"

// ⚠️ Mixed - can be confusing
type MaybeUser = User | null | undefined // When is it null vs undefined?
```

## Common Patterns

### Search Results

```tsx
import { useFacetMap, createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const searchResultsFacet = useFacetMap(
  (query, items) => {
    if (query.length === 0) return null // No search active
    return items.filter((item) => item.name.includes(query))
  },
  [],
  [queryFacet, itemsFacet],
  createOptionalValueEqualityCheck(shallowArrayEqualityCheck),
)
```

### Selected Item

```tsx
import { useFacetMap, createOptionalValueEqualityCheck, shallowObjectEqualityCheck } from '@react-facet/core'

const selectedItemFacet = useFacetMap(
  (items, selectedId) => {
    if (selectedId === null) return null
    return items.find((item) => item.id === selectedId) || null
  },
  [],
  [itemsFacet, selectedIdFacet],
  createOptionalValueEqualityCheck(shallowObjectEqualityCheck),
)
```

### Loaded Data

```tsx
import { useFacetMap, createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const dataFacet = useFacetMap(
  (isLoading, rawData) => {
    if (isLoading) return null // Still loading
    return rawData.map((item) => item.id)
  },
  [],
  [isLoadingFacet, rawDataFacet],
  createOptionalValueEqualityCheck(shallowArrayEqualityCheck),
)
```

## Alternative: Nullable Variants

For common types, use the built-in nullable variants instead:

```tsx
import {
  nullableShallowArrayEqualityCheck,
  nullableShallowObjectEqualityCheck,
  nullableShallowObjectArrayEqualityCheck,
} from '@react-facet/core'

// ✅ Use built-in nullable variants when available
const check1 = nullableShallowArrayEqualityCheck()

// ✅ Use createOptionalValueEqualityCheck for custom types
const check2 = createOptionalValueEqualityCheck(myCustomEqualityCheck)()
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`shallowArrayEqualityCheck`](./shallow-array-equality-check) - Array equality (has nullable variant)
- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) - Object equality (has nullable variant)
- [Custom Equality Checks](./custom-equality-checks) - Create your own equality checks
