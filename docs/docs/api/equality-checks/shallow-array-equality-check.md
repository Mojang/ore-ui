---
sidebar_position: 4
---

# shallowArrayEqualityCheck

Shallow equality check for arrays of primitive values. Compares array length and each element's value rather than array reference.

## When to Use

Use when deriving arrays of primitives (strings, numbers, booleans):

- ✅ Arrays of primitives (strings, numbers, booleans)
- ✅ Filtering or transforming primitive arrays
- ❌ Arrays of objects (use [`shallowObjectArrayEqualityCheck`](./shallow-object-array-equality-check))
- ❌ Arrays of arrays (use [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check))

## Signature

```typescript
function shallowArrayEqualityCheck(): (current: Immutable[]) => boolean

type Immutable = string | number | boolean | null | undefined | Function
```

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowArrayEqualityCheck()

equalityCheck([0, 1, 2])

console.log(equalityCheck([0, 1, 2])) // true - same values
console.log(equalityCheck([0, 1, 2, 3])) // false - different length
console.log(equalityCheck([0, 1, 2, 3])) // true - same values again
console.log(equalityCheck([0, 1, 3])) // false - different value at index 2
console.log(equalityCheck([0, 1, 3])) // true
```

## Usage with Facets

### Filtering Arrays

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowArrayEqualityCheck } from '@react-facet/core'

const PlayerList = () => {
  const playerIdsFacet = useFacetWrap([1, 2, 3, 4, 5])
  const activeIdsFacet = useFacetWrap([2, 4])

  const activePlayersFacet = useFacetMap(
    (allIds, activeIds) => allIds.filter((id) => activeIds.includes(id)),
    [],
    [playerIdsFacet, activeIdsFacet],
    shallowArrayEqualityCheck, // Prevents updates when filtered array hasn't changed
  )

  return <div>Active players</div>
}
```

### Transforming Arrays

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowArrayEqualityCheck } from '@react-facet/core'

const TagDisplay = () => {
  const tagsFacet = useFacetWrap(['minecraft', 'game', 'sandbox'])

  const uppercaseTagsFacet = useFacetMap(
    (tags) => tags.map((tag) => tag.toUpperCase()),
    [],
    [tagsFacet],
    shallowArrayEqualityCheck,
  )

  return <div>Tags</div>
}
```

### Deriving Array from Multiple Facets

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowArrayEqualityCheck } from '@react-facet/core'

const Scoreboard = () => {
  const player1ScoreFacet = useFacetWrap(100)
  const player2ScoreFacet = useFacetWrap(150)
  const player3ScoreFacet = useFacetWrap(75)

  const scoresFacet = useFacetMap(
    (p1, p2, p3) => [p1, p2, p3],
    [],
    [player1ScoreFacet, player2ScoreFacet, player3ScoreFacet],
    shallowArrayEqualityCheck,
  )

  return <div>Scores</div>
}
```

## Nullable Variant

For cases where **the entire array** might be `null` or `undefined`, use `nullableShallowArrayEqualityCheck`:

```tsx twoslash
//@esModuleInterop
import { nullableShallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = nullableShallowArrayEqualityCheck()

equalityCheck(null)
console.log(equalityCheck(null)) // true - null === null ✅

console.log(equalityCheck([1, 2, 3])) // false - null → array ❌

console.log(equalityCheck([1, 2, 3])) // true - same array values ✅

console.log(equalityCheck(undefined)) // false - array → undefined ❌
```

:::tip
For arrays with nullable **elements** (like `(string | null)[]`), you don't need the nullable variant. Regular `shallowArrayEqualityCheck` handles `null`/`undefined` elements just fine using strict equality (`===`).
:::

## How It Works

The equality check:

1. Compares array lengths
2. Iterates through each element
3. Compares primitive values using `===`
4. Returns `false` if any element differs

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

const check = shallowArrayEqualityCheck()

check([1, 2, 3])

// Different array reference, but same values
console.log(check([1, 2, 3])) // true ✅

// Different values
console.log(check([1, 2, 4])) // false ❌

// Different length
console.log(check([1, 2])) // false ❌
```

## Important Notes

### Only Shallow Comparison

This check **does not** perform deep comparison for nested arrays or objects:

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

// ❌ Won't work as expected for nested structures
const check = shallowArrayEqualityCheck()

const nested1 = [{ name: 'Steve' }]
const nested2 = [{ name: 'Steve' }] // Different object references

// @ts-expect-error - Type error: array contains objects, not primitives
check(nested1)
// @ts-expect-error - Type error: array contains objects, not primitives
console.log(check(nested2)) // false - object references differ
```

**Note:** TypeScript will catch this mistake - the equality check expects arrays of primitives (`string | number | boolean | null | undefined`).

For arrays of objects, use:

- [`shallowObjectArrayEqualityCheck`](./shallow-object-array-equality-check) for objects with primitive values
- [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check) for nested arrays

### Order Matters

Unlike objects, array element order is significant:

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

const check = shallowArrayEqualityCheck()

check([1, 2, 3])

// Same values, different order - NOT equal
console.log(check([3, 2, 1])) // false ❌
```

### Empty Arrays

Empty arrays are considered equal:

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

const check = shallowArrayEqualityCheck()

check([])

console.log(check([])) // true ✅
```

## Common Patterns

### Filter and Sort

```tsx
import { useFacetMap, shallowArrayEqualityCheck } from '@react-facet/core'

const sortedActiveIdsFacet = useFacetMap(
  (ids, activeFlag) => ids.filter((id) => activeFlag[id]).sort((a, b) => a - b),
  [],
  [idsFacet, activeFlagsFacet],
  shallowArrayEqualityCheck,
)
```

### Extract Property Values

```tsx
import { useFacetMap, shallowArrayEqualityCheck } from '@react-facet/core'

const playerNamesFacet = useFacetMap(
  (players) => players.map((p) => p.name),
  [],
  [playersFacet],
  shallowArrayEqualityCheck,
)
```

### Range Generation

```tsx
import { useFacetMap, shallowArrayEqualityCheck } from '@react-facet/core'

const pageNumbersFacet = useFacetMap(
  (totalPages) => Array.from({ length: totalPages }, (_, i) => i + 1),
  [],
  [totalPagesFacet],
  shallowArrayEqualityCheck,
)
```

### Combining Multiple Arrays

```tsx
import { useFacetMap, shallowArrayEqualityCheck } from '@react-facet/core'

const allTagsFacet = useFacetMap(
  (userTags, systemTags) => [...userTags, ...systemTags],
  [],
  [userTagsFacet, systemTagsFacet],
  shallowArrayEqualityCheck,
)
```

## Performance Considerations

The equality check iterates through all array elements, so performance is O(n) where n is the array length.

**For large arrays:**

- Consider if you really need the equality check
- Profile before optimizing
- For very large arrays (1000+ elements), consider custom equality checks that sample elements

**Good performance:**

```tsx
// ✅ Small to medium arrays (< 100 elements)
const tagsFacet = useFacetMap((data) => data.tags, [], [dataFacet], shallowArrayEqualityCheck)
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`strictEqualityCheck`](./strict-equality-check) - For single primitive values
- [`shallowObjectArrayEqualityCheck`](./shallow-object-array-equality-check) - For arrays of objects
- [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check) - For nested arrays
