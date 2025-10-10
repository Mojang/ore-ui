---
sidebar_position: 8
---

# Equality Checks

In order to avoid triggering unnecessary updates via the facets, there is a mechanism for prevent updates by passing equality checks to
them.

The built-in equality checks are aware of mutating objects and arrays, and that is why their APIs might seem counter-intuitive at first.

These are the equality checks currently available:

## `strictEqualityCheck`

Checks that the current value is exactly the same as the other previous one. Accepts value of type function, number, boolean, string, undefined or null.

```tsx twoslash
//@esModuleInterop
import { strictEqualityCheck } from '@react-facet/core'

const equalityCheck = strictEqualityCheck()

equalityCheck(0)

console.log(equalityCheck(0)) // true
console.log(equalityCheck(1)) // false
console.log(equalityCheck(1)) // true
```

## `shallowObjectEqualityCheck` and `nullableShallowObjectEqualityCheck`

Equality check that verifies the values of each key of an object.

Each value must be a primitive (boolean, number or string).

There is also a variant that supports "nullable values" (`undefined` and `null`).

```tsx twoslash
//@esModuleInterop
import { shallowObjectEqualityCheck } from '@react-facet/core'


const equalityCheck = shallowObjectEqualityCheck()

equalityCheck({ name: 'Alex', height: 2 })

console.log(equalityCheck({ name: 'Alex', height: 2 })) // true
console.log(equalityCheck({ name: 'Steve', height: 2 })) // false
console.log(equalityCheck({ name: 'Steve', height: 2 })) // true
```

## `shallowObjectArrayEqualityCheck` and `nullableShallowObjectArrayEqualityCheck`

Does a shallow object equality check for each element in an array.

There is also a variant that supports "nullable values" (`undefined` and `null`).

```tsx twoslash
//@esModuleInterop
import { shallowObjectArrayEqualityCheck } from '@react-facet/core'


const equalityCheck = shallowObjectArrayEqualityCheck()

equalityCheck([{ name: 'Alex' }, { name: 'Steve' }])

console.log(equalityCheck([{ name: 'Alex' }, { name: 'Steve' }])) // true
console.log(equalityCheck([{ name: 'Alex' }])) // false
console.log(equalityCheck([{ name: 'Alex' }])) // true
console.log(equalityCheck([{ name: 'Steve' }])) // false
```

## `shallowArrayEqualityCheck` and `nullableShallowArrayEqualityCheck`

Shallow equality check of primitives in an array.

There is also a variant that supports "nullable values" (`undefined` and `null`).

```tsx twoslash
//@esModuleInterop
import { shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = shallowArrayEqualityCheck()

equalityCheck([0, 1, 2])

console.log(equalityCheck([0, 1, 2])) // true
console.log(equalityCheck([0, 1, 2, 3])) // false
console.log(equalityCheck([0, 1, 2, 3])) // true
console.log(equalityCheck([0, 1, 3])) // false
console.log(equalityCheck([0, 1, 3])) // true
```

## `defaultEqualityCheck`

- The default equality check that assumes data can be mutated.
- It is used internally by default, so there is no need to provide it.

```tsx twoslash
//@esModuleInterop
import { defaultEqualityCheck } from '@react-facet/core'

const equalityCheck = defaultEqualityCheck()

equalityCheck(0)

console.log(equalityCheck(0)) // true
console.log(equalityCheck(1)) // false
console.log(equalityCheck(1)) // true
```

## `createUniformObjectEqualityCheck`

Creates an equality check that tests that the values of all the properties in an object
haven't changed.

The comparison used for the value of the properties is passed to it as an argument.

```tsx twoslash
//@esModuleInterop
import { createUniformObjectEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

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
) // true
console.log(
  equalityCheck({
    a: [1, 5],
    b: [3],
  }),
) // false
console.log(
  equalityCheck({
    a: [1, 5],
    b: [3],
  }),
) // true
```

## `createUniformArrayEqualityCheck`

Creates an equality check that tests that the items in an array haven't changed.

The comparison used for the individual items is passed to it as an argument.

```tsx twoslash
//@esModuleInterop
import { createUniformArrayEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = createUniformArrayEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck([[1, 2], [3]])

console.log(equalityCheck([[1, 2], [3]])) // true
console.log(
  equalityCheck([
    [1, 2],
    [3, 1],
  ]),
) // false
console.log(
  equalityCheck([
    [1, 2],
    [3, 1],
  ]),
) // true
```

## `createObjectWithKeySpecificEqualityCheck`

Creates an equality check that tests whether each property of the target object has changed.
Each property is tested with a different comparator, so that they can be of different types.

The comparator are passed down to it as an object with the same keys as the target object, but
comparators for each property as values.

```tsx twoslash
//@esModuleInterop
import {
  createObjectWithKeySpecificEqualityCheck,
  shallowArrayEqualityCheck,
  strictEqualityCheck,
} from '@react-facet/core'

const equalityCheck = createObjectWithKeySpecificEqualityCheck({
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
) // true

console.log(
  equalityCheck({
    name: 'Alex',
    items: [1, 54, 97],
  }),
) // false

console.log(
  equalityCheck({
    name: 'Alex',
    items: [1, 54, 97],
  }),
) // true
```

## `createOptionalValueEqualityCheck`

Creates an equality check that tests whether the value changed from null to defined or stayed the same

If the value was not null before and it is not null currently, the comparison is done by the equality check
provided as an argument to this creator.

This creator is useful to be able to make equality checkers for optional properties when you already have
an equality check for the underlying type.

```tsx twoslash
//@esModuleInterop
import { createOptionalValueEqualityCheck, shallowArrayEqualityCheck } from '@react-facet/core'

const equalityCheck = createOptionalValueEqualityCheck(shallowArrayEqualityCheck)()

equalityCheck([1, 2, 3])

console.log(equalityCheck([1, 2, 3])) // true

console.log(equalityCheck(null)) // false

console.log(equalityCheck(null)) // true
```
