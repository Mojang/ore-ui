---
sidebar_position: 6
---

# createUniformObjectEqualityCheck

Creates an equality check for objects where all properties have the same type. The property values are compared using a provided equality check.

## When to Use

Use when deriving objects where all properties share the same type (but not primitives):

- ✅ Objects with properties of the same complex type (arrays, nested objects)
- ✅ Uniform data structures (e.g., `{ x: number[], y: number[], z: number[] }`)
- ❌ Objects with primitive values (use [`shallowObjectEqualityCheck`](./shallow-object-equality-check))
- ❌ Objects with different types per property (use [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check))

## Signature

```typescript
function createUniformObjectEqualityCheck<T>(valueEqualityCheck: EqualityCheck<T>): EqualityCheck<Record<string, T>>
```

**Parameters:**

- `valueEqualityCheck` - Equality check to use for comparing each property value

**Returns:** An equality check that compares all object properties using the provided value equality check.

:::warning Maintain Stable References in Components
When using `createUniformObjectEqualityCheck` with `useFacetMap` or `useFacetMemo`, **you must create a stable reference** to the equality check. If you create it inline on every render, the facet gets recreated and internal state is lost.

```tsx
// ❌ WRONG - Creates new equality check on every render
const Component = () => {
  const result = useFacetMap(
    (data) => transform(data),
    [],
    [dataFacet],
    createUniformObjectEqualityCheck(shallowArrayEqualityCheck), // New reference every render!
  )
}

// ✅ CORRECT - Define outside component
const dataEqualityCheck = createUniformObjectEqualityCheck(shallowArrayEqualityCheck)

const Component = () => {
  const result = useFacetMap((data) => transform(data), [], [dataFacet], dataEqualityCheck)
}

// ✅ ALSO CORRECT - Use useMemo for dynamic configuration
const Component = ({ checkType }: { checkType: string }) => {
  const equalityCheck = useMemo(
    () =>
      createUniformObjectEqualityCheck(checkType === 'array' ? shallowArrayEqualityCheck : shallowObjectEqualityCheck),
    [checkType],
  )
  const result = useFacetMap((data) => transform(data), [], [dataFacet], equalityCheck)
}
```

See [Custom Equality Checks](./custom-equality-checks#critical-always-maintain-stable-references) for more details.
:::

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

// Create equality check for objects with array properties
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
) // true - same array values

console.log(
  equalityCheck({
    a: [1, 5],
    b: [3],
  }),
) // false - array 'a' changed

console.log(
  equalityCheck({
    a: [1, 5],
    b: [3],
  }),
) // true - same values again
```

## Usage with Facets

### Vector Data Structure

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useMemo } from 'react'
import {
  useFacetMap,
  useFacetWrap,
  createUniformObjectEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

type VectorData = {
  x: number[]
  y: number[]
  z: number[]
}

const VectorChart = () => {
  const dataFacet = useFacetWrap<VectorData>({
    x: [1, 2, 3],
    y: [4, 5, 6],
    z: [7, 8, 9],
  })

  // ✅ Memoize equality check to maintain stable reference
  const equalityCheck = useMemo(() => createUniformObjectEqualityCheck(shallowArrayEqualityCheck), [])

  // All properties are number arrays
  const normalizedDataFacet = useFacetMap(
    (data) => ({
      x: data.x.map((v) => v / 10),
      y: data.y.map((v) => v / 10),
      z: data.z.map((v) => v / 10),
    }),
    [],
    [dataFacet],
    equalityCheck,
  )

  return <div>Vector chart</div>
}
```

### Multi-Language Translations

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createUniformObjectEqualityCheck,
  shallowObjectEqualityCheck,
} from '@react-facet/core'

type Translation = { title: string; description: string }
type Translations = {
  en: Translation
  es: Translation
  fr: Translation
}

