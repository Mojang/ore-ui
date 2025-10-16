---
sidebar_position: 2
---

# defaultEqualityCheck

The default equality check used internally by React Facet. Uses reference equality for primitives and always returns `false` (not equal) for objects and arrays, treating them as mutable.

## When to Use

You typically don't need to explicitly use `defaultEqualityCheck` since it's applied automatically when no equality check is specified. It's exported primarily for reference and edge cases.

**Default behavior:**

- For primitives (number, string, boolean, null, undefined): Uses reference equality (`===`)
- For objects and arrays: Always returns `false` (treats as always different/mutable)

## Signature

```typescript
function defaultEqualityCheck<T>(): (current: T) => boolean
```

## How It Works

### With Primitives

```tsx twoslash
//@esModuleInterop
import { defaultEqualityCheck } from '@react-facet/core'

const equalityCheck = defaultEqualityCheck()

equalityCheck(0)

console.log(equalityCheck(0)) // true - same value
console.log(equalityCheck(1)) // false - different value
console.log(equalityCheck(1)) // true - same value again
```

### With Objects and Arrays

:::warning Important
`defaultEqualityCheck` **always returns `false`** for objects and arrays, treating them as mutable data that should always trigger updates:
:::

```tsx twoslash
//@esModuleInterop
import { defaultEqualityCheck } from '@react-facet/core'

const equalityCheck = defaultEqualityCheck<{ name: string }>()

const obj1 = { name: 'Steve' }
equalityCheck(obj1)

console.log(equalityCheck(obj1)) // false - objects always treated as different
console.log(equalityCheck(obj1)) // false - even same reference!
console.log(equalityCheck({ name: 'Steve' })) // false - always different
```

This behavior is intentional - it assumes mutable data patterns common in game UI development where objects/arrays are mutated in place.

For value-based comparison of objects and arrays, use specialized equality checks:

- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) for objects
- [`shallowArrayEqualityCheck`](./shallow-array-equality-check) for arrays

## Performance Optimization

:::tip Internal Optimization
The library has a special performance optimization for `defaultEqualityCheck`. When used in hooks like `useFacetMap` and `useFacetMemo`, the implementation is inlined for better performance compared to providing `strictEqualityCheck` or other custom checks.

This makes `defaultEqualityCheck` the fastest option for primitives, even though it behaves identically to `strictEqualityCheck` for those types.
:::

## When NOT to Specify

The default equality check is used automatically, so there's no need to pass it explicitly:

```tsx
import { useFacetMap } from '@react-facet/core'

// ✅ These are equivalent
const facet1 = useFacetMap((x) => x * 2, [], [sourceFacet])
const facet2 = useFacetMap((x) => x * 2, [], [sourceFacet], defaultEqualityCheck)
```

## See Also

- [Equality Checks Overview](./index) - Guide to all equality checks
- [`strictEqualityCheck`](./strict-equality-check) - For primitives with strict equality
- [`shallowObjectEqualityCheck`](./shallow-object-equality-check) - For objects with primitive values
- [`shallowArrayEqualityCheck`](./shallow-array-equality-check) - For arrays of primitives
