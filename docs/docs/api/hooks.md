---
sidebar_position: 2
---

# Hooks

React Facet provides a comprehensive set of hooks for working with facets. These hooks follow React's naming conventions where possible, making them familiar and easy to understand. All facet hooks support the dual dependency array pattern: the first array for non-facet dependencies (props, local variables) and the second array for facet dependencies.

## Quick Reference

| Hook                                                                 | Purpose                                                | React Equivalent  |
| -------------------------------------------------------------------- | ------------------------------------------------------ | ----------------- |
| [`useFacetState`](#usefacetstate)                                    | Create local facet state                               | `useState`        |
| [`useFacetMap`](#usefacetmap)                                        | Derive facet (lightweight, default choice)             | `useMemo`         |
| [`useFacetMemo`](#usefacetmemo)                                      | Derive facet (cached, for expensive computations)      | `useMemo`         |
| [`useFacetCallback`](#usefacetcallback)                              | Create callback that depends on facets                 | `useCallback`     |
| [`useFacetEffect`](#usefaceteffect)                                  | Perform side effects when facets change                | `useEffect`       |
| [`useFacetLayoutEffect`](#usefacetlayouteffect)                      | Synchronous side effects when facets change            | `useLayoutEffect` |
| [`useFacetRef`](#usefacetref)                                        | Create ref that tracks facet value                     | `useRef`          |
| [`useFacetWrap`](#usefacetwrap)                                      | Convert value or facet to facet                        | -                 |
| [`useFacetWrapMemo`](#usefacetwrapmemo)                              | Convert value or facet to facet (memoized, stable)     | -                 |
| [`useFacetUnwrap`](#usefacetunwrap)                                  | ⚠️ Extract plain value (causes re-renders)             | -                 |
| [`useFacetTransition`](#usefacettransition-and-startfacettransition) | Mark facet updates as transitions (with pending state) | `useTransition`   |

## `useFacetState`

To define facets within React components, there is a main hook `useFacetState` that provides a very familiar API when compared with React's `useState`.

Returns a `[facet, setFacet]` pair. Like React’s `useState`, but with a Facet instead of a value.

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

### Handling Previous Values with NO_VALUE

:::warning Critical: Setter Callback Receives Option&lt;T&gt;
When using the functional form of the setter (callback), **the previous value is `Option<T>` (i.e., `T | NO_VALUE`), not just `T`**. You must check for `NO_VALUE` before using the previous value to avoid runtime errors.

```tsx
const [itemsFacet, setItems] = useFacetState<string[]>([])

// ❌ WRONG - current might be NO_VALUE, can't spread a Symbol!
setItems((current) => [...current, newItem])

// ✅ CORRECT - Check for NO_VALUE first
setItems((current) => (current !== NO_VALUE ? [...current, newItem] : [newItem]))
```

This is exactly the same requirement as [`useFacetUnwrap`](#usefacetunwrap) - anytime you access a facet's value (directly or through a callback), it might be `NO_VALUE`.
:::

### NO_VALUE Retention Behavior in Setters

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

### Handling Previous Values with NO_VALUE

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

## `useFacetCallback`

The `useFacetCallback` hook is similar to React's `useCallback` in that it allows you to create a memoized callback that will only be updated if some of the explicit dependencies change. On top of that, `useFacetCallback` allows you to pass one or more Facets and get the current values of those facets in the callback body.

Like `useCallback`, `useFacetCallback` will update the reference if a value in the dependency array change. However, it will not update the reference if a Facet change.

### Signature

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

### Basic Usage

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

### Using defaultReturn

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

## `useFacetEffect`

The `useFacetEffect` hook gives you a way of performing some imperative action (effect) whenever the underlying facets are updated. It is very similar in structure and goal to React’s own `useEffect`.

Like `useEffect`, `useFacetEffect` takes an effect function to be called when the updates happen, a dependency list, and finally an array of facets. If there are more than one facet in the array, then the `useFacetEffect` will only be called when all facets have a value. This is an implementation made to avoid flickering. Once all facets do have a value, the `useFacetEffect` will be called when a value changes in any facet.

```tsx twoslash
// @esModuleInterop
import { useFacetEffect, useFacetState } from '@react-facet/core'

const Logger = ({ shouldLog }: { shouldLog: boolean }) => {
  const [statusFacet, setStatusFacet] = useFacetState('loading')

  useFacetEffect(
    (newStatus) => {
      if (shouldLog) {
        console.log('Status was updated to: ' + newStatus)
      }
    },
    [shouldLog],
    [statusFacet],
  )

  return <span>{shouldLog ? 'Logger is active' : 'Logger is disabled'}</span>
}
```

It also supports a cleanup function that can be returned by the effect function. This cleanup is called whenever any of the dependencies or the facets have changed or when the component is unmounted. In short, it behaves exactly like React’s `useEffect`.

```tsx twoslash
// @esModuleInterop
import { useFacetEffect, useFacetState } from '@react-facet/core'

const Logger = ({ shouldLog }: { shouldLog: boolean }) => {
  const [statusFacet, setStatusFacet] = useFacetState('loading')

  useFacetEffect(
    (newStatus) => {
      const timerId = setTimeout(() => {
        if (shouldLog) {
          console.log('Status was updated to: ' + newStatus)
        }
      }, 1000)

      // Supports a cleanup function (same as React’s useEffect)
      return () => clearTimeout(timerId)
    },
    [shouldLog],
    [statusFacet],
  )

  return <span>{shouldLog ? 'Logger is active' : 'Logger is disabled'}</span>
}
```

### Cleanup Functions

Like React's `useEffect`, `useFacetEffect` supports returning a cleanup function from the effect. This cleanup function is essential for avoiding memory leaks and properly managing resources.

**When cleanup runs:**

1. **Before the effect runs again** - When any facet value or dependency changes
2. **When the component unmounts** - For final cleanup

This matches React's `useEffect` behavior exactly, making it familiar and predictable.

**Common cleanup use cases:**

- Clearing timers and intervals
- Removing event listeners
- Canceling subscriptions
- Aborting network requests
- Cleaning up DOM references

```tsx twoslash
// @esModuleInterop
import { useFacetEffect, useFacetState, Facet } from '@react-facet/core'

// Example: Auto-refresh with cleanup
const AutoRefresh = ({ intervalFacet }: { intervalFacet: Facet<number> }) => {
  useFacetEffect(
    (interval) => {
      const intervalId = setInterval(() => {
        console.log('Refreshing...')
      }, interval)

      // Cleanup runs before next effect or on unmount
      return () => clearInterval(intervalId)
    },
    [],
    [intervalFacet],
  )

  return <div>Auto-refreshing component</div>
}
```

## `useFacetLayoutEffect`

Much like React offers a `useLayoutEffect` as a complement to `useEffect`, so too does `react-facet` offer a `useFacetLayoutEffect`. It takes the exact same input as `useFacetEffect` and has an identical implementation, the sole exception being that it uses React's underlying `useLayoutEffect` instead that fires synchronously after all DOM mutations.

## Deriving Facets: `useFacetMap` and `useFacetMemo`

Both `useFacetMap` and `useFacetMemo` derive new facets from one or more source facets. They have identical APIs but different performance characteristics, making each better suited for different scenarios.

### When to Use Which Hook

**Use `useFacetMap` (lightweight) - THE DEFAULT CHOICE:**

- ✅ The derived facet has **few subscribers** (1-2 components)
- ✅ The mapping function is **lightweight** (property access, string concatenation, simple math)
- ✅ You want **fast initialization** (no overhead from internal facet creation)
- ⚠️ Each subscriber recomputes the mapping function independently

**Use `useFacetMemo` (cached) - FOR OPTIMIZATION:**

- ✅ The derived facet has **many subscribers** (3+ components, or passed to a list)
- ✅ The mapping function is **computationally expensive** (complex calculations, data processing)
- ✅ You want to **cache results** across all subscribers (single computation shared by all)
- ⚠️ Heavier to initialize (uses `createFacet` internally)

**Rule of thumb:** Start with `useFacetMap` for everything. Switch to `useFacetMemo` only when profiling shows a performance issue or you know you'll have many subscribers to an expensive computation.

### How They Differ Under the Hood

**`useFacetMap`** creates a simple facet that recomputes the mapping function for each subscriber independently. It's fast to initialize but computation runs N times for N subscribers.

**`useFacetMemo`** creates a full facet using `createFacet` internally. It's heavier to initialize but caches the result, so computation runs only once regardless of subscriber count.

```typescript
// Scenario: derived facet used by 5 components

// useFacetMap: computation runs 5 times (once per subscriber)
const lightweightFacet = useFacetMap(expensiveFunc, [], [sourceFacet])

// useFacetMemo: computation runs 1 time (cached for all subscribers)
const cachedFacet = useFacetMemo(expensiveFunc, [], [sourceFacet])
```

## `useFacetMap`

The lightweight hook for deriving facets. Best for simple transformations and few subscribers.

:::info Facet Reference Stability
**`useFacetMap` creates a new facet reference when any dependency changes.** This includes:

- Changes to the `dependencies` array (non-facet dependencies like props or local variables)
- Changes to the `facets` array (different facet instances)
- Changes to the `equalityCheck` function

When the returned facet reference changes, any component or hook that depends on it will re-run. This is expected behavior and mirrors how React's `useMemo` works.

**Example:**

```tsx
const Component = ({ multiplier }: { multiplier: number }) => {
  const [valueFacet] = useFacetState(10)

  // derivedFacet is a NEW reference when multiplier changes
  const derivedFacet = useFacetMap(
    (val) => val * multiplier,
    [multiplier], // ← When this changes, new facet is created
    [valueFacet],
  )

  return <ChildComponent facet={derivedFacet} />
}
```

This is usually fine, but be aware when passing derived facets to components that might be sensitive to prop reference changes.
:::

### NO_VALUE Retention Behavior

:::info Important: Returning NO_VALUE Retains Previous Value
When a mapping function returns `NO_VALUE`, **the facet retains its previous value** rather than updating to `NO_VALUE`. The observer does not notify listeners, so subscribers continue seeing the last emitted value.

This is useful for conditional updates where you want to "freeze" a facet's value under certain conditions:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetMap, NO_VALUE } from '@react-facet/core'

const ClampedCounter = () => {
  const [countFacet, setCount] = useFacetState(0)

  // Once count reaches 5, the mapped facet stops updating and retains the value 5
  const clampedFacet = useFacetMap((count) => (count < 5 ? count : NO_VALUE), [], [countFacet])

  // clampedFacet will show: 0, 1, 2, 3, 4, 4, 4, 4... (stuck at 4)
  // Even though countFacet continues: 0, 1, 2, 3, 4, 5, 6, 7...

  return <button onClick={() => setCount((prev) => (prev === NO_VALUE ? 0 : prev + 1))}>Increment</button>
}
```

**Key points:**

- Returning `NO_VALUE` from a mapping function **does not** set the facet's value to `NO_VALUE`
- It prevents the facet from updating, keeping the last successfully mapped value
- This applies to both `useFacetMap` and `useFacetMemo`
- Useful for implementing conditional updates, clamping, or filtering unwanted values

:::

### Using useFacetMap

Use this to combine React component props with facet data and prepare facets to be passed to `fast-*` components.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMap } from '@react-facet/core'

const HealthBar = ({ lowHealthThreshold }: { lowHealthThreshold: number }) => {
  const [playerFacet, setPlayerFacet] = useFacetState({
    health: 80,
    mana: 65,
  })

  const className = useFacetMap(
    ({ health }) => (health > lowHealthThreshold ? 'healthy' : 'hurt'),
    [lowHealthThreshold],
    [playerFacet],
  )

  return <fast-div className={className} />
}
```

The `useFacetMap` hook supports passing in several facets to listen to, so you can merge the values of several facets into one using it.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMap, Facet } from '@react-facet/core'

type Props = {
  placeholderFacet: Facet<string>
  valueFacet: Facet<string>
}

const InputField = ({ placeholderFacet, valueFacet }: Props) => {
  const valueToDisplay = useFacetMap(
    (placeholder, value) => (value != null ? value : placeholder),
    [],
    [placeholderFacet, valueFacet],
  )

  return (
    <span>
      <fast-text text={valueToDisplay} />
    </span>
  )
}
```

Optionally, you can pass an equality check function as the fourth argument to `useFacetMap`. This is particularly useful when grouping more than one facet together into a single array / object, since hard equality checks will not work on arrays / objects.

```tsx twoslash
const SubComponent = ({ facets }: { facets: any }) => null
// ---cut---
// @esModuleInterop

import { shallowArrayEqualityCheck, useFacetState, useFacetMap } from '@react-facet/core'

const WrapperComponent = () => {
  const [facetA, setFacetA] = useFacetState('A')
  const [facetB, setFacetB] = useFacetState('B')

  const groupedFacet = useFacetMap((a, b) => [a, b], [], [facetA, facetB], shallowArrayEqualityCheck)

  return <SubComponent facets={groupedFacet} />
}
```

## `useFacetMemo`

The cached hook for deriving facets. Use when you have many subscribers or expensive computations.

:::info Facet Reference Stability
**`useFacetMemo` creates a new facet reference when any dependency changes.** This behavior is identical to `useFacetMap`:

- Changes to the `dependencies` array trigger a new facet
- Changes to the `facets` array trigger a new facet
- Changes to the `equalityCheck` function trigger a new facet

See the [Facet Reference Stability](#facet-reference-stability) note under `useFacetMap` for more details and examples.
:::

### NO_VALUE Retention Behavior

Like `useFacetMap`, `useFacetMemo` retains the previous value when the mapping function returns `NO_VALUE`. See the [NO_VALUE Retention Behavior](#no_value-retention-behavior) section under `useFacetMap` for details and examples. This behavior is identical for both hooks.

### API

The API is identical to `useFacetMap`:

```typescript
useFacetMemo<M>(
  selector: (...args: FacetValues) => M,
  dependencies: unknown[],     // Non-facet dependencies
  facets: Facet[],            // Facet dependencies
  equalityCheck?: EqualityCheck<M>
): Facet<M>
```

### When to Use useFacetMemo

Use `useFacetMemo` instead of `useFacetMap` when:

1. **Many subscribers** - The derived facet is passed to multiple child components or used in a list
2. **Expensive computation** - The mapping function does complex calculations or data processing
3. **Profiling shows bottleneck** - You've measured that the repeated computation is a performance issue

### Example: Caching for Multiple Subscribers

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMemo } from '@react-facet/core'

const ExpensiveComponent = () => {
  const [dataFacet] = useFacetState({ values: [1, 2, 3, 4, 5] })

  // Expensive computation that we want to cache
  const processedDataFacet = useFacetMemo(
    (data) => {
      // Imagine this is a heavy computation
      return data.values.reduce((sum, val) => sum + val, 0)
    },
    [],
    [dataFacet],
  )

  // Multiple components subscribe to the same cached result
  // With useFacetMap, this would compute 3 times
  // With useFacetMemo, this computes only once
  return (
    <fast-div>
      <fast-text text={processedDataFacet} />
      <fast-text text={processedDataFacet} />
      <fast-text text={processedDataFacet} />
    </fast-div>
  )
}
```

### Example: Combining Multiple Facets

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMemo, Facet } from '@react-facet/core'

type Props = {
  playerHealthFacet: Facet<number>
  playerMaxHealthFacet: Facet<number>
  playerManaFacet: Facet<number>
  playerMaxManaFacet: Facet<number>
}

const PlayerStatsDisplay = ({
  playerHealthFacet,
  playerMaxHealthFacet,
  playerManaFacet,
  playerMaxManaFacet,
}: Props) => {
  // Complex computation combining multiple facets
  const statsMessageFacet = useFacetMemo(
    (health, maxHealth, mana, maxMana) => {
      // Expensive formatting or computation
      const healthPercent = Math.round((health / maxHealth) * 100)
      const manaPercent = Math.round((mana / maxMana) * 100)
      return `Health: ${healthPercent}% | Mana: ${manaPercent}%`
    },
    [],
    [playerHealthFacet, playerMaxHealthFacet, playerManaFacet, playerMaxManaFacet],
  )

  // Result is cached and shared if used in multiple places
  return <fast-text text={statsMessageFacet} />
}
```

### Equality Checks

Like `useFacetMap`, you can provide an equality check function to prevent unnecessary updates:

```tsx twoslash
// @esModuleInterop
import { shallowObjectEqualityCheck, useFacetState, useFacetMemo } from '@react-facet/core'

const DataAggregator = () => {
  const [facetA, setFacetA] = useFacetState('A')
  const [facetB, setFacetB] = useFacetState('B')

  // Use equality check for object results
  const combinedFacet = useFacetMemo(
    (a, b) => ({ valueA: a, valueB: b }),
    [],
    [facetA, facetB],
    shallowObjectEqualityCheck,
  )

  return <div>Combined data component</div>
}
```

## `useFacetRef`

Returns a React `Ref` with the value held inside the provided Facet.

Analog to React's `useRef`, but the argument it receives is a Facet instead of a plain value.

Whenever the value inside the provided Facet is updated, the value inside the
`current` property of the `Ref` will be also updated.

If the `Facet` is not yet initialized, the `Ref` will contain a `NO_VALUE`

```tsx twoslash
import { useEffect } from 'react'
import { useFacetRef, Facet } from '@react-facet/core'

const LogWhenRendered = ({ exampleFacet }: { exampleFacet: Facet<unknown> }) => {
  const facetRef = useFacetRef(exampleFacet)

  useEffect(() => {
    console.log(`The exampleFacet value at the time of rendering: ${facetRef.current}`)
  })

  return null
}
```

## `useFacetWrap`

To simplify the use case in which a certain variable can hold either a value or a Facet containing that value, `useFacetWrap` accepts plain values or facets (a generic type called `FacetProp<A>`, which will either be `A` or `Facet<A>`) and lifts them into a facet. This allows you to migrate components more easily, since inside the implementation can work exclusively with facets and the prop can support both regular values and facets.

> Note that if the consumers of the component pass a regular prop instead of a facet, that will cause the component to re-render, negating all performance benefits. This hook is useful to be able to migrate, for compatibility, but it is still recommended that all consumers of the components that support facets use facets for maximum performance improvement.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMap, useFacetState, useFacetWrap, FacetProp } from '@react-facet/core'

type ButtonProps = {
  isDisabled: FacetProp<boolean>
}

const Button = ({ isDisabled }: ButtonProps) => {
  const isDisabledFacet = useFacetWrap(isDisabled)
  const className = useFacetMap((isDisabled) => (isDisabled ? 'disabled' : 'active'), [], [isDisabledFacet])

  return <fast-div className={className} />
}

const Submit = () => {
  const [isDisabledFacet, setIsDisabledFacet] = useFacetState(false)

  // It can receive a facet as in the examples before
  return <Button isDisabled={isDisabledFacet} />
}

const Cancel = () => {
  // But it can also receive a plain value!
  return <Button isDisabled={false} />
}
```

:::info Facet Reference Stability
**`useFacetWrap` creates a new facet reference whenever the wrapped value changes.** The facet is memoized on the `prop` parameter, so:

- If the prop is already a facet, it returns that facet (stable reference)
- If the prop is a value, it creates a `StaticFacet` wrapping that value
- When the prop value changes, a new `StaticFacet` is created

This is usually fine, but can cause issues when facet reference stability matters. If you need a stable facet reference that doesn't change when the value updates, use [`useFacetWrapMemo`](#usefacetwrapmemo) instead.

**Quick comparison:**

- `useFacetWrap` → new facet instance on value change (lighter, simpler)
- `useFacetWrapMemo` → same facet instance, value updates internally (stable reference)

**Example showing new facet on each change:**

```tsx
const Component = ({ label }: { label: string }) => {
  // labelFacet is a NEW reference when label changes
  const labelFacet = useFacetWrap(label)

  return <ChildComponent facet={labelFacet} />
  // ChildComponent will receive a new facet prop when label changes
}
```

For most use cases, `useFacetWrap` is the right choice. Only use `useFacetWrapMemo` when you specifically need facet reference stability.
:::

## `useFacetWrapMemo`

The `useFacetWrapMemo` hook is a memoized version of [`useFacetWrap`](#usefacetwrap) that maintains a stable facet reference even when the wrapped value changes. Unlike `useFacetWrap` which creates a new facet when the wrapped value changes, `useFacetWrapMemo` creates the facet once and updates its value internally.

### Signature

```typescript
function useFacetWrapMemo<T>(prop: FacetProp<T>, equalityCheck?: EqualityCheck<T>): Facet<T>
```

**Parameters:**

- `prop`: A `Facet<T>` or plain value `T` (via `FacetProp<T>`)
- `equalityCheck`: Optional equality check function to prevent unnecessary updates (default: `defaultEqualityCheck`)

**Returns:** A stable `Facet<T>` that updates its internal value when `prop` changes

### When to Use

Use `useFacetWrapMemo` instead of `useFacetWrap` when:

1. **Facet reference stability matters** - When passing the facet to child components that should not re-render when the facet reference changes
2. **Wrapping frequently changing props** - When the prop value changes often but you want to maintain a stable facet reference

**Note:** `useFacetWrapMemo` always creates a new facet internally (even when the prop is already a facet) and sets up an observer. This means there is overhead compared to passing facets directly. Use this hook when the stability of the facet reference is more important than avoiding the additional facet creation and subscription.

### `useFacetWrap` vs `useFacetWrapMemo` Comparison

**`useFacetWrap` (creates new facet on value change):**

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrap, FacetProp } from '@react-facet/core'

const Component = ({ value }: { value: FacetProp<string> }) => {
  // Creates a new facet instance when value changes
  const facet = useFacetWrap(value)

  return <fast-text text={facet} />
}
```

**`useFacetWrapMemo` (stable facet, updates internal value):**

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrapMemo, FacetProp } from '@react-facet/core'

const Component = ({ value }: { value: FacetProp<string> }) => {
  // Facet instance remains stable, only the value updates
  const facet = useFacetWrapMemo(value)

  return <fast-text text={facet} />
}
```

### Basic Usage

Wrapping a prop value that might be a facet or plain value, with stable facet reference:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrapMemo, useFacetMap, FacetProp } from '@react-facet/core'

type ButtonProps = {
  label: FacetProp<string>
  isDisabled: FacetProp<boolean>
}

const Button = ({ label, isDisabled }: ButtonProps) => {
  // Both facets remain stable across re-renders
  const labelFacet = useFacetWrapMemo(label)
  const isDisabledFacet = useFacetWrapMemo(isDisabled)

  const className = useFacetMap((disabled) => (disabled ? 'button-disabled' : 'button-active'), [], [isDisabledFacet])

  return (
    <fast-div className={className}>
      <fast-text text={labelFacet} />
    </fast-div>
  )
}
```

### Equality Checks

Provide an equality check to optimize updates for complex data types:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrapMemo, useFacetMap, shallowObjectEqualityCheck, FacetProp } from '@react-facet/core'

type UserData = {
  name: string
  age: number
}

const UserDisplay = ({ user }: { user: FacetProp<UserData> }) => {
  // Use equality check to prevent updates when object properties haven't changed
  const userFacet = useFacetWrapMemo(user, shallowObjectEqualityCheck)

  const userName = useFacetMap((u) => u.name, [], [userFacet])

  return (
    <div>
      <fast-text text={userName} />
    </div>
  )
}
```

### Performance Considerations

**When `useFacetWrapMemo` helps:**

- Prevents unnecessary downstream re-renders when facet references change
- Reduces memory allocation from creating new facet instances
- Maintains consistent subscription behavior

**When `useFacetWrap` is sufficient:**

- Simple components where facet reference changes don't matter
- Props that change infrequently
- No performance issues observed with current approach

### Key Differences from `useFacetWrap`

| Feature                   | `useFacetWrap`                      | `useFacetWrapMemo`                        |
| ------------------------- | ----------------------------------- | ----------------------------------------- |
| Facet reference stability | New facet on value change           | Stable facet reference                    |
| Value updates             | New facet with new value            | Same facet, updated internal value        |
| Memory allocation         | New facet instance per value change | One facet instance, reused                |
| Best for                  | Simple wrapping, infrequent changes | Stable references, frequent value changes |
| Performance overhead      | Lower (simple memoization)          | Slightly higher (effect subscriptions)    |

## `useFacetUnwrap`

:::danger Performance Warning
**This hook will negate all the performance benefits of using Facets for state management.**

Every update to the facet will trigger a full React re-render of the component, defeating the primary purpose of React Facet. Use this hook sparingly and only when absolutely necessary.
:::

The `useFacetUnwrap` hook extracts the plain value from a Facet and treats it as regular React component state. This creates a subscription that triggers component re-renders whenever the facet value changes.

### Signature

```typescript
function useFacetUnwrap<T>(prop: FacetProp<T>, equalityCheck?: EqualityCheck<T>): T | NoValue
```

**Parameters:**

- `prop`: A `Facet<T>` or plain value `T` (via `FacetProp<T>`)
- `equalityCheck`: Optional equality check function to prevent unnecessary re-renders (default: reference equality)

**Returns:** The current value `T` or `NO_VALUE` if the facet is uninitialized

:::warning Always Check for NO_VALUE
The return type of `useFacetUnwrap` is `T | NO_VALUE`. You **must** check for `NO_VALUE` before using the value, otherwise you'll get TypeScript errors or runtime issues.

```tsx
const value = useFacetUnwrap(facet)

// ❌ WRONG - TypeScript error! value might be NO_VALUE
if (value > 50) { ... }

// ✅ CORRECT - Check for NO_VALUE first
if (value !== NO_VALUE && value > 50) { ... }
```

:::

### When to Use

`useFacetUnwrap` should only be used in these specific scenarios:

#### 1. Interfacing with Non-Facet-Aware Components

When you must pass a plain value to a third-party component that doesn't accept facets:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap, NO_VALUE } from '@react-facet/core'

// Third-party component that expects plain props
const ThirdPartyChart = ({ data }: { data: number[] }) => <div>Chart</div>

const ChartWrapper = () => {
  const [dataFacet, setDataFacet] = useFacetState<number[]>([1, 2, 3])

  // ⚠️ Necessary here because ThirdPartyChart doesn't support facets
  const plainData = useFacetUnwrap(dataFacet)

  // Always check for NO_VALUE before using
  if (plainData === NO_VALUE) return null

  return <ThirdPartyChart data={plainData} />
}
```

**Better alternative:** Refactor the component to accept facets when possible:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, Facet } from '@react-facet/core'

// ✅ Better - refactor to accept facets
const FacetAwareChart = ({ dataFacet }: { dataFacet: Facet<number[]> }) => {
  // Implementation using facets directly
  return <fast-div>Chart</fast-div>
}

const ChartWrapper = () => {
  const [dataFacet, setDataFacet] = useFacetState<number[]>([1, 2, 3])

  // ✅ No unwrap needed - no re-renders!
  return <FacetAwareChart dataFacet={dataFacet} />
}
```

#### 2. Complex Conditional Logic (Use Sparingly)

When you have complex conditional rendering logic that's difficult to express with `Mount` or `With` components:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap, NO_VALUE } from '@react-facet/core'

const ComplexConditional = () => {
  const [statusFacet] = useFacetState<'loading' | 'error' | 'success'>('loading')
  const [dataFacet] = useFacetState<{ items: string[] } | null>(null)

  // ⚠️ Complex logic that's hard to express otherwise
  const status = useFacetUnwrap(statusFacet)
  const data = useFacetUnwrap(dataFacet)

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'error') return <div>Error!</div>
  if (data === NO_VALUE || data === null) return <div>No data</div>

  return (
    <div>
      {data.items.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </div>
  )
}
```

### When NOT to Use

:::caution Common Anti-Patterns
These patterns should be avoided - use the suggested alternatives instead.
:::

#### ❌ Don't Use for Simple Conditional Rendering

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap } from '@react-facet/core'

const ExpensiveComponent = () => <div>Expensive</div>

// ❌ BAD - causes component re-render
const BadExample = () => {
  const [isVisibleFacet] = useFacetState(true)
  const isVisible = useFacetUnwrap(isVisibleFacet)

  if (!isVisible) return null
  return <ExpensiveComponent />
}
```

```tsx twoslash
// @esModuleInterop
import { useFacetState, Mount } from '@react-facet/core'

const ExpensiveComponent = () => <div>Expensive</div>

// ✅ GOOD - scopes re-render to Mount component
const GoodExample = () => {
  const [isVisibleFacet] = useFacetState(true)

  return (
    <Mount when={isVisibleFacet}>
      <ExpensiveComponent />
    </Mount>
  )
}
```

#### ❌ Don't Use for Binding to DOM

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap, NO_VALUE } from '@react-facet/core'

// ❌ BAD - causes re-renders on every update, requires NO_VALUE checks
const BadHealthBar = () => {
  const [healthFacet] = useFacetState(100)
  const health = useFacetUnwrap(healthFacet)

  // Must check for NO_VALUE before using the value!
  if (health === NO_VALUE) return <div>Loading...</div>

  return <div className={health > 50 ? 'healthy' : 'low-health'}>{health}</div>
}
```

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMap } from '@react-facet/core'

// ✅ GOOD - no re-renders, uses fast-* components
const GoodHealthBar = () => {
  const [healthFacet] = useFacetState(100)

  const className = useFacetMap((health) => (health > 50 ? 'healthy' : 'low-health'), [], [healthFacet])

  return (
    <fast-div className={className}>
      <fast-text text={healthFacet} />
    </fast-div>
  )
}
```

#### ❌ Don't Use for Accessing Values in Callbacks

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap, NO_VALUE } from '@react-facet/core'
import { useCallback } from 'react'

// ❌ BAD - unnecessary re-renders, must handle NO_VALUE
const BadForm = ({ onSubmit }: { onSubmit: (value: string) => void }) => {
  const [valueFacet] = useFacetState('')
  const value = useFacetUnwrap(valueFacet)

  const handleSubmit = useCallback(() => {
    // Must check for NO_VALUE before using!
    if (value !== NO_VALUE) {
      onSubmit(value)
    }
  }, [value, onSubmit])

  return <button onClick={handleSubmit}>Submit</button>
}
```

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetCallback } from '@react-facet/core'

// ✅ GOOD - use useFacetCallback
const GoodForm = ({ onSubmit }: { onSubmit: (value: string) => void }) => {
  const [valueFacet] = useFacetState('')

  const handleSubmit = useFacetCallback(
    (currentValue) => () => {
      onSubmit(currentValue)
    },
    [onSubmit],
    [valueFacet],
  )

  return <button onClick={handleSubmit}>Submit</button>
}
```

### Equality Checks with useFacetUnwrap

For complex data types, provide an equality check function to prevent unnecessary re-renders:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap, shallowObjectEqualityCheck, NO_VALUE } from '@react-facet/core'

const PlayerStats = () => {
  const [playerFacet] = useFacetState({ health: 100, mana: 50 })

  // ✅ Use equality check for objects
  const player = useFacetUnwrap(playerFacet, shallowObjectEqualityCheck)

  // Always check for NO_VALUE before using the value
  if (player === NO_VALUE) {
    return <div>Loading...</div>
  }

  // Component will only re-render when health or mana values actually change
  return (
    <div>
      Health: {player.health}, Mana: {player.mana}
    </div>
  )
}
```

### Handling NO_VALUE

:::caution Critical Requirement
**Always check for `NO_VALUE` before using unwrapped values.** The return type is `T | NO_VALUE`, not just `T`. Failing to check will cause type errors and potential runtime bugs.
:::

Every use of `useFacetUnwrap` requires a `NO_VALUE` check:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetUnwrap, NO_VALUE, Facet } from '@react-facet/core'

const DisplayValue = ({ valueFacet }: { valueFacet: Facet<string> }) => {
  const value = useFacetUnwrap(valueFacet)

  // ✅ Always check before using
  if (value === NO_VALUE) {
    return <div>Loading...</div>
  }

  // Now TypeScript knows value is T, not T | NO_VALUE
  return <div>{value}</div>
}
```

**Common patterns for handling NO_VALUE:**

```tsx twoslash
// @esModuleInterop
import { useFacetUnwrap, NO_VALUE, Facet } from '@react-facet/core'

const numberFacet = {} as Facet<number>
const objectFacet = {} as Facet<{ name: string }>
const arrayFacet = {} as Facet<string[]>

// ---cut---
// Early return pattern
const Component1 = ({ facet }: { facet: Facet<number> }) => {
  const value = useFacetUnwrap(facet)
  if (value === NO_VALUE) return null

  return <div>{value * 2}</div>
}

// Default value pattern
const Component2 = ({ facet }: { facet: Facet<number> }) => {
  const value = useFacetUnwrap(facet)
  const displayValue = value === NO_VALUE ? 0 : value

  return <div>{displayValue}</div>
}

// Conditional logic pattern
const Component3 = ({ facet }: { facet: Facet<number> }) => {
  const value = useFacetUnwrap(facet)

  return <div>{value === NO_VALUE ? <span>Loading...</span> : <span>{value}</span>}</div>
}

// Guard with && operator
const Component4 = ({ facet }: { facet: Facet<string[]> }) => {
  const items = useFacetUnwrap(facet)

  return <div>{items !== NO_VALUE && items.map((item, i) => <div key={i}>{item}</div>)}</div>
}
```

**Remember:** The whole point of React Facet is to avoid React reconciliation. Every use of `useFacetUnwrap` is a step backwards from that goal.

## `useFacetTransition` and `startFacetTransition`

React Facet provides APIs for integrating facet updates with React 18's concurrent rendering features. These allow you to mark facet updates as non-urgent transitions, enabling React to keep the UI responsive during heavy updates.

### `useFacetTransition`

A hook that works analogously to React's `useTransition`, but ensures that any React state changes resulting from facet updates are handled within a React transition.

#### Signature

```typescript
function useFacetTransition(): [boolean, (fn: () => void) => void]
```

**Returns:** A tuple containing:

1. `isPending` - Boolean indicating if a transition is in progress
2. `startTransition` - Function to execute facet updates as a transition

:::note Callback Stability
The `startTransition` function returned by `useFacetTransition` is stable across re-renders and doesn't need to be included in dependency arrays of `useCallback`, `useEffect`, or other hooks.
:::

#### When to Use

Use `useFacetTransition` when:

1. **Heavy facet updates** - Facet changes trigger expensive computations or rendering
2. **Keeping UI responsive** - Need to prioritize user interactions over state updates
3. **Large lists or complex UIs** - Updates affect many components simultaneously
4. **Mixed React state and facets** - Some components use React state alongside facets

#### Basic Usage

The following example keeps input fields responsive while processing updates, during which time it indicates to the user that it is loading via the `isPending` flag:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetTransition } from '@react-facet/core'

const SearchResults = () => {
  const [queryFacet, setQuery] = useFacetState('')
  const [resultsFacet, setResults] = useFacetState<string[]>([])
  const [isPending, startTransition] = useFacetTransition()

  const handleSearch = (newQuery: string) => {
    // Update query immediately (high priority)
    setQuery(newQuery)

    // Update results as a transition (low priority)
    startTransition(() => {
      // Expensive computation or data fetching
      const results = performExpensiveSearch(newQuery)
      setResults(results)
    })
  }

  return (
    <div>
      <input type="text" onChange={(e) => handleSearch(e.target.value)} placeholder="Search..." />
      {isPending && <div>Searching...</div>}
      <fast-div style={{ opacity: isPending ? 0.5 : 1 }}>{/* Results display */}</fast-div>
    </div>
  )
}

const performExpensiveSearch = (query: string): string[] => {
  // Simulate expensive search
  return Array.from({ length: 1000 }, (_, i) => `Result ${i} for ${query}`)
}
```

### `startFacetTransition`

A function API that works analogously to React's `startTransition`, for use outside of components.

#### Signature

```typescript
function startFacetTransition(fn: () => void): void
```

**Parameters:**

- `fn` - Function containing facet updates to execute as a transition

#### When to Use

Use `startFacetTransition` when:

1. **Outside React components** - In utility functions, event handlers, or callbacks
2. **Global state updates** - Updating shared facets from non-React code
3. **One-off transitions** - Don't need the `isPending` state
4. **Event handlers** - Processing events that trigger heavy facet updates

#### Basic Usage

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, startFacetTransition } from '@react-facet/core'

// Utility function outside of React
export const loadDataAsTransition = (setData: (data: string[]) => void, newData: string[]) => {
  startFacetTransition(() => {
    // Heavy update marked as low priority
    setData(newData)
  })
}

// Use in component
const Component = () => {
  const [dataFacet, setData] = useFacetState<string[]>([])

  const handleLoad = () => {
    const data = Array.from({ length: 5000 }, (_, i) => `Item ${i}`)
    loadDataAsTransition(setData, data)
  }

  return <button onClick={handleLoad}>Load Data</button>
}
```

#### In Event Handlers

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, startFacetTransition } from '@react-facet/core'

const BatchProcessor = () => {
  const [statusFacet, setStatus] = useFacetState('Ready')

  const processBatch = (items: string[]) => {
    setStatus('Processing...')

    // Process as transition - won't block UI
    startFacetTransition(() => {
      items.forEach((item) => {
        // Heavy processing per item
        processItem(item)
      })
      setStatus('Complete')
    })
  }

  return (
    <div>
      <button onClick={() => processBatch(generateItems())}>Process Batch</button>
      <fast-text text={statusFacet} />
    </div>
  )
}

const generateItems = () => Array.from({ length: 1000 }, (_, i) => `Item ${i}`)
const processItem = (item: string) => {
  /* heavy processing */
}
```

#### With Shared State

When working with shared state across multiple components, `startFacetTransition` (the function API) is often preferable to `useFacetTransition` (the hook):

**Why use `startFacetTransition` for shared state:**

- **No pending state needed** - Notifications are "fire-and-forget", consumers don't need loading indicators
- **Called from children** - The transition is triggered in child components, not where `isPending` would be available
- **Cleaner API** - No need to expose `isPending` through context if it won't be used
- **Better performance** - Provider doesn't re-render when `isPending` changes

**Comparison:**

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetTransition, startFacetTransition, NO_VALUE } from '@react-facet/core'
import { createContext, useContext } from 'react'
import type { Facet } from '@react-facet/core'

// ❌ Less ideal: Using useFacetTransition in provider causes re-renders
type NotificationContextBad = {
  notificationsFacet: Facet<string[]>
  addNotification: (message: string) => void
  isPending: boolean // Provider re-renders when this changes
}

const NotificationContextBad = createContext<NotificationContextBad | null>(null)

export const NotificationProviderBad = ({ children }: { children: React.ReactNode }) => {
  const [notificationsFacet, setNotifications] = useFacetState<string[]>([])
  const [isPending, startTransition] = useFacetTransition()

  const addNotification = (message: string) => {
    startTransition(() => {
      setNotifications((current) => (current !== NO_VALUE ? [...current, message] : [message]))
    })
  }

  // ⚠️ Provider re-renders on every isPending change, even if not used
  return (
    <NotificationContextBad.Provider value={{ notificationsFacet, addNotification, isPending }}>
      {children}
    </NotificationContextBad.Provider>
  )
}

// ✅ Better: Using startFacetTransition avoids unnecessary re-renders
type NotificationContextGood = {
  notificationsFacet: Facet<string[]>
  addNotification: (message: string) => void
}

const NotificationContextGood = createContext<NotificationContextGood | null>(null)

export const NotificationProviderGood = ({ children }: { children: React.ReactNode }) => {
  const [notificationsFacet, setNotifications] = useFacetState<string[]>([])

  const addNotification = (message: string) => {
    // ✅ Use startFacetTransition: no isPending state, no re-renders
    startFacetTransition(() => {
      setNotifications((current) => (current !== NO_VALUE ? [...current, message] : [message]))
    })
  }

  return (
    <NotificationContextGood.Provider value={{ notificationsFacet, addNotification }}>
      {children}
    </NotificationContextGood.Provider>
  )
}
```

### How Transitions Work with Facets

When you use `useFacetTransition` or `startFacetTransition`:

1. **Batching** - Facet updates are batched together using `batchTransition` internally (a special variant that ensures all tasks run at the end of the transition, maintaining separate task queues for transition and non-transition updates)
2. **Priority** - React treats these updates as low priority (interruptible)
3. **Concurrent rendering** - React can pause and resume the work
4. **User responsiveness** - High-priority updates (like user input) can interrupt transitions
5. **Task Queue Separation** - Transition tasks are queued separately from regular tasks, ensuring proper priority ordering and preventing transition updates from blocking urgent updates

#### Nested Transitions

Transitions can be nested within each other:

- Inner transitions inherit the transition context from outer transitions
- Task queues are maintained separately for transition and non-transition contexts
- Tasks flush when the outermost transition completes
- This allows for complex update patterns while maintaining UI responsiveness

```tsx twoslash
// @esModuleInterop
import { useFacetState, startFacetTransition } from '@react-facet/core'

const ComplexUpdate = () => {
  const [dataFacet, setData] = useFacetState<string[]>([])

  const handleUpdate = () => {
    // Outer transition
    startFacetTransition(() => {
      const partialData = processFirstBatch()
      setData(partialData)

      // Inner transition - will complete when outer completes
      startFacetTransition(() => {
        const finalData = processSecondBatch()
        setData(finalData)
      })
    })
  }

  return <button onClick={handleUpdate}>Update</button>
}

const processFirstBatch = () => ['item1', 'item2']
const processSecondBatch = () => ['item1', 'item2', 'item3']
```

#### Error Handling

If a facet update throws an error within a transition, the behavior is:

- All remaining queued tasks in the current batch are cancelled
- The task queue is cleared to prevent cascading errors
- The error is re-thrown for you to handle

Always ensure your facet updates handle errors appropriately:

```tsx twoslash
// @esModuleInterop
import { useFacetState, startFacetTransition } from '@react-facet/core'

const SafeUpdate = () => {
  const [dataFacet, setData] = useFacetState<string[]>([])
  const [errorFacet, setError] = useFacetState<string | null>(null)

  const handleLoad = () => {
    startFacetTransition(() => {
      try {
        const result = riskyComputation()
        setData(result)
        setError(null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    })
  }

  return <button onClick={handleLoad}>Load Data</button>
}

const riskyComputation = (): string[] => {
  if (Math.random() > 0.5) throw new Error('Computation failed')
  return ['data']
}
```

### Performance Benefits

**Without transitions:**

```tsx
// Heavy update blocks the UI
setData(expensiveComputation())
// User interactions are delayed until this completes
```

**With transitions:**

```tsx
startTransition(() => {
  setData(expensiveComputation())
})
// User interactions remain responsive
// Heavy update happens in the background
```

### Best Practices

1. **Don't transition urgent updates** - Keep critical UI feedback (like input fields) outside transitions
2. **Show pending state** - Use `isPending` to indicate background work when using `useFacetTransition`
3. **Handle errors explicitly** - Always wrap risky computations in try-catch blocks within transitions
4. **Combine with useFacetMemo** - Cache expensive derivations within transitions for better performance
5. **Test on slower devices** - Transitions shine on lower-end hardware
6. **Use `startFacetTransition` for shared state** - Avoid unnecessary provider re-renders when `isPending` isn't needed
7. **Don't include `startTransition` in dependency arrays** - The callback from `useFacetTransition` is stable

### Comparison: Hook vs Function API

| Feature               | `useFacetTransition`                       | `startFacetTransition`                     |
| --------------------- | ------------------------------------------ | ------------------------------------------ |
| Usage location        | Inside React components                    | Anywhere (components or utils)             |
| Returns pending state | Yes (`isPending`)                          | No                                         |
| Re-renders on pending | Yes                                        | N/A                                        |
| Callback stability    | Stable (safe in deps arrays)               | N/A                                        |
| Best for              | Interactive UI with feedback               | Fire-and-forget updates                    |
| Example use case      | Search with loading spinner                | Background data refresh                    |
| Error handling        | Errors cancel remaining tasks and re-throw | Errors cancel remaining tasks and re-throw |

:::tip Performance Tip
Use transitions for updates that affect large portions of your UI or trigger expensive computations. This keeps your app feeling snappy even during heavy updates.
:::
