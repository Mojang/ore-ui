---
sidebar_position: 3
---

# shallowObjectEqualityCheck

Shallow equality check for objects with primitive property values. Compares each property's value rather than object reference.

## When to Use

Use when deriving objects where all properties are primitives (string, number, boolean):

- ✅ Objects with primitive values only
- ✅ Combining multiple facets into a single object
- ❌ Objects with nested objects (use [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check))
- ❌ Objects with arrays (use [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check))

## Signature

```typescript
function shallowObjectEqualityCheck(): (current: ObjectWithImmutables) => boolean

type ObjectWithImmutables = Record<string, string | number | boolean>
```

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { shallowObjectEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowObjectEqualityCheck()

equalityCheck({ name: 'Alex', height: 2 })

console.log(equalityCheck({ name: 'Alex', height: 2 })) // true - same values
console.log(equalityCheck({ name: 'Steve', height: 2 })) // false - different name
console.log(equalityCheck({ name: 'Steve', height: 2 })) // true - same values again
```

## Usage with Facets

### Combining Multiple Facets

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, shallowObjectEqualityCheck } from '@react-facet/core'

const PlayerStats = () => {
  const nameFacet = useFacetWrap('Steve')
  const healthFacet = useFacetWrap(100)
  const levelFacet = useFacetWrap(5)

  // Combine into single object - only updates when values actually change
  const playerStatsFacet = useFacetMap(
    (name, health, level) => ({ name, health, level }),
    [],
    [nameFacet, healthFacet, levelFacet],
    shallowObjectEqualityCheck, // Prevents updates from object recreation
  )

  return (
    <div>
      <fast-text text={useFacetMap((stats) => `${stats.name} - Level ${stats.level}`, [], [playerStatsFacet])} />
    </div>
  )
}
```

## Nullable Variant

For cases where **the entire object** might be `null` or `undefined`, use `nullableShallowObjectEqualityCheck`:

```tsx twoslash
//@esModuleInterop
import { nullableShallowObjectEqualityCheck } from '@react-facet/core'

const equalityCheck = nullableShallowObjectEqualityCheck()

equalityCheck(null)
console.log(equalityCheck(null)) // true - null === null ✅

console.log(equalityCheck({ name: 'Steve', age: 25 })) // false - null → object ❌

console.log(equalityCheck({ name: 'Steve', age: 25 })) // true - same object values ✅

console.log(equalityCheck(null)) // false - object → null ❌
```

:::tip
For objects with nullable **properties** (like `{ name: string | null }`), you don't need the nullable variant. Regular `shallowObjectEqualityCheck` handles `null`/`undefined` property values just fine using strict equality (`===`).
:::

## How It Works

The equality check:

1. Compares the number of keys in both objects
2. Iterates through each property
3. Compares primitive values using `===`
4. Returns `false` if any property differs

```tsx twoslash
//@esModuleInterop
import { shallowObjectEqualityCheck } from '@react-facet/core'

const check = shallowObjectEqualityCheck()

check({ a: 1, b: 'hello' })

// Different object reference, but same values
console.log(check({ a: 1, b: 'hello' })) // true ✅

// Different values
console.log(check({ a: 2, b: 'hello' })) // false ❌

// Different keys
console.log(check({ a: 1, b: 'hello', c: 'extra' })) // false ❌
```

## Important Notes

### Only Shallow Comparison

This check **does not** compare nested objects or arrays:

```tsx twoslash
//@esModuleInterop
import { shallowObjectEqualityCheck } from '@react-facet/core'

// ❌ Won't work as expected for nested structures
const check = shallowObjectEqualityCheck()

const nested1 = { user: { name: 'Steve' } }
const nested2 = { user: { name: 'Steve' } } // Different object reference

// @ts-expect-error - Type error: user property is an object, not a primitive
check(nested1)
// @ts-expect-error - Type error: user property is an object, not a primitive
console.log(check(nested2)) // false - user objects have different references
```

**Note:** TypeScript will catch this mistake - the equality check expects objects with only primitive values (`string | number | boolean`).

For nested structures, use:

- [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check) for uniform nested values
- [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check) for mixed nested values

### Property Order Doesn't Matter

```tsx twoslash
//@esModuleInterop
import { shallowObjectEqualityCheck } from '@react-facet/core'

const check = shallowObjectEqualityCheck()

check({ name: 'Alex', age: 25 })

// Same values, different order - still equal
console.log(check({ age: 25, name: 'Alex' })) // true ✅
```

## Common Patterns

### Form State

```tsx
import { useFacetMap, shallowObjectEqualityCheck } from '@react-facet/core'

const formStateFacet = useFacetMap(
  (username, email, age) => ({ username, email, age }),
  [],
  [usernameFacet, emailFacet, ageFacet],
  shallowObjectEqualityCheck,
)
```

### Computed Properties

```tsx
import { useFacetMap, shallowObjectEqualityCheck } from '@react-facet/core'

const statsViewFacet = useFacetMap(
  (player) => ({
    displayName: player.name.toUpperCase(),
    healthPercent: (player.health / player.maxHealth) * 100,
    isLowHealth: player.health < 20,
  }),
  [],
  [playerFacet],
  shallowObjectEqualityCheck,
)
```

### API Response Transformation

```tsx
import { useFacetMap, shallowObjectEqualityCheck } from '@react-facet/core'

const parsedResponseFacet = useFacetMap(
  (rawData) => ({
    id: parseInt(rawData.id),
    name: rawData.name.trim(),
    active: rawData.status === 'active',
  }),
  [],
  [rawDataFacet],
  shallowObjectEqualityCheck,
)
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`strictEqualityCheck`](./strict-equality-check) - For primitive values
- [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check) - For objects with nested structures
- [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check) - For objects with mixed property types