const MultiLangContent = () => {
  const translationsFacet = useFacetWrap<Translations>({
    en: { title: 'Welcome', description: 'Hello there' },
    es: { title: 'Bienvenido', description: 'Hola' },
    fr: { title: 'Bienvenue', description: 'Bonjour' },
  })

  // All properties are Translation objects
  const upperCaseTranslationsFacet = useFacetMap(
    (translations) => ({
      en: { title: translations.en.title.toUpperCase(), description: translations.en.description },
      es: { title: translations.es.title.toUpperCase(), description: translations.es.description },
      fr: { title: translations.fr.title.toUpperCase(), description: translations.fr.description },
    }),
    [],
    [translationsFacet],
    createUniformObjectEqualityCheck(shallowObjectEqualityCheck),
  )

  return <div>Translations</div>
}
```

### Grouped Data

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createUniformObjectEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

type GroupedItems = {
  active: number[]
  pending: number[]
  completed: number[]
}

const ItemStats = () => {
  const itemsFacet = useFacetWrap([
    { id: 1, status: 'active' },
    { id: 2, status: 'pending' },
    { id: 3, status: 'active' },
  ])

  const groupedIdsFacet = useFacetMap(
    (items) => ({
      active: items.filter((i) => i.status === 'active').map((i) => i.id),
      pending: items.filter((i) => i.status === 'pending').map((i) => i.id),
      completed: items.filter((i) => i.status === 'completed').map((i) => i.id),
    }),
    [],
    [itemsFacet],
    createUniformObjectEqualityCheck(shallowArrayEqualityCheck),
  )

  return <div>Item stats</div>
}
```

## How It Works

The equality check:

1. Compares the number of keys in both objects
2. For each property, uses the provided value equality check
3. Returns `false` if any property comparison fails

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, strictEqualityCheck } from '@react-facet/core'

// Using strictEqualityCheck for simple demo
const check = createUniformObjectEqualityCheck(strictEqualityCheck)()

check({ a: 1, b: 2, c: 3 })

// Same values
console.log(check({ a: 1, b: 2, c: 3 })) // true ✅

// One value changed
console.log(check({ a: 1, b: 5, c: 3 })) // false ❌

// Different keys
console.log(check({ a: 1, b: 2 })) // false ❌
```

## Nesting Equality Checks

You can nest `createUniformObjectEqualityCheck` for deeply uniform structures:

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

// Objects containing objects containing arrays
type DeepUniform = {
  region1: { x: number[]; y: number[] }
  region2: { x: number[]; y: number[] }
}

const innerCheck = createUniformObjectEqualityCheck(shallowArrayEqualityCheck)
const outerCheck = createUniformObjectEqualityCheck(innerCheck)()

outerCheck({
  region1: { x: [1, 2], y: [3, 4] },
  region2: { x: [5, 6], y: [7, 8] },
})

console.log(
  outerCheck({
    region1: { x: [1, 2], y: [3, 4] },
    region2: { x: [5, 6], y: [7, 8] },
  }),
) // true ✅
```

## Important Notes

### All Properties Must Have Same Type

This check assumes all properties can be compared with the same equality check:

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

// ❌ Won't work correctly - mixed types
type MixedTypes = {
  numbers: number[] // Array
  name: string // Primitive - different type!
}

// This will fail at runtime or give incorrect results
const check = createUniformObjectEqualityCheck(shallowArrayEqualityCheck)()
```

For mixed types, use [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check).

### Property Order Doesn't Matter

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, strictEqualityCheck } from '@react-facet/core'

const check = createUniformObjectEqualityCheck(strictEqualityCheck)()

check({ a: 1, b: 2 })

// Same values, different order
console.log(check({ b: 2, a: 1 })) // true ✅
```

## Common Patterns

### Chart Data (Multiple Series)

```tsx
import { useFacetMap, createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const chartDataFacet = useFacetMap(
  (rawData) => ({
    series1: rawData.map((d) => d.value1),
    series2: rawData.map((d) => d.value2),
    series3: rawData.map((d) => d.value3),
  }),
  [],
  [rawDataFacet],
  createUniformObjectEqualityCheck(shallowArrayEqualityCheck),
)
```

### Multi-Region Configuration

```tsx
import { useFacetMap, createUniformObjectEqualityCheck, shallowObjectEqualityCheck } from '@react-facet/core'

const regionConfigsFacet = useFacetMap(
  (settings) => ({
    na: { enabled: settings.naEnabled, limit: settings.naLimit },
    eu: { enabled: settings.euEnabled, limit: settings.euLimit },
    asia: { enabled: settings.asiaEnabled, limit: settings.asiaLimit },
  }),
  [],
  [settingsFacet],
  createUniformObjectEqualityCheck(shallowObjectEqualityCheck),
)
```

### State Machine Transitions

```tsx
import { useFacetMap, createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const transitionsFacet = useFacetMap(
  (rules) => ({
    idle: rules.filter((r) => r.from === 'idle').map((r) => r.to),
    loading: rules.filter((r) => r.from === 'loading').map((r) => r.to),
    error: rules.filter((r) => r.from === 'error').map((r) => r.to),
  }),
  [],
  [rulesFacet],
  createUniformObjectEqualityCheck(shallowArrayEqualityCheck),
)
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check) - For arrays with uniform element types
- [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check) - For objects with different types per property
- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) - For objects with primitive values
