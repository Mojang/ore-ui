---
sidebar_position: 8
---

# createObjectWithKeySpecificEqualityCheck

Creates an equality check for objects where each property has a different type and needs its own specific equality check. This is the most flexible object equality check.

## When to Use

Use when deriving objects with properties of different types:

- ✅ Objects with mixed property types (strings, arrays, nested objects)
- ✅ Complex data structures with heterogeneous properties
- ✅ Type-safe equality checking for each property
- ❌ Objects with uniform property types (use [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check))
- ❌ Objects with only primitive properties (use [`shallowObjectEqualityCheck`](./shallow-object-equality-check))

## Signature

```typescript
function createObjectWithKeySpecificEqualityCheck<T extends Record<string, any>>(equalityChecks: {
  [K in keyof T]: EqualityCheck<T[K]>
}): EqualityCheck<T>
```

**Parameters:**

- `equalityChecks` - Object mapping each property key to its specific equality check

**Returns:** An equality check that compares each object property using its designated equality check.

:::warning Maintain Stable References in Components
When using `createObjectWithKeySpecificEqualityCheck` with `useFacetMap` or `useFacetMemo`, **you must create a stable reference** to the equality check. Creating it inline on every render causes the facet to be recreated and internal state to be lost.

```tsx
// ❌ WRONG - Creates new equality check on every render
const Component = () => {
  const result = useFacetMap(
    (data) => transform(data),
    [],
    [dataFacet],
    createObjectWithKeySpecificEqualityCheck({
      // New reference every render!
      name: strictEqualityCheck,
      items: shallowArrayEqualityCheck,
    }),
  )
}

// ✅ CORRECT - Define outside component
const dataEqualityCheck = createObjectWithKeySpecificEqualityCheck({
  name: strictEqualityCheck,
  items: shallowArrayEqualityCheck,
})

const Component = () => {
  const result = useFacetMap((data) => transform(data), [], [dataFacet], dataEqualityCheck)
}

// ✅ ALSO CORRECT - Use useMemo
const Component = () => {
  const equalityCheck = useMemo(
    () =>
      createObjectWithKeySpecificEqualityCheck({
        name: strictEqualityCheck,
        items: shallowArrayEqualityCheck,
      }),
    [],
  )
  const result = useFacetMap((data) => transform(data), [], [dataFacet], equalityCheck)
}
```

See [Custom Equality Checks](./custom-equality-checks#critical-always-maintain-stable-references) for more details.
:::

## Basic Usage

```tsx twoslash
//@esModuleInterop
import {
  createObjectWithKeySpecificEqualityCheck,
  shallowArrayEqualityCheck,
  strictEqualityCheck,
} from '@react-facet/core'

type PlayerData = {
  name: string
  items: number[]
}

const equalityCheck = createObjectWithKeySpecificEqualityCheck<PlayerData>({
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
) // true - both properties match

console.log(
  equalityCheck({
    name: 'Alex',
    items: [1, 54, 97],
  }),
) // false - name changed

console.log(
  equalityCheck({
    name: 'Alex',
    items: [1, 54, 97],
  }),
) // true - same values again
```

## Usage with Facets

### Complex Form State

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
  shallowObjectEqualityCheck,
} from '@react-facet/core'

type FormData = {
  username: string
  age: number
  tags: string[]
  settings: { theme: string; notifications: boolean }
}

