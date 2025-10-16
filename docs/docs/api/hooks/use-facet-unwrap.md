---
sidebar_position: 10
---

# useFacetUnwrap

:::danger Performance Warning
**This hook will negate all the performance benefits of using Facets for state management.**

Every update to the facet will trigger a full React re-render of the component, defeating the primary purpose of React Facet. Use this hook sparingly and only when absolutely necessary.
:::

The `useFacetUnwrap` hook extracts the plain value from a Facet and treats it as regular React component state. This creates a subscription that triggers component re-renders whenever the facet value changes.

## Signature

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

## When to Use

`useFacetUnwrap` should only be used in these specific scenarios:

### 1. Interfacing with Non-Facet-Aware Components

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

### 2. Complex Conditional Logic (Use Sparingly)

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

## When NOT to Use

:::caution Common Anti-Patterns
These patterns should be avoided - use the suggested alternatives instead.
:::

### ❌ Don't Use for Simple Conditional Rendering

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

### ❌ Don't Use for Binding to DOM

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

### ❌ Don't Use for Accessing Values in Callbacks

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

## Using Equality Checks

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

## Handling NO_VALUE

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

## See Also

- [Mount](../mount-components#mount) - For conditional mounting without unwrapping
- [useFacetCallback](./use-facet-callback) - For accessing facet values in callbacks
- [Equality Checks](../equality-checks) - Available equality check functions
