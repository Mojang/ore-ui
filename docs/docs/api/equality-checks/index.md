---
sidebar_position: 8
sidebar_label: Equality Checks
---

# Equality Checks Overview

Equality checks prevent unnecessary facet updates by determining whether a new value is meaningfully different from the previous one. Essential for optimizing performance with objects, arrays, and complex data structures.

**Key concept**: Built-in equality checks compare **values** rather than references, designed for mutable data patterns common in game UI development.

## Quick Reference

| Equality Check                                                                   | Use Case                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------- |
| [`defaultEqualityCheck`](./default-equality-check)                               | Default behavior (used automatically)        |
| [`strictEqualityCheck`](./strict-equality-check)                                 | Primitives (string, number, boolean, etc.)   |
| [`shallowObjectEqualityCheck`](./shallow-object-equality-check)                  | Objects with primitive values                |
| [`shallowArrayEqualityCheck`](./shallow-array-equality-check)                    | Arrays of primitives                         |
| [`shallowObjectArrayEqualityCheck`](./shallow-object-array-equality-check)       | Arrays of objects with primitive values      |
| [`createUniformObjectEqualityCheck`](./create-uniform-object-equality-check)     | Objects with uniform value types             |
| [`createUniformArrayEqualityCheck`](./create-uniform-array-equality-check)       | Arrays of arrays or nested structures        |
| [`createObjectWithKeySpecificEqualityCheck`](./create-object-key-specific-check) | Objects with different types per property    |
| [`createOptionalValueEqualityCheck`](./create-optional-value-equality-check)     | Nullable/optional values                     |
| [Custom Equality Checks](./custom-equality-checks)                               | Specific data structures or comparison logic |

## Equality Checks by Category

### Primitives

[**`strictEqualityCheck`**](./strict-equality-check) - Type-safe strict equality for primitives and functions. TypeScript enforces correct usage.

[**`defaultEqualityCheck`**](./default-equality-check) - Default check used internally. Performance optimized for primitives; always returns `false` for objects/arrays.

:::tip Choosing Between Them

- **For primitives**: Use default (omit parameter) - it's optimized for performance
- **For type safety**: Use `strictEqualityCheck` - TypeScript prevents misuse
- **For functions**: Use `strictEqualityCheck` - compares function references
- **For objects/arrays**: Use neither - use specialized checks like `shallowObjectEqualityCheck`

:::

### Objects

[**`shallowObjectEqualityCheck`**](./shallow-object-equality-check) - Objects with primitive properties.

**Nullable variant**: `nullableShallowObjectEqualityCheck` for when the object itself might be `null`/`undefined`.

### Arrays

[**`shallowArrayEqualityCheck`**](./shallow-array-equality-check) - Arrays of primitives.

**Nullable variant**: `nullableShallowArrayEqualityCheck` for when the array itself might be `null`/`undefined`.

[**`shallowObjectArrayEqualityCheck`**](./shallow-object-array-equality-check) - Arrays of objects with primitive properties.

**Nullable variant**: `nullableShallowObjectArrayEqualityCheck` for when the array itself might be `null`/`undefined`.

### Factory Functions

[**`createUniformObjectEqualityCheck`**](./create-uniform-object-equality-check) - Objects where all properties have the same type.

[**`createUniformArrayEqualityCheck`**](./create-uniform-array-equality-check) - Arrays of arrays or nested complex structures.

[**`createObjectWithKeySpecificEqualityCheck`**](./create-object-key-specific-check) - Objects where each property needs different comparison logic.

[**`createOptionalValueEqualityCheck`**](./create-optional-value-equality-check) - Wraps any equality check to handle null/undefined.

### Custom

[**Custom Equality Checks**](./custom-equality-checks) - Create your own for specialized comparison logic.

## Usage Example

```tsx
import { useFacetMap, shallowObjectEqualityCheck } from '@react-facet/core'

const playerFacet = useFacetMap(
  (name, health) => ({ name, health }),
  [],
  [nameFacet, healthFacet],
  shallowObjectEqualityCheck, // ← Prevents updates when values haven't changed
)
```

:::tip Quick Decision Guide

- **Primitives** → `strictEqualityCheck`
- **Simple objects** → `shallowObjectEqualityCheck`
- **Simple arrays** → `shallowArrayEqualityCheck`
- **Arrays of objects** → `shallowObjectArrayEqualityCheck`
- **Nested structures** → Factory functions
- **Special logic** → Custom equality checks

:::

## How They Work

Equality checks use a **two-function closure pattern**:

1. **Initializer** `() =>` - Sets up checker (called once)
2. **Checker** `(value) =>` - Compares with previous (called on updates)

Returns `true` to skip update, `false` to trigger update. First call always returns `false`.

[Learn more about creating custom equality checks →](./custom-equality-checks)
