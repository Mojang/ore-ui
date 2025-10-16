---
sidebar_position: 5
---

# shallowObjectArrayEqualityCheck

Shallow equality check for arrays of objects with primitive property values. Compares each object in the array using shallow object comparison.

## When to Use

Use when deriving arrays of objects where all properties are primitives:

- ✅ Arrays of objects with primitive values
- ✅ Mapping data to view models
- ✅ Filtering or transforming object arrays
- ❌ Arrays of objects with nested objects (use [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check))
- ❌ Arrays of primitives (use [`shallowArrayEqualityCheck`](./shallow-array-equality-check))

## Signature

```typescript
function shallowObjectArrayEqualityCheck(): (current: ObjectWithImmutables[]) => boolean

type ObjectWithImmutables = Record<string, string | number | boolean>
```

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowObjectArrayEqualityCheck()

equalityCheck([{ name: 'Alex' }, { name: 'Steve' }])

console.log(equalityCheck([{ name: 'Alex' }, { name: 'Steve' }])) // true - same values
console.log(equalityCheck([{ name: 'Alex' }])) // false - different length
console.log(equalityCheck([{ name: 'Alex' }])) // true - same values again
console.log(equalityCheck([{ name: 'Steve' }])) // false - different object values
```

## Usage with Facets

### Mapping to View Models

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowObjectArrayEqualityCheck } from '@react-facet/core'

type Player = { id: number; name: string; score: number }
type PlayerViewModel = { displayName: string; scoreText: string; isWinning: boolean }

const PlayerList = () => {
  const playersFacet = useFacetWrap<Player[]>([
    { id: 1, name: 'Steve', score: 100 },
    { id: 2, name: 'Alex', score: 150 },
  ])

  const viewModelsFacet = useFacetMap(
    (players) =>
      players.map((p) => ({
        displayName: p.name.toUpperCase(),
        scoreText: `${p.score} pts`,
        isWinning: p.score > 120,
      })),
    [],
    [playersFacet],
    shallowObjectArrayEqualityCheck, // Prevents updates when view models haven't changed
  )

  return <div>Player list</div>
}
```

### Filtering Object Arrays

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowObjectArrayEqualityCheck } from '@react-facet/core'

type Item = { id: number; name: string; active: boolean }

const ActiveItems = () => {
  const itemsFacet = useFacetWrap<Item[]>([
    { id: 1, name: 'Sword', active: true },
    { id: 2, name: 'Shield', active: false },
    { id: 3, name: 'Pickaxe', active: true },
  ])

  const activeItemsFacet = useFacetMap(
    (items) => items.filter((item) => item.active),
    [],
    [itemsFacet],
    shallowObjectArrayEqualityCheck,
  )

  return <div>Active items</div>
}
```

### Combining Data from Multiple Facets

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowObjectArrayEqualityCheck } from '@react-facet/core'

const EnrichedList = () => {
  const usersFacet = useFacetWrap([
    { id: 1, name: 'Steve' },
    { id: 2, name: 'Alex' },
  ])
  const scoresFacet = useFacetWrap<Record<number, number>>({
    1: 100,
    2: 150,
  })

  const enrichedUsersFacet = useFacetMap(
    (users, scores) =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        score: scores[user.id] || 0,
      })),
    [],
    [usersFacet, scoresFacet],
    shallowObjectArrayEqualityCheck,
  )

  return <div>Enriched user list</div>
}
```

## Nullable Variant

For cases where **the entire array** might be `null` or `undefined`, use `nullableShallowObjectArrayEqualityCheck`:

```tsx twoslash
//@esModuleInterop
import { nullableShallowObjectArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = nullableShallowObjectArrayEqualityCheck()

equalityCheck(null)
console.log(equalityCheck(null)) // true - null === null ✅

console.log(
  equalityCheck([
    { id: 1, name: 'Steve' },
    { id: 2, name: 'Alex' },
  ]),
) // false - null → array ❌

console.log(
  equalityCheck([
    { id: 1, name: 'Steve' },
    { id: 2, name: 'Alex' },
  ]),
) // true - same array values ✅

console.log(equalityCheck(undefined)) // false - array → undefined ❌
```

:::tip
For arrays with objects that have nullable **properties** (like `Array<{ name: string | null }>`), you don't need the nullable variant. Regular `shallowObjectArrayEqualityCheck` handles `null`/`undefined` property values just fine using strict equality (`===`).
:::

