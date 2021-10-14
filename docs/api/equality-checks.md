---
sidebar_position: 8
---

# Equality Checks

In order to avoid triggering unnecessary updates via the facets, there is a mechanism for prevent updates by passing equality checks to
them.

The built-in equality checks are aware of mutating objects and arrays, and that is why their APIs might seem counter-intuitive at first.

These are the equality checks currently available:

## `strictEqualityCheck`

Checks that the current value is exactly the same as the other previous one. Accepts value of type function, number, boolean, string, undefined or null

## `shallowObjectEqualityCheck`

Equality check that verifies the values of each key of an object.
Each value must be a primitive (boolean, number or string)

## `shallowObjectArrayEqualityCheck`

Does a shallow object equality check for each element in an array

## `shallowArrayEqualityCheck`

Shallow equality check of primitives in an array

## `defaultEqualityCheck`

- The default equality check that assumes data can be mutated.
- It is used internally by default, so there is no need to provide it.

## `createUniformObjectEqualityCheck`

Creates an equality check that tests that the values of all the properties in an object
haven't changed.

The comparison used for the value of the properties is passed to it as an argument.

## `createUniformArrayEqualityCheck`

Creates an equality check that tests that the items in an array haven't changed.

The comparison used for the individual items is passed to it as an argument.

## `createObjectWithKeySpecificEqualityCheck`

Creates an equality check that tests whether each property of the target object has changed.
Each property is tested with a different comparator, so that they can be of different types.

The comparator are passed down to it as an object with the same keys as the target object, but
comparators for each property as values.

## `createOptionalValueEqualityCheck`

Creates an equality check that tests whether the value changed from null to defined or stayed the same

If the value was not null before and it is not null currently, the comparison is done by the equality check
provided as an argument to this creator.

This creator is useful to be able to make equality checkers for optional properties when you already have
an equality check for the underlying type.
