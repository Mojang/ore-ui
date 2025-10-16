---
sidebar_position: 1
---

# useFacetState

To define facets within React components, there is a main hook `useFacetState` that provides a very familiar API when compared with React's `useState`.

Returns a `[facet, setFacet]` pair. Like React's `useState`, but with a Facet instead of a value.

:::tip Facet Reference Stability
**The facet returned by `useFacetState` maintains a stable reference across all re-renders.** Unlike `useFacetMap` or `useFacetWrap`, the facet instance never changes—only its internal value updates when you call the setter.

This makes `useFacetState` perfect for creating persistent state that can be safely passed to child components without causing unnecessary re-renders from reference changes.
:::

This example illustrates how to use this hook in the common use case of having to store the temporary state of the input field until it is submitted.

```tsx twoslash
// @esModuleInterop
import { useCallback } from 'react'
import { render, KeyboardCallback } from '@react-facet/dom-fiber'
import { useFacetMap, useFacetState, useFacetCallback } from '@react-facet/core'

interface Props {
  onSubmit: (value: string) => void
  initialValue: string
}

// ---cut---
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

## Handling Previous Values with NO_VALUE

:::warning Critical: Setter Callback Receives Option&lt;T&gt;
When using the functional form of the setter (callback), **the previous value is `Option<T>` (i.e., `T | NO_VALUE`), not just `T`**. You must check for `NO_VALUE` before using the previous value to avoid runtime errors.

```tsx
const [itemsFacet, setItems] = useFacetState<string[]>([])

// ❌ WRONG - current might be NO_VALUE, can't spread a Symbol!
setItems((current) => [...current, newItem])

// ✅ CORRECT - Check for NO_VALUE first
setItems((current) => (current !== NO_VALUE ? [...current, newItem] : [newItem]))
```

This is exactly the same requirement as [`useFacetUnwrap`](./use-facet-unwrap#handling-no_value) - anytime you access a facet's value (directly or through a callback), it might be `NO_VALUE`.
:::

## NO_VALUE Retention Behavior in Setters

:::info Important: Returning NO_VALUE from Setter Retains Previous Value
When a setter callback returns `NO_VALUE`, **the facet retains its previous value** rather than updating to `NO_VALUE`. The facet's internal value is set to `NO_VALUE`, but listeners are not notified, so subscribers continue seeing the last emitted value.

This is useful for conditional updates where you want to prevent state changes under certain conditions:

```tsx twoslash
// @esModuleInterop
import { useFacetState, NO_VALUE } from '@react-facet/core'

const ConditionalCounter = () => {
  const [countFacet, setCount] = useFacetState(0)

  const incrementIfBelow5 = () => {
    setCount((current) => {
      if (current === NO_VALUE) return 1
      if (current >= 5) return NO_VALUE // Prevent updates once we hit 5
      return current + 1
    })
  }

  // countFacet will update: 0 → 1 → 2 → 3 → 4 → 5 → (stays 5)
  // Clicks after 5 don't trigger updates because we return NO_VALUE

  return <button onClick={incrementIfBelow5}>Increment (max 5)</button>
}
```

**Key points:**

- Returning `NO_VALUE` from a setter callback **does not** propagate to subscribers
- It prevents the facet from updating, keeping the last emitted value for all observers
- The internal state becomes `NO_VALUE`, but listeners aren't called
- Useful for implementing validation, conditional updates, or preventing unwanted state changes

:::

## Common Patterns

When updating state based on the previous value, always check for `NO_VALUE`:

```tsx twoslash
// @esModuleInterop
import { useFacetState, NO_VALUE } from '@react-facet/core'

const TodoList = () => {
  const [todosFacet, setTodos] = useFacetState<string[]>([])

  const addTodo = (todo: string) => {
    // ✅ CORRECT - Always check for NO_VALUE when using callback form
    setTodos((current) => (current !== NO_VALUE ? [...current, todo] : [todo]))
  }

  const removeTodo = (index: number) => {
    // ✅ CORRECT - Check before filtering
    setTodos((current) => (current !== NO_VALUE ? current.filter((_, i) => i !== index) : []))
  }

  return <div>Todo List</div>
}
```

For objects, the same pattern applies:

```tsx twoslash
// @esModuleInterop
import { useFacetState, NO_VALUE } from '@react-facet/core'

type User = { name: string; age: number }

const UserProfile = () => {
  const [userFacet, setUser] = useFacetState<User>({ name: 'Alice', age: 30 })

  const updateName = (newName: string) => {
    // ✅ CORRECT - Check before spreading
    setUser((current) => (current !== NO_VALUE ? { ...current, name: newName } : { name: newName, age: 0 }))
  }

  return <div>User Profile</div>
}
```

**Common patterns:**

```tsx twoslash
// @esModuleInterop
import { useFacetState, NO_VALUE } from '@react-facet/core'

const Examples = () => {
  const [countFacet, setCount] = useFacetState(0)
  const [itemsFacet, setItems] = useFacetState<string[]>([])

  // Incrementing a number
  const increment = () => {
    setCount((current) => (current !== NO_VALUE ? current + 1 : 1))
  }

  // Appending to array
  const appendItem = (item: string) => {
    setItems((current) => (current !== NO_VALUE ? [...current, item] : [item]))
  }

  // Replacing array element
  const replaceItem = (index: number, newItem: string) => {
    setItems((current) => (current !== NO_VALUE ? current.map((item, i) => (i === index ? newItem : item)) : [newItem]))
  }

  return <div>Examples</div>
}
```
