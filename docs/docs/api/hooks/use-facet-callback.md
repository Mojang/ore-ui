---
sidebar_position: 4
---

# useFacetCallback

The `useFacetCallback` hook is similar to React's `useCallback` in that it allows you to create a memoized callback that will only be updated if some of the explicit dependencies change. On top of that, `useFacetCallback` allows you to pass one or more Facets and get the current values of those facets in the callback body.

Like `useCallback`, `useFacetCallback` will update the reference if a value in the dependency array change. However, it will not update the reference if a Facet change.

## Signature

The `useFacetCallback` hook has two overloads depending on whether a `defaultReturn` is provided:

**With `defaultReturn` (guaranteed return value):**

```typescript
useFacetCallback<M>(
  callback: (...facetValues) => (...args) => M,
  dependencies: unknown[],
  facets: Facet[],
  defaultReturn: M
): (...args) => M
```

**Without `defaultReturn` (may return NO_VALUE):**

```typescript
useFacetCallback<M>(
  callback: (...facetValues) => (...args) => M,
  dependencies: unknown[],
  facets: Facet[]
): (...args) => M | NoValue
```

**Parameters:**

- `callback`: Function that receives facet values and returns a callback function
- `dependencies`: Non-facet dependencies (props, local variables)
- `facets`: Array of facets whose values the callback depends on
- `defaultReturn`: **(Optional)** Value to return if any facet is uninitialized (`NO_VALUE`). When provided, the return type is guaranteed to be `M`. When omitted, the return type is `M | NoValue`.

**Returns:**

- When `defaultReturn` is provided: A memoized callback function that returns `M`
- When `defaultReturn` is omitted: A memoized callback function that returns `M | NoValue`

## Basic Usage

Say for example that you have a small form, and want to create a handler for the Submit action. You need to have access to the current value of a facet that stores the `value` of an input field in order to send that value back to the parent component when the `Submit` button of the form. `useFacetCallback` allows you to create such handler, which will always have access to the current value of the facet.

```tsx twoslash
// @esModuleInterop
import { render, KeyboardCallback } from '@react-facet/dom-fiber'
interface Props {
  onSubmit: (value: string) => void
  initialValue: string
}
// ---cut---
import { useCallback } from 'react'
import { useFacetState, useFacetCallback } from '@react-facet/core'

const Form = ({ onSubmit, initialValue }: Props) => {
  const [value, setValue] = useFacetState(initialValue)

  const handleChange = useCallback<KeyboardCallback>(
    (event) => {
      if (event.target instanceof HTMLInputElement) {
        setValue(event.target.value)
      }
    },
    [setValue],
  )

  const handleClick = useFacetCallback(
    (currentValue) => () => {
      onSubmit(currentValue)
    },
    [onSubmit],
    [value],
  )

  return (
    <fast-div>
      <fast-input onKeyUp={handleChange} value={value} />

      <fast-div onClick={handleClick}>Submit</fast-div>
    </fast-div>
  )
}
```

## Using defaultReturn

The `defaultReturn` parameter allows you to specify a return value for the callback when facets are not yet initialized. This is the value that will be returned when the callback is invoked before all facets have values.

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetCallback } from '@react-facet/core'

const ScoreDisplay = () => {
  const [scoreFacet, setScore] = useFacetState(0)

  // Calculate bonus points based on score
  // Returns a number, so defaultReturn should be a number
  const calculateBonus = useFacetCallback(
    (score) => () => {
      if (score > 100) return score * 0.1
      if (score > 50) return score * 0.05
      return 0
    },
    [],
    [scoreFacet],
    0, // Default return value when scoreFacet is not initialized
  )

  return (
    <div>
      <button
        onClick={() => {
          const bonus = calculateBonus()
          console.log('Bonus points:', bonus)
        }}
      >
        Calculate Bonus
      </button>
    </div>
  )
}
```

Another example with a different return type:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetCallback } from '@react-facet/core'

const UserGreeting = () => {
  const [userFacet] = useFacetState({ name: 'Alice', isAdmin: false })

  // Returns a string, so defaultReturn is a string
  const getGreeting = useFacetCallback(
    (user) => () => {
      return user.isAdmin ? `Welcome back, Admin ${user.name}!` : `Hello, ${user.name}!`
    },
    [],
    [userFacet],
    'Welcome, Guest!', // Default greeting when userFacet is not initialized
  )

  return <div>{getGreeting()}</div>
}
```

**When to use `defaultReturn`:**

- ✅ When the callback is invoked immediately and facets might not be initialized yet
- ✅ To provide a sensible fallback value that matches the expected return type
- ✅ To avoid conditional logic checking for `NO_VALUE` in the calling code

**When not needed:**

- ❌ When facets are always initialized before the callback can be invoked
- ❌ When you can handle `NO_VALUE` appropriately in the calling code
