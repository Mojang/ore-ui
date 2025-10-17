---
sidebar_position: 7
---

# createUniformArrayEqualityCheck

Creates an equality check for arrays where all elements have the same type. The array elements are compared using a provided equality check.

## When to Use

Use when deriving arrays where all elements share the same complex type:

- ✅ Arrays of arrays (nested arrays)
- ✅ Arrays of objects with the same structure
- ✅ Multi-dimensional arrays
- ❌ Arrays of primitives (use [`shallowArrayEqualityCheck`](./shallow-array-equality-check))
- ❌ Arrays with mixed element types

## Signature

```typescript
function createUniformArrayEqualityCheck<T>(elementEqualityCheck: EqualityCheck<T>): EqualityCheck<T[]>
```

**Parameters:**

- `elementEqualityCheck` - Equality check to use for comparing each array element

**Returns:** An equality check that compares all array elements using the provided element equality check.

:::warning Maintain Stable References in Components
When using `createUniformArrayEqualityCheck` with `useFacetMap` or `useFacetMemo`, **you must create a stable reference** to the equality check. Creating it inline on every render causes the facet to be recreated and internal state to be lost.

```tsx
// ❌ WRONG - Creates new equality check on every render
const Component = () => {
  const result = useFacetMap(
    (data) => transform(data),
    [],
    [dataFacet],
    createUniformArrayEqualityCheck(shallowArrayEqualityCheck), // New reference every render!
  )
}

// ✅ CORRECT - Define outside component
const dataEqualityCheck = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)

const Component = () => {
  const result = useFacetMap((data) => transform(data), [], [dataFacet], dataEqualityCheck)
}

// ✅ ALSO CORRECT - Use useMemo
const Component = () => {
  const equalityCheck = useMemo(() => createUniformArrayEqualityCheck(shallowArrayEqualityCheck), [])
  const result = useFacetMap((data) => transform(data), [], [dataFacet], equalityCheck)
}
```

See [Custom Equality Checks](./custom-equality-checks#critical-always-maintain-stable-references) for more details.
:::

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

// Create equality check for arrays of arrays (2D array)
const equalityCheck = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck([[1, 2], [3]])

console.log(equalityCheck([[1, 2], [3]])) // true - same nested array values

console.log(
  equalityCheck([
    [1, 2],
    [3, 1],
  ]),
) // false - second array changed

console.log(
  equalityCheck([
    [1, 2],
    [3, 1],
  ]),
) // true - same values again
```

## Usage with Facets

### Matrix/Grid Data

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createUniformArrayEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

const Grid = () => {
  const gridFacet = useFacetWrap([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ])

  // Transform each row
  const transformedGridFacet = useFacetMap(
    (grid) => grid.map((row) => row.map((cell) => cell * 2)),
    [],
    [gridFacet],
    createUniformArrayEqualityCheck(shallowArrayEqualityCheck),
  )

  return <div>Grid</div>
}
```

### Grouped List Items

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createUniformArrayEqualityCheck,
  shallowObjectArrayEqualityCheck,
} from '@react-facet/core'

type Item = { id: number; name: string; group: string }

const GroupedItems = () => {
  const itemsFacet = useFacetWrap<Item[]>([
    { id: 1, name: 'Sword', group: 'A' },
    { id: 2, name: 'Shield', group: 'A' },
    { id: 3, name: 'Pickaxe', group: 'B' },
  ])

  // Group items into array of arrays by group
  const groupedItemsFacet = useFacetMap(
    (items) => {
      const groupA: Item[] = []
      const groupB: Item[] = []

      items.forEach((item) => {
        if (item.group === 'A') groupA.push(item)
        else if (item.group === 'B') groupB.push(item)
      })

      return [groupA, groupB]
    },
    [],
    [itemsFacet],
    createUniformArrayEqualityCheck(shallowObjectArrayEqualityCheck),
  )

  return <div>Grouped items</div>
}
```

### Time Series Data

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createUniformArrayEqualityCheck,
  shallowObjectEqualityCheck,
} from '@react-facet/core'

type DataPoint = { timestamp: number; value: number }

const TimeSeriesChart = () => {
  const rawDataFacet = useFacetWrap<DataPoint[]>([
    { timestamp: 1000, value: 10 },
    { timestamp: 2000, value: 20 },
    { timestamp: 3000, value: 15 },
  ])

  // Chunk data into time windows
  const chunkedDataFacet = useFacetMap(
    (data) => {
      const chunkSize = 2
      const chunks: DataPoint[][] = []
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize))
      }
      return chunks
    },
    [],
    [rawDataFacet],
    createUniformArrayEqualityCheck(createUniformArrayEqualityCheck(shallowObjectEqualityCheck)),
  )

  return <div>Time series</div>
}
```