const UserForm = () => {
  const formFacet = useFacetWrap<FormData>({
    username: 'Steve',
    age: 25,
    tags: ['minecraft', 'builder'],
    settings: { theme: 'dark', notifications: true },
  })

  const validatedFormFacet = useFacetMap(
    (form) => ({
      username: form.username.trim(),
      age: Math.max(0, form.age),
      tags: form.tags.filter((t) => t.length > 0),
      settings: form.settings,
    }),
    [],
    [formFacet],
    createObjectWithKeySpecificEqualityCheck({
      username: strictEqualityCheck,
      age: strictEqualityCheck,
      tags: shallowArrayEqualityCheck,
      settings: shallowObjectEqualityCheck,
    }),
  )

  return <div>Form</div>
}
```

### Mixed Data Structure

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
  shallowObjectArrayEqualityCheck,
} from '@react-facet/core'

type GameState = {
  currentLevel: number
  playerIds: number[]
  items: Array<{ id: number; type: string }>
}

const Game = () => {
  const stateFacet = useFacetWrap<GameState>({
    currentLevel: 1,
    playerIds: [1, 2, 3],
    items: [
      { id: 1, type: 'sword' },
      { id: 2, type: 'shield' },
    ],
  })

  const processedStateFacet = useFacetMap(
    (state) => ({
      currentLevel: state.currentLevel,
      playerIds: state.playerIds.sort(),
      items: state.items.filter((item) => item.type !== 'deprecated'),
    }),
    [],
    [stateFacet],
    createObjectWithKeySpecificEqualityCheck({
      currentLevel: strictEqualityCheck,
      playerIds: shallowArrayEqualityCheck,
      items: shallowObjectArrayEqualityCheck,
    }),
  )

  return <div>Game</div>
}
```

