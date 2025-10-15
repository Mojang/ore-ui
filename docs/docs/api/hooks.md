---
sidebar_position: 2
---

# Hooks

The API of the hooks used to define, manipulate and consume facets is modelled after the API of the standard React Hooks; similarly named hooks have similar functionalities.

This is done to make it easier to understand the purpose of each hook, but it is also because they are very similar to the default React Hooks; they just happen to support `Facet`s as dependencies, alongside regular props.

There are only three hooks that have no equivalence in React:

- [`useFacetMap`](#usefacetmap) is used to derive a `Facet` from another(s)
- [`useFacetWrap`](#usefacetwrap) is used to encapsulate a regular value in a `Facet`
- [`useFacetUnwrap`](#usefacetunwrap) is used to get the plain value from inside a `Facet`

### `useFacetState`

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

The `useFacetCallback` hook is similar to React’s `useCallback` in that it allows you to create a memoized callback that will only be updated if some of the explicit dependencies change. On top of that, `useFacetCallback` allows you to pass one or more Facets and get the current values of those facets in the callback body.

Like `useCallback`, `useFacetCallback` will update the reference if a value in the dependency array change. However, it will not update the reference if a Facet change.

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

## `useFacetLayoutEffect`

Much like React offers a `useLayoutEffect` as a complement to `useEffect`, so too does `react-facet` offer a `useFacetLayoutEffect`. It takes the exact same input as `useFacetEffect` and has an identical implementation, the sole exception being that it uses React's underlying `useLayoutEffect` instead that fires synchronously after all DOM mutations.

## `useFacetMap`

The `useFacetMap` hook allows you to do a sort of "inline selector" to narrow down the data from a facet inside a component’s body.

This is useful to be able to combine React component props with facet data and to prepare the facet to be passed down as a prop / style into a `fast-*` component.

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

TODO

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

### Equality Checks

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

### Migration Strategy

This hook exists primarily to ease migration of existing code. The recommended approach:

1. **Immediate**: Use `useFacetUnwrap` to get existing components working with facets
2. **Short-term**: Identify components that re-render frequently
3. **Long-term**: Refactor high-frequency components to use `fast-*` components and other facet hooks
4. **Goal**: Minimize or eliminate `useFacetUnwrap` usage in performance-critical paths

### Performance Impact Summary

| Pattern                        | Re-renders      | Performance  |
| ------------------------------ | --------------- | ------------ |
| `useFacetUnwrap` + regular DOM | ✅ Every update | ❌ Poor      |
| `fast-*` components + facets   | ❌ None         | ✅ Excellent |
| `Mount` / `With` components    | ✅ Scoped only  | ✅ Good      |

**Remember:** The whole point of React Facet is to avoid React reconciliation. Every use of `useFacetUnwrap` is a step backwards from that goal.
