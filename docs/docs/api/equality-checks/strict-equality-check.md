---
sidebar_position: 1
---

# strictEqualityCheck

Checks that the current value is strictly equal (`===`) to the previous value. Type-safe for primitive types and functions only.

## When to Use

Use `strictEqualityCheck` when deriving primitive values or functions from facets:

- ✅ Strings, numbers, booleans
- ✅ `null` and `undefined`
- ✅ Function references
- ❌ Objects - **TypeScript will prevent this** (use [`shallowObjectEqualityCheck`](./shallow-object-equality-check) instead)
- ❌ Arrays - **TypeScript will prevent this** (use [`shallowArrayEqualityCheck`](./shallow-array-equality-check) instead)

:::info Type Safety
`strictEqualityCheck` has a generic constraint `<T extends Immutable | Function>` that restricts it to only work with primitives and functions. TypeScript will give a compile error if you try to use it with objects or arrays.
:::

## Signature

```typescript
function strictEqualityCheck<T extends Immutable | Function>(): (current: T) => boolean

// Where Immutable = boolean | number | string | undefined | null
```

## Basic Usage

```tsx twoslash
//@esModuleInterop
import { strictEqualityCheck } from '@react-facet/core'

const equalityCheck = strictEqualityCheck()

equalityCheck(0)

console.log(equalityCheck(0)) // true
console.log(equalityCheck(1)) // false
console.log(equalityCheck(1)) // true
```

## Usage with Facets

```tsx twoslash
import { render } from '@react-facet/dom-fiber'
// ---cut---
//@esModuleInterop
import { useFacetMap, useFacetWrap, strictEqualityCheck } from '@react-facet/core'

const UserGreeting = () => {
  const userFacet = useFacetWrap({ firstName: 'Steve', lastName: 'Miner' })

  // Derive first name as a string
  const firstNameFacet = useFacetMap(
    (user) => user.firstName,
    [],
    [userFacet],
    strictEqualityCheck, // Prevents updates when firstName hasn't changed
  )

  return (
    <div>
      Hello, <fast-text text={firstNameFacet} />!
    </div>
  )
}
```

## Behavior Details

### First Call

Always returns `false` on the first call (no previous value to compare):

```tsx twoslash
//@esModuleInterop
import { strictEqualityCheck } from '@react-facet/core'

const equalityCheck = strictEqualityCheck()

console.log(equalityCheck(42)) // false - first call
console.log(equalityCheck(42)) // true - same value
```

### Strict Equality

Uses JavaScript's strict equality operator (`===`):

```tsx twoslash
//@esModuleInterop
import { strictEqualityCheck } from '@react-facet/core'

const equalityCheck = strictEqualityCheck<number>()

equalityCheck(0)

console.log(equalityCheck(0)) // true
console.log(equalityCheck(0.0)) // true
console.log(equalityCheck(-0)) // true (0 === -0 in JavaScript)
console.log(equalityCheck(NaN)) // false (NaN !== NaN in JavaScript)
```

## Common Patterns

### Deriving String Values

```tsx
import { useFacetMap, strictEqualityCheck } from '@react-facet/core'

const displayNameFacet = useFacetMap(
  (user) => `${user.firstName} ${user.lastName}`,
  [],
  [userFacet],
  strictEqualityCheck,
)
```

### Deriving Numeric Values

```tsx
import { useFacetMap, strictEqualityCheck } from '@react-facet/core'

const percentageFacet = useFacetMap(
  (current, max) => (current / max) * 100,
  [],
  [currentFacet, maxFacet],
  strictEqualityCheck,
)
```

### Deriving Boolean Values

```tsx
import { useFacetMap, strictEqualityCheck } from '@react-facet/core'

const isValidFacet = useFacetMap(
  (email) => email.includes('@') && email.includes('.'),
  [],
  [emailFacet],
  strictEqualityCheck,
)
```

## Comparison with defaultEqualityCheck

Both use `===` for primitives, but they have important differences:

**`strictEqualityCheck`:**

- ✅ **Type-safe** - TypeScript enforces primitive/function types only
- ✅ **Explicit** - Makes intent clear in code
- ✅ Works with **functions** (function reference comparison)
- ❌ **Slightly slower** - Not optimized like `defaultEqualityCheck`

**`defaultEqualityCheck`:**

- ✅ **Performance optimized** - Inlined in mapping functions for speed
- ✅ **Default behavior** - Used automatically when no check specified
- ✅ Accepts any type (but always returns `false` for objects/arrays)
- ❌ Not type-safe - Allows any type at compile time

```tsx
// strictEqualityCheck - explicit, type-safe, slightly slower
useFacetMap((x) => x * 2, [], [numberFacet], strictEqualityCheck)

// defaultEqualityCheck - implicit, optimized, default behavior
useFacetMap((x) => x * 2, [], [numberFacet]) // automatically uses defaultEqualityCheck
```

:::tip Performance Tip
For primitives, the `defaultEqualityCheck` (used by default) has a special performance optimization that makes it faster than explicitly providing `strictEqualityCheck`. Unless you need the type safety or function comparison, you can omit the equality check parameter.
:::

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`defaultEqualityCheck`](./default-equality-check) - The default equality check
- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) - For objects with primitive values
- [`shallowArrayEqualityCheck`](./shallow-array-equality-check) - For arrays of primitives