### API Response Transformation

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import {
  useFacetMap,
  useFacetWrap,
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowObjectEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

type APIResponse = {
  id: string
  metadata: { created: number; updated: number }
  tags: string[]
}

const DataDisplay = () => {
  const responseFacet = useFacetWrap<APIResponse>({
    id: 'abc123',
    metadata: { created: 1000000, updated: 1000100 },
    tags: ['active', 'verified'],
  })

  const transformedDataFacet = useFacetMap(
    (response) => ({
      id: response.id.toUpperCase(),
      metadata: response.metadata,
      tags: response.tags.map((tag) => tag.toLowerCase()),
    }),
    [],
    [responseFacet],
    createObjectWithKeySpecificEqualityCheck({
      id: strictEqualityCheck,
      metadata: shallowObjectEqualityCheck,
      tags: shallowArrayEqualityCheck,
    }),
  )

  return <div>Data display</div>
}
```

## How It Works

The equality check:

1. Iterates through each property key
2. Uses the specified equality check for that property
3. Returns `false` if any property comparison fails

```tsx twoslash
//@esModuleInterop
import {
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

type Data = {
  name: string
  scores: number[]
}

const check = createObjectWithKeySpecificEqualityCheck<Data>({
  name: strictEqualityCheck,
  scores: shallowArrayEqualityCheck,
})()

check({ name: 'Player1', scores: [10, 20] })

// Same values
console.log(check({ name: 'Player1', scores: [10, 20] })) // true ✅

// Name changed
console.log(check({ name: 'Player2', scores: [10, 20] })) // false ❌

// Scores changed
check({ name: 'Player2', scores: [10, 20] })
console.log(check({ name: 'Player2', scores: [10, 30] })) // false ❌
```

## Nesting with Other Checks

You can combine with other factory functions for deeply nested structures:

```tsx twoslash
//@esModuleInterop
import {
  createObjectWithKeySpecificEqualityCheck,
  createUniformArrayEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
  shallowObjectEqualityCheck,
} from '@react-facet/core'

type ComplexData = {
  id: string
  matrix: number[][] // Array of arrays
  settings: { theme: string; locale: string }
}

const check = createObjectWithKeySpecificEqualityCheck<ComplexData>({
  id: strictEqualityCheck,
  matrix: createUniformArrayEqualityCheck(shallowArrayEqualityCheck),
  settings: shallowObjectEqualityCheck,
})()

check({
  id: 'abc',
  matrix: [
    [1, 2],
    [3, 4],
  ],
  settings: { theme: 'dark', locale: 'en' },
})

console.log(
  check({
    id: 'abc',
    matrix: [
      [1, 2],
      [3, 4],
    ],
    settings: { theme: 'dark', locale: 'en' },
  }),
) // true ✅
```

## Important Notes

### Type Safety

TypeScript ensures you provide equality checks for all properties:

```tsx twoslash
//@esModuleInterop
import { createObjectWithKeySpecificEqualityCheck, strictEqualityCheck } from '@react-facet/core'

type Data = {
  name: string
  age: number
}

// @ts-expect-error - Missing 'age' property
const check1 = createObjectWithKeySpecificEqualityCheck<Data>({
  name: strictEqualityCheck,
})

// ✅ Correct - all properties specified
const check2 = createObjectWithKeySpecificEqualityCheck<Data>({
  name: strictEqualityCheck,
  age: strictEqualityCheck,
})
```

### Property Order Doesn't Matter

```tsx twoslash
//@esModuleInterop
import { createObjectWithKeySpecificEqualityCheck, strictEqualityCheck } from '@react-facet/core'

type Data = { a: number; b: number }

const check = createObjectWithKeySpecificEqualityCheck<Data>({
  a: strictEqualityCheck,
  b: strictEqualityCheck,
})()

check({ a: 1, b: 2 })

// Same values, different order
console.log(check({ b: 2, a: 1 })) // true ✅
```

### Each Property Maintains Independent State

Each property's equality check maintains its own state independently. This is important because **all property checks always run**, even when one fails:

```tsx twoslash
//@esModuleInterop
import {
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
} from '@react-facet/core'

type Data = {
  name: string
  items: number[]
}

const check = createObjectWithKeySpecificEqualityCheck<Data>({
  name: strictEqualityCheck,
  items: shallowArrayEqualityCheck,
})()

check({ name: 'Steve', items: [1, 2] })

// Name changed, but items stayed the same
// Both checks run: name returns false, items returns true
// Overall result is false (name changed)
console.log(check({ name: 'Alex', items: [1, 2] })) // false ❌

// Now both values are the same as the previous call
// Both checks run: name returns true, items returns true
// Overall result is true (nothing changed)
console.log(check({ name: 'Alex', items: [1, 2] })) // true ✅
```

**Key insight:** Even though `name` failed on the second call, the `items` check still ran and updated its internal state to `[1, 2]`. This ensures all checks stay synchronized with the current values.

## Common Patterns

### User Profile

```tsx
import {
  useFacetMap,
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
  shallowObjectEqualityCheck,
} from '@react-facet/core'

type UserProfile = {
  id: string
  displayName: string
  roles: string[]
  preferences: { theme: string; language: string }
}

const profileFacet = useFacetMap(
  (user) => ({
    id: user.id,
    displayName: `${user.firstName} ${user.lastName}`,
    roles: user.roles,
    preferences: user.preferences,
  }),
  [],
  [userFacet],
  createObjectWithKeySpecificEqualityCheck({
    id: strictEqualityCheck,
    displayName: strictEqualityCheck,
    roles: shallowArrayEqualityCheck,
    preferences: shallowObjectEqualityCheck,
  }),
)
```

### Dashboard State

```tsx
import {
  useFacetMap,
  createObjectWithKeySpecificEqualityCheck,
  strictEqualityCheck,
  shallowArrayEqualityCheck,
  shallowObjectArrayEqualityCheck,
} from '@react-facet/core'

type DashboardState = {
  selectedView: string
  filterIds: number[]
  widgets: Array<{ id: number; visible: boolean }>
}

const dashboardFacet = useFacetMap(
  (state, userId) => ({
    selectedView: state.views[userId] || 'default',
    filterIds: state.filters.filter((f) => f.userId === userId).map((f) => f.id),
    widgets: state.widgets.filter((w) => w.userId === userId),
  }),
  [],
  [stateFacet, userIdFacet],
  createObjectWithKeySpecificEqualityCheck({
    selectedView: strictEqualityCheck,
    filterIds: shallowArrayEqualityCheck,
    widgets: shallowObjectArrayEqualityCheck,
  }),
)
```

## Performance Considerations

Performance depends on the complexity of the individual equality checks:

- Simple checks (primitives) are fast
- Complex checks (nested arrays/objects) can be slower
- Each property is checked independently

**Optimize by:**

- Using simpler equality checks where possible
- Ordering checks to fail fast (put likely-to-change properties first in source code)
- Profiling before adding complex nested checks

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check) - For objects with uniform property types
- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) - For objects with only primitive properties
- [Custom Equality Checks](./custom-equality-checks) - Create your own equality checks