## How It Works

The equality check:

1. Compares array lengths
2. For each element, uses the provided element equality check
3. Returns `false` if any element comparison fails

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, strictEqualityCheck } from '@react-facet/core'

// Using strictEqualityCheck for simple demo
const check = createUniformArrayEqualityCheck(strictEqualityCheck)()

check([1, 2, 3])

// Same values
console.log(check([1, 2, 3])) // true ✅

// One value changed
console.log(check([1, 5, 3])) // false ❌

// Different length
console.log(check([1, 2])) // false ❌
```

## Nesting Equality Checks

You can nest `createUniformArrayEqualityCheck` for multi-dimensional arrays:

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

// 3D array: array of arrays of arrays
const inner = shallowArrayEqualityCheck // number[]
const middle = createUniformArrayEqualityCheck(inner) // number[][]
const outer = createUniformArrayEqualityCheck(middle)() // number[][][]

outer([
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
])

console.log(
  outer([
    [
      [1, 2],
      [3, 4],
    ],
    [
      [5, 6],
      [7, 8],
    ],
  ]),
) // true ✅
```

## Important Notes

### All Elements Must Have Same Type

This check assumes all elements can be compared with the same equality check:

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

// ❌ Won't work correctly - mixed types
type MixedArray = (number[] | string)[] // Some elements are arrays, some are strings

// This will fail or give incorrect results
const check = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)()
```

### Order Matters

Array element order is significant:

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const check = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)()

check([
  [1, 2],
  [3, 4],
])

// Same arrays, different order - NOT equal
console.log(
  check([
    [3, 4],
    [1, 2],
  ]),
) // false ❌
```

### Empty Arrays

Empty arrays are considered equal:

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const check = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)()

check([])

console.log(check([])) // true ✅
```

## Common Patterns

### Calendar Grid (Weeks)

```tsx
import { useFacetMap, createUniformArrayEqualityCheck, shallowObjectArrayEqualityCheck } from '@react-facet/core'

type DayData = { date: number; events: number }

const weeksFacet = useFacetMap(
  (days) => {
    const weeks: DayData[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }
    return weeks
  },
  [],
  [daysFacet],
  createUniformArrayEqualityCheck(shallowObjectArrayEqualityCheck),
)
```

### Nested Filters

```tsx
import { useFacetMap, createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const filteredGroupsFacet = useFacetMap(
  (groups, threshold) => groups.map((group) => group.filter((value) => value > threshold)),
  [],
  [groupsFacet, thresholdFacet],
  createUniformArrayEqualityCheck(shallowArrayEqualityCheck),
)
```

## Performance Considerations

This check is O(n × m) where:

- n = outer array length
- m = complexity of element equality check

**For deeply nested arrays:**

- Consider the total number of comparisons
- Profile before adding complex nested checks
- For very large nested structures, consider alternative data structures

**Good performance:**

```tsx
// ✅ Reasonable nesting (< 100 elements per level)
const gridFacet = useFacetMap(
  (data) => data.map((row) => row.map((cell) => cell * 2)),
  [],
  [dataFacet],
  createUniformArrayEqualityCheck(shallowArrayEqualityCheck),
)
```

**Potential performance issues:**

```tsx
// ⚠️ Deep nesting with many elements
const deepCheck = createUniformArrayEqualityCheck(
  createUniformArrayEqualityCheck(createUniformArrayEqualityCheck(shallowArrayEqualityCheck)),
)()
// Consider if you really need this level of checking
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check) - For objects with uniform property types
- [`shallowArrayEqualityCheck`](./shallow-array-equality-check) - For arrays of primitives
- [`shallowObjectArrayEqualityCheck`](./shallow-object-array-equality-check) - For arrays of objects with primitives