## How It Works

The equality check:

1. Compares array lengths
2. Iterates through each element
3. For each object, compares all property values using shallow object equality
4. Returns `false` if any property in any object differs

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'

const check = shallowObjectArrayEqualityCheck()

check([
  { id: 1, name: 'Steve' },
  { id: 2, name: 'Alex' },
])

// Different array reference, same object values
console.log(
  check([
    { id: 1, name: 'Steve' },
    { id: 2, name: 'Alex' },
  ]),
) // true ✅

// One object changed
console.log(
  check([
    { id: 1, name: 'Steve' },
    { id: 2, name: 'Alexandra' },
  ]),
) // false ❌

// Different array length
console.log(check([{ id: 1, name: 'Steve' }])) // false ❌
```

## Important Notes

### Only Shallow Object Comparison

This check performs shallow comparison for each object. Nested objects or arrays are compared by reference:

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'

// ❌ Won't work as expected for nested structures
type NestedData = {
  id: number
  metadata: { tags: string[] } // Nested object
}

const check = shallowObjectArrayEqualityCheck()

const nested1 = [{ id: 1, metadata: { tags: ['a'] } }]
const nested2 = [{ id: 1, metadata: { tags: ['a'] } }] // Different metadata reference

// @ts-expect-error - Type error: objects contain nested structures, not just primitives
check(nested1)
// @ts-expect-error - Type error: objects contain nested structures, not just primitives
console.log(check(nested2)) // false - metadata objects have different references
```

**Note:** TypeScript will catch this mistake - the equality check expects objects with only primitive properties.

For nested structures, use [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check).

### Order Matters

Array element order is significant:

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'

const check = shallowObjectArrayEqualityCheck()

check([{ id: 1 }, { id: 2 }])

// Same objects, different order - NOT equal
console.log(check([{ id: 2 }, { id: 1 }])) // false ❌
```

### Property Order Doesn't Matter

Within each object, property order is irrelevant:

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'

const check = shallowObjectArrayEqualityCheck()

check([{ name: 'Steve', age: 25 }])

// Same values, different property order - equal
console.log(check([{ age: 25, name: 'Steve' }])) // true ✅
```

## Common Patterns

### Search Results

```tsx
import { useFacetMap, shallowObjectArrayEqualityCheck } from '@react-facet/core'

const searchResultsFacet = useFacetMap(
  (items, query) =>
    items
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .map((item) => ({
        id: item.id,
        displayName: item.name,
        matchScore: calculateMatchScore(item.name, query),
      })),
  [],
  [itemsFacet, queryFacet],
  shallowObjectArrayEqualityCheck,
)
```

### Sorted Lists

```tsx
import { useFacetMap, shallowObjectArrayEqualityCheck } from '@react-facet/core'

const sortedPlayersFacet = useFacetMap(
  (players, sortBy) =>
    [...players]
      .sort((a, b) => a[sortBy] - b[sortBy])
      .map((p) => ({
        id: p.id,
        name: p.name,
        sortValue: p[sortBy],
      })),
  [],
  [playersFacet, sortByFacet],
  shallowObjectArrayEqualityCheck,
)
```

### Pagination

```tsx
import { useFacetMap, shallowObjectArrayEqualityCheck } from '@react-facet/core'

const pageItemsFacet = useFacetMap(
  (items, page, pageSize) => {
    const start = page * pageSize
    return items.slice(start, start + pageSize).map((item, index) => ({
      id: item.id,
      name: item.name,
      position: start + index + 1,
    }))
  },
  [],
  [itemsFacet, pageFacet, pageSizeFacet],
  shallowObjectArrayEqualityCheck,
)
```

## Performance Considerations

This check is O(n × m) where:

- n = array length
- m = average number of properties per object

**For large arrays with many properties:**

- Profile before adding equality check
- Consider if the check is necessary
- For very large datasets, consider pagination or virtualization

**Good performance:**

```tsx
// ✅ Reasonable size (< 100 items, < 10 properties each)
const viewModelsFacet = useFacetMap(
  (players) =>
    players.map((p) => ({
      id: p.id,
      name: p.name,
      score: p.score,
    })),
  [],
  [playersFacet],
  shallowObjectArrayEqualityCheck,
)
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) - For single objects
- [`shallowArrayEqualityCheck`](./shallow-array-equality-check) - For arrays of primitives
- [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check) - For nested arrays
