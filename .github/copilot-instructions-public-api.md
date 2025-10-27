# React Facet Public API Guide

> **Note**: This is a streamlined public API reference for React Facet users. For the comprehensive internal guide (including repository structure, testing patterns, and contributor workflows), see [`copilot-instructions.md`](./copilot-instructions.md).

## Overview

**React Facet** (`@react-facet`) is an observable-based state management system designed for performant game UIs built in React. It bypasses React reconciliation for leaf node updates (styles, text content, attributes) to achieve game-level performance while maintaining React's developer experience.

### Core Philosophy

React Facet is designed for:

- **Game UI development** using embedded web technologies (Coherent Labs' Gameface)
- **Performance-critical applications** with fixed frame budgets
- **Frequent UI updates** without triggering React re-renders

---

## ⚠️ Critical Rules (Must Follow)

### 1. 🚨 Always Check for NO_VALUE After useFacetUnwrap

`useFacetUnwrap` and setter callbacks return `T | NO_VALUE`, not just `T`. Always check before using:

```typescript
// ❌ WRONG - TypeScript ERROR!
const value = useFacetUnwrap(numberFacet)
const doubled = value * 2 // Error: NO_VALUE is not a number

// ✅ CORRECT - Check for NO_VALUE first
const value = useFacetUnwrap(numberFacet)
if (value !== NO_VALUE) {
  const doubled = value * 2
}

// ✅ CORRECT - In setter callbacks
const [items, setItems] = useFacetState<string[]>([])
setItems((current) => (current !== NO_VALUE ? [...current, 'new'] : ['new']))
```

### 2. 🚨 Minimize useFacetUnwrap Usage

`useFacetUnwrap` causes React re-renders, defeating the entire performance benefit of facets:

```typescript
// ❌ WRONG - Causes re-renders!
const value = useFacetUnwrap(facet)
return <div>{value}</div>

// ✅ CORRECT - Use fast-text, no re-renders
return <fast-text text={facet} />

// ❌ WRONG - Unwrapping for conditional rendering
const isVisible = useFacetUnwrap(isVisibleFacet)
if (isVisible !== NO_VALUE && !isVisible) return null

// ✅ CORRECT - Use Mount component
<Mount when={isVisibleFacet}>
  <ExpensiveComponent />
</Mount>
```

### 3. 🚨 Two Dependency Arrays Pattern

Facet hooks use TWO dependency arrays:

1. **First array**: Non-facet dependencies (props, local vars, functions)
2. **Second array**: Facet dependencies

```typescript
// ❌ WRONG - Missing multiplier in first array
const multiplier = props.multiplier
const result = useFacetMap(
  (value) => value * multiplier,
  [], // ❌ Missing: [multiplier]
  [valueFacet],
)

// ✅ CORRECT - Include all non-facet dependencies
const result = useFacetMap(
  (value) => value * multiplier,
  [multiplier], // ✅ Non-facet dependencies
  [valueFacet], // ✅ Facet dependencies
)
```

---

## Core Concepts

### What is a Facet?

A **Facet** is an observable state container that updates over time without triggering React re-renders.

```typescript
interface Facet<T> {
  get: () => T | NO_VALUE
  observe: (listener: (value: T) => void) => Unsubscribe
}

interface WritableFacet<T> extends Facet<T> {
  set: (value: T) => void
  setWithCallback: (callback: (previousValue: T | NO_VALUE) => T | NO_VALUE) => void
}
```

### Key Characteristics

- **Observable**: Components subscribe to facets and update when values change
- **Composable**: Derive facets from other facets using transformation functions
- **Performant**: Updates bypass React reconciliation with `fast-*` components
- **Type-safe**: Full TypeScript support with type inference

---

## Public API Reference

### Package: `@react-facet/core`

#### Creating Facets

**`useFacetState<T>(initialValue: T): [Facet<T>, Setter<T>]`**

Creates local component state as a facet. The facet reference is stable across re-renders.

```typescript
const [counterFacet, setCounter] = useFacetState(0)

// Direct value
setCounter(42)

// Callback form - ALWAYS check for NO_VALUE
setCounter((current) => (current !== NO_VALUE ? current + 1 : 1))
```

**`useFacetWrap<T>(value: T | Facet<T>): Facet<T>`**

Wraps a value or facet prop into a facet. Creates new facet instance when value changes.

```typescript
type Props = {
  count: number | Facet<number> // Accept either value or facet
}

const Component = ({ count }: Props) => {
  const countFacet = useFacetWrap(count)
  return <fast-text text={countFacet} />
}
```

**`useFacetWrapMemo<T>(value: T | Facet<T>, equalityCheck?): Facet<T>`**

Like `useFacetWrap` but maintains stable facet reference. Best for frequently changing props.

```typescript
// Stable facet reference even when prop changes
const stableFacet = useFacetWrapMemo(propValue)
```

**When to use which:**

- **`useFacetWrap`**: Default choice, simpler implementation
- **`useFacetWrapMemo`**: When facet reference stability matters or props change frequently

#### Deriving Facets

**`useFacetMap<M>(fn, dependencies, facets, equalityCheck?): Facet<M>`**

Transforms facet values. Lightweight, best for simple transformations.

```typescript
// Single facet
const doubled = useFacetMap((n) => n * 2, [], [numberFacet])

// Multiple facets
const fullName = useFacetMap((first, last) => `${first} ${last}`, [], [firstNameFacet, lastNameFacet])

// With local dependencies
const scaled = useFacetMap(
  (value) => value * scale,
  [scale], // Non-facet dependency
  [valueFacet],
)

// With equality check for objects
const combined = useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB], shallowObjectEqualityCheck)
```

**`useFacetMemo<M>(fn, dependencies, facets, equalityCheck?): Facet<M>`**

Like `useFacetMap` but caches result across all subscribers. Use for expensive computations or many subscribers.

```typescript
// Expensive computation cached for all subscribers
const expensive = useFacetMemo((data) => heavyCalculation(data), [], [dataFacet])
```

**When to use which:**

- **`useFacetMap`**: Default choice (lightweight, fast initialization)
- **`useFacetMemo`**: When you have 3+ subscribers OR expensive computations

#### Side Effects

**`useFacetEffect(effect, dependencies, facets): void`**

Runs side effects when facet values change. Like `useEffect` but for facets.

```typescript
useFacetEffect(
  (health) => {
    if (health < 20) {
      playWarningSound()
    }
  },
  [],
  [healthFacet],
)
```

**`useFacetLayoutEffect(effect, dependencies, facets): void`**

Synchronous version of `useFacetEffect`. Like `useLayoutEffect` but for facets.

```typescript
useFacetLayoutEffect(
  (dimensions) => {
    measureAndUpdateLayout(dimensions)
  },
  [],
  [dimensionsFacet],
)
```

#### Callbacks

**`useFacetCallback<M>(callback, dependencies, facets, defaultReturn?): (...args) => M`**

Creates callbacks that depend on facet values. The callback stays stable while accessing current facet values.

```typescript
const handleSubmit = useFacetCallback(
  (username, password) => () => {
    submitLoginForm(username, password)
  },
  [],
  [usernameFacet, passwordFacet],
)

// With parameters
const selectItem = useFacetCallback(
  (selectedId) => (itemId: string) => {
    setSelectedId(selectedId === itemId ? null : itemId)
  },
  [],
  [selectedIdFacet],
)
```

**When NOT to use:** If you only need to update facet state, use regular callback with setter's callback form instead.

#### Unwrapping (Use Sparingly!)

**`useFacetUnwrap<T>(facet: Facet<T>): T | NO_VALUE`**

Converts facet to regular React state. **WARNING: Causes re-renders!**

```typescript
// ⚠️ Only use when necessary (e.g., third-party components)
const value = useFacetUnwrap(facet)

// ALWAYS check for NO_VALUE before using
if (value !== NO_VALUE) {
  return <ThirdPartyComponent value={value} />
}
```

**When to use:**

- Passing to non-facet-aware third-party components (though refactoring is preferred)
- Last resort only - prefer `fast-*` components or `Mount`/`With` for conditional rendering

#### Transitions (React 18+)

**`useFacetTransition(): [boolean, (fn: () => void) => void]`**

Marks facet updates as low-priority transitions. Keeps UI responsive during expensive operations.

```typescript
const [isPending, startTransition] = useFacetTransition()

const handleHeavyUpdate = () => {
  setInputFacet(newValue) // High priority - immediate

  startTransition(() => {
    // Low priority - can be interrupted
    const results = expensiveComputation(newValue)
    setResultsFacet(results)
  })
}

return (
  <div>
    {isPending && <div>Processing...</div>}
    <fast-input value={inputFacet} />
  </div>
)
```

**`startFacetTransition(fn: () => void): void`**

Function API for transitions. Use outside components or when you don't need pending state.

```typescript
// In utility functions
export const loadData = (setData: (data: string[]) => void, newData: string[]) => {
  startFacetTransition(() => {
    setData(newData)
  })
}
```

**Key characteristics:**

- The `startTransition` callback from `useFacetTransition` is **stable** - don't include in dependency arrays
- Always wrap risky computations in try-catch blocks
- Transitions can be nested

#### Other Utilities

**`useFacetRef<T>(facet: Facet<T>): RefObject<T>`**

Creates a ref that updates with facet value. Useful for accessing facet values in imperative code.

```typescript
const countRef = useFacetRef(countFacet)
// Access current value: countRef.current
```

**`useFacetReducer<S, A>(reducer, initialState, equalityCheck?): [Facet<S>, Dispatch<A>]`** - **NOT RECOMMENDED**

Parallel to React's `useReducer`, but returns a facet as the value. This hook is rarely needed in practice - prefer `useFacetState` with the setter's callback form instead.

```typescript
// ⚠️ NOT RECOMMENDED - Use useFacetState instead
type State = { count: number }
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' }

const reducer = (state: Option<State>, action: Action): Option<State> => {
  if (state === NO_VALUE) return { count: 0 }

  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
  }
}

const [stateFacet, dispatch] = useFacetReducer(reducer, { count: 0 })

// Usage
dispatch({ type: 'increment' })
```

**`useFacetPropSetter<T, Prop>(facet: WritableFacet<T>, prop: Prop): (value: T[Prop]) => void`** - **NOT RECOMMENDED**

Returns a setter function for a specific property of a facet object. In practice, using the setter's callback form is more straightforward.

```typescript
// ⚠️ NOT RECOMMENDED - Use setter callback form instead
type FormData = {
  username: string
  email: string
}

const [formFacet, setForm] = useFacetState<FormData>({
  username: '',
  email: '',
})

// Create setters for individual properties
const setUsername = useFacetPropSetter(formFacet, 'username')
const setEmail = useFacetPropSetter(formFacet, 'email')

// Use in components
<input onChange={(e) => setUsername(e.target.value)} />
<input onChange={(e) => setEmail(e.target.value)} />

// ✅ BETTER - Use setter callback form directly
<input onChange={(e) => setForm(current =>
  current !== NO_VALUE ? { ...current, username: e.target.value } : { username: e.target.value, email: '' }
)} />
```

**`createFacetContext<T>(): Context<Facet<T>>`**

Creates React context for facets.

```typescript
const PlayerContext = createFacetContext<PlayerData>()

// Provider
<PlayerContext.Provider value={playerFacet}>
  <GameUI />
</PlayerContext.Provider>

// Consumer
const playerFacet = useContext(PlayerContext)
```

#### Advanced (Use with Caution)

**`createFacet<T>({ initialValue, startSubscription, equalityCheck? }): WritableFacet<T>`**

Low-level facet creation. **Primarily for testing** - use `useFacetState` or `useFacetWrap` in components.

```typescript
// Testing/mocking only
const mockFacet = createFacet({
  initialValue: 'test-value',
  startSubscription: (update) => {
    // Custom subscription logic
    return () => {} // cleanup
  },
})
```

**`createStaticFacet<T>(value: T): Facet<T>`**

Creates a facet that never changes. Useful for static values that need facet interface.

**`createReadOnlyFacet<T>(facet: Facet<T>): Facet<T>`**

Creates a read-only view of a writable facet.

#### Components

**`<Mount when={facet}>{children}</Mount>`**

Conditionally mount children based on facet value. **Use this instead of `useFacetUnwrap` for conditional rendering.**

```typescript
<Mount when={isVisibleFacet}>
  <ExpensiveComponent />
</Mount>
```

**`<Map array={arrayFacet}>{(itemFacet, index) => <Item />}</Map>`**

Renders list from array facet. Each item gets its own facet.

```typescript
;<Map array={itemsFacet}>{(itemFacet, index) => <ItemRow key={index} itemFacet={itemFacet} />}</Map>

// Separate component to use hooks (Rules of Hooks)
const ItemRow = ({ itemFacet }: { itemFacet: Facet<Item> }) => {
  const nameFacet = useFacetMap((item) => item.name, [], [itemFacet])
  return <fast-text text={nameFacet} />
}
```

**`<With facet={facet}>{(value) => <div>{value}</div>}</With>`**

Conditional rendering with access to unwrapped value.

```typescript
<With facet={selectedIdFacet}>{(selectedId) => selectedId && <div>Selected: {selectedId}</div>}</With>
```

#### Equality Checks

```typescript
import {
  strictEqualityCheck, // For primitives & functions (type-safe)
  shallowObjectEqualityCheck, // For objects with primitive values
  shallowArrayEqualityCheck, // For arrays of primitives
  defaultEqualityCheck, // Used automatically (performance optimized)
} from '@react-facet/core'
```

**Best practices:**

- For primitives: Omit the equality check (uses optimized `defaultEqualityCheck`)
- For objects: Use `shallowObjectEqualityCheck`
- For arrays: Use `shallowArrayEqualityCheck`
- For type safety with primitives: Use `strictEqualityCheck`

**Example:**

```typescript
// Objects - always use equality check
const obj = useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB], shallowObjectEqualityCheck)

// Arrays - always use equality check
const arr = useFacetMap((a, b) => [a, b], [], [facetA, facetB], shallowArrayEqualityCheck)

// Primitives - no need (optimized by default)
const doubled = useFacetMap((x) => x * 2, [], [xFacet])
```

#### Special Values & Types

```typescript
import { NO_VALUE } from '@react-facet/core'

type Facet<T>
type WritableFacet<T>
type FacetProp<T> = T | Facet<T>
type Option<T> = T | NO_VALUE
type Setter<V> = (value: V | ((previousValue: Option<V>) => Option<V>)) => void
```

**NO_VALUE Retention Behavior:**

When a mapping function or setter callback returns `NO_VALUE`, the facet **retains its previous value** (doesn't notify listeners).

```typescript
// Clamping - stops updates at threshold
const clamped = useFacetMap((count) => (count < 5 ? count : NO_VALUE), [], [countFacet])
// Shows: 0, 1, 2, 3, 4, 4, 4... (stuck at 4)

// Conditional updates - prevent state changes
setCount((current) => {
  if (current === NO_VALUE) return 0
  if (current >= 5) return NO_VALUE // Retains value 5
  return current + 1
})
```

---

### Package: `@react-facet/dom-fiber`

Custom React renderer that natively understands facets.

#### Mounting

**`createRoot(container: HTMLElement): { render, unmount }`**

Creates a root for rendering React Facet components. Drop-in replacement for `react-dom`.

```typescript
import { createRoot } from '@react-facet/dom-fiber'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// Later
root.unmount()
```

#### fast-\* Components

**Use `fast-*` components to bind facets to DOM properties without triggering reconciliation.**

Available components:

- **HTML**: `fast-div`, `fast-span`, `fast-p`, `fast-a`, `fast-img`, `fast-input`, `fast-textarea`, `fast-text`
- **SVG**: `fast-svg`, `fast-circle`, `fast-ellipse`, `fast-line`, `fast-path`, `fast-rect`, `fast-foreignObject`, `fast-use`, `fast-polyline`, `fast-polygon`, `fast-linearGradient`, `fast-radialGradient`, `fast-stop`, `fast-svg-text`, `fast-pattern`

**Examples:**

```typescript
// Mix facets and static values
<fast-div className={classFacet} id="static-id">
  <fast-text text={messageFacet} />
  <fast-input value={inputFacet} />
</fast-div>

// Regular HTML for static structure
<div className="container">
  <h1>Static Title</h1>
  <fast-text text={dynamicFacet} />
</div>
```

**When to use:**

- ✅ Use `fast-*` when binding facet values to DOM properties
- ✅ Use regular HTML for static content
- ✅ Mix both as needed

**Gameface Optimizations:**

Numeric CSS properties (faster than strings in Gameface):

```typescript
<fast-div style={{ widthPX: 100, heightVH: 50 }}>{/* Properties ending in PX, VH, VW accept numbers */}</fast-div>
```

---

### Package: `@react-facet/shared-facet`

Interface layer for game engine communication (Gameface integration).

**`useSharedFacet(key: string, defaultValue?: T): [Facet<T>, (value: T) => void]`**

Creates a facet synchronized with game engine state.

**`SharedFacetContext`**

Context for shared facet provider configuration.

---

## Common Patterns

### Creating State

```typescript
// Local component state
const [stateFacet, setState] = useFacetState(initialValue)

// From props (flexible - accepts value or facet)
const facet = useFacetWrap(propValue)

// From context
const sharedFacet = useContext(DataContext)
```

### Deriving State

```typescript
// Simple transformation
const upper = useFacetMap((s) => s.toUpperCase(), [], [stringFacet])

// Multiple facets
const full = useFacetMap((first, last) => `${first} ${last}`, [], [firstFacet, lastFacet])

// With local variables
const scaled = useFacetMap((value) => value * multiplier, [multiplier], [valueFacet])

// Expensive computation
const result = useFacetMemo((data) => heavyCalculation(data), [], [dataFacet])
```

### Rendering

```typescript
// Direct facet binding - NO reconciliation
<fast-text text={messageFacet} />
<fast-div className={classFacet}>
  <fast-input value={inputFacet} />
</fast-div>

// Conditional rendering
<Mount when={isVisibleFacet}>
  <ExpensiveComponent />
</Mount>

// List rendering
<Map array={itemsFacet}>
  {(itemFacet, index) => <Item key={index} itemFacet={itemFacet} />}
</Map>
```

### Side Effects Pattern

```typescript
useFacetEffect(
  (value) => {
    // Side effect
    return () => {
      // Cleanup (optional)
    }
  },
  [],
  [valueFacet],
)
```

### Event Handlers

```typescript
// Regular callback with setter's callback form
const addItem = (newItem: string) => {
  setItems((current) => (current !== NO_VALUE ? [...current, newItem] : [newItem]))
}

// When you need to READ facet values (not just update)
const handleSubmit = useFacetCallback(
  (username, password) => () => {
    submitLoginForm(username, password)
  },
  [],
  [usernameFacet, passwordFacet],
)
```

---

## Common Pitfalls

### 1. Forgetting NO_VALUE Checks

```typescript
// ❌ WRONG
const value = useFacetUnwrap(facet)
const doubled = value * 2

// ✅ CORRECT
const value = useFacetUnwrap(facet)
if (value !== NO_VALUE) {
  const doubled = value * 2
}

// ❌ WRONG - In setter callbacks
setItems((current) => [...current, newItem])

// ✅ CORRECT
setItems((current) => (current !== NO_VALUE ? [...current, newItem] : [newItem]))
```

### 2. Overusing useFacetUnwrap

```typescript
// ❌ WRONG - Causes re-renders!
const value = useFacetUnwrap(facet)
return <div>{value}</div>

// ✅ CORRECT
return <fast-text text={facet} />
```

### 3. Missing Dependencies

```typescript
// ❌ WRONG
const multiplier = props.multiplier
const result = useFacetMap(
  (value) => value * multiplier,
  [], // Missing [multiplier]
  [valueFacet],
)

// ✅ CORRECT
const result = useFacetMap((value) => value * multiplier, [multiplier], [valueFacet])
```

### 4. Wrong Equality Checks

```typescript
// ❌ WRONG - Reference equality for objects
const obj = useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB])

// ✅ CORRECT
const obj = useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB], shallowObjectEqualityCheck)
```

### 5. Using fast-\* for Static Content

```typescript
// ❌ WRONG - Unnecessary fast-div
<fast-div className="static">
  <fast-span>Static text</fast-span>
</fast-div>

// ✅ CORRECT - Use regular HTML for static content
<div className="static">
  <span>Static text</span>
</div>

// ✅ CORRECT - Use fast-* only for facet bindings
<fast-div className={dynamicClassFacet}>
  <fast-text text={dynamicTextFacet} />
</fast-div>
```

### 6. Hooks in Conditionals, Loops, or Nested Functions

```typescript
// ❌ WRONG - Hook in Map callback
;<Map array={itemsFacet}>
  {(itemFacet, index) => <fast-text text={useFacetMap((item) => item.name, [], [itemFacet])} />}
</Map>

// ✅ CORRECT - Separate component
const ItemRow = ({ itemFacet }) => {
  const nameFacet = useFacetMap((item) => item.name, [], [itemFacet])
  return <fast-text text={nameFacet} />
}

;<Map array={itemsFacet}>{(itemFacet, index) => <ItemRow key={index} itemFacet={itemFacet} />}</Map>
```

---

## Best Practices

### Naming Conventions

```typescript
// Facet variables: suffix with "Facet"
const counterFacet = useFacetState(0)
const playerHealthFacet = useContext(PlayerContext)

// Setters: prefix with "set"
const [stateFacet, setState] = useFacetState(0)

// Derived facets: descriptive names
const healthBarClass = useFacetMap(...)
const formattedDate = useFacetMap(...)
```

### Facet Reference Stability

- **`useFacetState`**: Facet reference is **stable** (never changes)
- **`useFacetMap`/`useFacetMemo`**: Create **new facet** when dependencies change
- **`useFacetWrap`**: Creates **new facet** when wrapped value changes
- **`useFacetWrapMemo`**: Maintains **stable facet**, updates value internally

### Performance Guidelines

**Default to lightweight options:**

- Use `useFacetMap` by default (fast initialization)
- Switch to `useFacetMemo` only when profiling shows bottleneck (3+ subscribers or expensive computation)
- Use `useFacetWrap` by default
- Switch to `useFacetWrapMemo` only when facet reference stability matters

**Minimize re-renders:**

- Avoid `useFacetUnwrap` except as last resort
- Use `Mount` for conditional rendering, not unwrapping
- Use `fast-*` components for all dynamic properties

**Use transitions for heavy updates:**

- Wrap expensive computations in `useFacetTransition` or `startFacetTransition`
- Keep input fields responsive by making them high-priority
- Always add try-catch blocks around risky computations in transitions

### Type Safety

```typescript
// Define types for facet data
type PlayerData = {
  health: number
  name: string
}

const [playerFacet, setPlayer] = useFacetState<PlayerData>({
  health: 100,
  name: 'Steve',
})

// Type inference works for simple cases
const [count, setCount] = useFacetState(0) // inferred as number
```

---

## Quick Reference

### Most Common Hooks

```typescript
// State
useFacetState<T>(initialValue): [Facet<T>, Setter<T>]
useFacetWrap<T>(value: T | Facet<T>): Facet<T>
useFacetWrapMemo<T>(value: T | Facet<T>): Facet<T>

// Derivation
useFacetMap<M>(fn, deps, facets, equalityCheck?): Facet<M>
useFacetMemo<M>(fn, deps, facets, equalityCheck?): Facet<M>

// Side effects
useFacetEffect(effect, deps, facets): void
useFacetLayoutEffect(effect, deps, facets): void

// Callbacks
useFacetCallback<M>(callback, deps, facets): (...args) => M

// Utilities
useFacetUnwrap<T>(facet): T | NO_VALUE  // ⚠️ Use sparingly!
useFacetRef<T>(facet): RefObject<T>

// Advanced (NOT RECOMMENDED)
useFacetReducer<S, A>(reducer, initialState, equalityCheck?): [Facet<S>, Dispatch<A>]  // Not recommended
useFacetPropSetter<T, Prop>(facet, prop): (value: T[Prop]) => void  // Not recommended

// Transitions
useFacetTransition(): [boolean, (fn: () => void) => void]
startFacetTransition(fn: () => void): void
```

### Core Components

```typescript
<Mount when={facet}><Child /></Mount>
<Map array={arrayFacet}>{(itemFacet, index) => <Item />}</Map>
<With facet={facet}>{(value) => <div>{value}</div>}</With>
```

### Equality Check Functions

```typescript
import {
  strictEqualityCheck,
  shallowObjectEqualityCheck,
  shallowArrayEqualityCheck,
  defaultEqualityCheck,
} from '@react-facet/core'
```

---

## Complete Examples

### Example 1: Counter with Derived State

```typescript
import { useFacetState, useFacetMap } from '@react-facet/core'
import { createRoot } from '@react-facet/dom-fiber'

const Counter = () => {
  const [countFacet, setCount] = useFacetState(0)

  const doubledFacet = useFacetMap((count) => count * 2, [], [countFacet])

  const statusFacet = useFacetMap((count) => (count > 10 ? 'high' : 'low'), [], [countFacet])

  return (
    <fast-div>
      <fast-text text={countFacet} />
      <fast-text text={doubledFacet} />
      <fast-div className={statusFacet}>
        <button onClick={() => setCount((c) => (c !== NO_VALUE ? c + 1 : 1))}>Increment</button>
      </fast-div>
    </fast-div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<Counter />)
```

### Example 2: Form with Validation

```typescript
import { useFacetState, useFacetMap, useFacetCallback } from '@react-facet/core'
import { shallowObjectEqualityCheck } from '@react-facet/core'

type FormData = {
  username: string
  email: string
}

const Form = () => {
  const [formFacet, setForm] = useFacetState<FormData>({
    username: '',
    email: '',
  })

  const isValidFacet = useFacetMap((data) => data.username.length >= 3 && data.email.includes('@'), [], [formFacet])

  const updateUsername = (username: string) => {
    setForm((current) => (current !== NO_VALUE ? { ...current, username } : { username, email: '' }))
  }

  const handleSubmit = useFacetCallback(
    (data) => () => {
      console.log('Submitting:', data)
    },
    [],
    [formFacet],
  )

  const isValid = useFacetUnwrap(isValidFacet)

  return (
    <div>
      <input type="text" onChange={(e) => updateUsername(e.target.value)} placeholder="Username" />
      <button onClick={handleSubmit} disabled={isValid === NO_VALUE || !isValid}>
        Submit
      </button>
    </div>
  )
}
```

### Example 3: List with Conditional Rendering

```typescript
import { useFacetState, useFacetMap, NO_VALUE } from '@react-facet/core'
import { Map, Mount } from '@react-facet/core'
import { shallowArrayEqualityCheck } from '@react-facet/core'

type Item = {
  id: string
  name: string
}

const ItemList = () => {
  const [itemsFacet, setItems] = useFacetState<Item[]>([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ])

  const hasItemsFacet = useFacetMap((items) => items.length > 0, [], [itemsFacet])

  const addItem = () => {
    setItems((current) =>
      current !== NO_VALUE
        ? [...current, { id: Date.now().toString(), name: 'New Item' }]
        : [{ id: Date.now().toString(), name: 'New Item' }],
    )
  }

  return (
    <div>
      <button onClick={addItem}>Add Item</button>

      <Mount when={hasItemsFacet}>
        <Map array={itemsFacet}>{(itemFacet, index) => <ItemRow key={index} itemFacet={itemFacet} />}</Map>
      </Mount>
    </div>
  )
}

const ItemRow = ({ itemFacet }: { itemFacet: Facet<Item> }) => {
  const nameFacet = useFacetMap((item) => item.name, [], [itemFacet])
  return <fast-text text={nameFacet} />
}
```

---

## Resources

- **Homepage**: <https://react-facet.mojang.com/>
- **GitHub**: <https://github.com/Mojang/ore-ui>
- **Target Runtime**: Coherent Labs Gameface, Chromium Embedded Framework
