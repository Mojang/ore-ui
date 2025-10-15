---
sidebar_position: 2
---

# Hooks

React Facet provides a comprehensive set of hooks for working with facets. These hooks follow React's naming conventions where possible, making them familiar and easy to understand. All facet hooks support the dual dependency array pattern: the first array for non-facet dependencies (props, local variables) and the second array for facet dependencies.

## Quick Reference

| Hook                                            | Purpose                                           | React Equivalent  |
| ----------------------------------------------- | ------------------------------------------------- | ----------------- |
| [`useFacetState`](#usefacetstate)               | Create local facet state                          | `useState`        |
| [`useFacetMap`](#usefacetmap)                   | Derive facet (lightweight, default choice)        | `useMemo`         |
| [`useFacetMemo`](#usefacetmemo)                 | Derive facet (cached, for expensive computations) | `useMemo`         |
| [`useFacetCallback`](#usefacetcallback)         | Create callback that depends on facets            | `useCallback`     |
| [`useFacetEffect`](#usefaceteffect)             | Perform side effects when facets change           | `useEffect`       |
| [`useFacetLayoutEffect`](#usefacetlayouteffect) | Synchronous side effects when facets change       | `useLayoutEffect` |
| [`useFacetRef`](#usefacetref)                   | Create ref that tracks facet value                | `useRef`          |
| [`useFacetWrap`](#usefacetwrap)                 | Convert value or facet to facet                   | -                 |
| [`useFacetUnwrap`](#usefacetunwrap)             | ⚠️ Extract plain value (causes re-renders)        | -                 |

## `useFacetState`

To define facets within React components, there is a main hook `useFacetState` that provides a very familiar API when compared with React's `useState`.

Returns a `[facet, setFacet]` pair. Like React’s `useState`, but with a Facet instead of a value.

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
