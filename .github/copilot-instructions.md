# GitHub Copilot Instructions for Ore UI / React Facet

## Project Overview

**Ore UI** is Mojang Studios' open-source collection of building blocks for constructing video game user interfaces using web standards. The flagship package is **React Facet** (`@react-facet`), an observable-based state management system designed for performant game UIs built in React.

### Target Use Case

- **Primary**: Game UI development using embedded web technologies (Coherent Labs' Gameface)
- **Games using this**: Minecraft Bedrock Edition, Minecraft Legends
- **Performance Requirements**: Fixed frame budget, optimized for slower devices

### Core Philosophy

React Facet bypasses React reconciliation for leaf node updates (styles, text content, attributes) to achieve game-level performance while maintaining React's developer experience.

---

## Repository Structure

This is a **yarn workspace monorepo** with the following organization:

### Package Structure (`packages/@react-facet/`)

```
packages/@react-facet/
├── core/                           # Core facet implementation
│   └── src/
│       ├── facet/                  # createFacet, createStaticFacet, createReadOnlyFacet
│       ├── hooks/                  # All useFacet* hooks
│       ├── components/             # Map, Mount, With
│       ├── mapFacets/              # Facet composition utilities
│       ├── equalityChecks.ts       # Equality check functions
│       ├── createFacetContext.tsx  # Context utilities
│       └── types.ts                # Core type definitions
│
├── dom-fiber/                      # Custom React renderer
│   └── src/
│       ├── fast-* components       # Facet-native DOM elements
│       └── renderer implementation
│
├── dom-fiber-testing-library/      # Testing utilities
│   └── src/
│       └── render, act utilities
│
└── shared-facet/                   # Gameface integration
    └── src/
        └── useSharedFacet, Context
```

### Examples & Documentation

```
examples/
└── benchmarking/                   # Performance benchmarks and examples

docs/
├── docs/                           # Documentation content
│   ├── api/                        # API reference
│   ├── game-ui-development/        # Gameface integration guides
│   └── rendering/                  # Renderer documentation
└── src/                            # Docusaurus site source
```

### Import Patterns

**Core imports** (hooks, utilities, types):

```typescript
import { useFacetState, useFacetMap, useFacetEffect, NO_VALUE, shallowObjectEqualityCheck } from '@react-facet/core'
```

**Renderer imports** (for fast-\* components):

```typescript
import { render, createRoot } from '@react-facet/dom-fiber'
// fast-div, fast-text, etc. are available globally when using dom-fiber
```

**Testing imports**:

```typescript
import { render, act } from '@react-facet/dom-fiber-testing-library'
```

**Gameface integration**:

```typescript
import { useSharedFacet, SharedFacetContext } from '@react-facet/shared-facet'
```

### File Conventions

- **Test files**: Co-located with source as `*.spec.ts` or `*.spec.tsx`
- **Type definitions**: Primarily in `types.ts` files within each package
- **Examples**: Component-based examples in each package's spec files
- **Documentation**: Markdown files in `docs/docs/` with frontmatter

---

## What is a Facet?

A **Facet** is an observable state container that updates over time without triggering React re-renders. Think of it as a reactive value that components can subscribe to directly.

### Core Facet Interface

```typescript
interface Facet<T> {
  get: () => T | NoValue
  observe: (listener: (value: T) => void) => Unsubscribe
}

interface WritableFacet<T> extends Facet<T> {
  set: (value: T | ((prev: T) => T)) => void
}
```

### Key Characteristics

- **Observable**: Components subscribe to facets and update when values change
- **Composable**: Facets can be derived from other facets using transformation functions
- **Performant**: Updates bypass React reconciliation when used with `fast-*` components
- **Type-safe**: Full TypeScript support with type inference

---

## Core Packages

### `@react-facet/core`

Core facet data structure, hooks, and utilities.

**Key Exports:**

- **Hooks**: `useFacetState`, `useFacetMap`, `useFacetEffect`, `useFacetCallback`, `useFacetMemo`, `useFacetWrap`, `useFacetWrapMemo`, `useFacetUnwrap`, `useFacetTransition`
- **Components**: `Map`, `Mount`, `With`
- **Factories**: `createFacet`, `createStaticFacet`, `createReadOnlyFacet`, `createFacetContext`
- **Utilities**: `batch`, `NO_VALUE`, equality checks, `startFacetTransition`

### `@react-facet/dom-fiber`

Custom React renderer that natively understands facets.

**Key Features:**

- Drop-in replacement for `react-dom`
- Provides `fast-*` components (e.g., `fast-div`, `fast-text`, `fast-input`)
- Direct facet binding to DOM without reconciliation
- Optimized for Coherent Gameface (special numeric CSS properties)

### `@react-facet/shared-facet`

Interface layer for game engine communication (Gameface integration).

---

## Facet Patterns & Conventions

### 1. Creating Facets

**Use `useFacetState` for local component state:**

```typescript
const [counterFacet, setCounter] = useFacetState(0)
```

**Important:** The facet returned by `useFacetState` maintains a **stable reference** across all re-renders. Unlike `useFacetMap` or `useFacetWrap`, the facet instance never changes—only its internal value updates when you call the setter.

:::warning Critical: Setter Callbacks Receive Option<T>
**When using the functional form of the setter**, the previous value parameter is `Option<T>` (`T | NO_VALUE`), not just `T`. You must check for `NO_VALUE` before using the value:

```typescript
const [itemsFacet, setItems] = useFacetState<string[]>([])

// ❌ WRONG - current might be NO_VALUE (a Symbol), can't spread!
setItems((current) => [...current, newItem])

// ✅ CORRECT - Check for NO_VALUE first
setItems((current) => (current !== NO_VALUE ? [...current, newItem] : [newItem]))
```

This is the same as `useFacetUnwrap` - facet values are always `T | NO_VALUE`.
:::

**NO_VALUE Retention Behavior in Setters:**

When a setter callback returns `NO_VALUE`, the facet **retains its previous value** rather than updating. The internal state becomes `NO_VALUE`, but listeners are not notified, so subscribers continue seeing the last emitted value.

```typescript
const [countFacet, setCount] = useFacetState(0)

// Stop updating once count reaches 5
setCount((current) => {
  if (current === NO_VALUE) return 0
  if (current >= 5) return NO_VALUE // Retains value 5, doesn't notify listeners
  return current + 1
})

// countFacet subscribers will see: 0 → 1 → 2 → 3 → 4 → 5 → (stays 5)
```

This is useful for:

- Conditional updates (preventing state changes under certain conditions)
- Validation (rejecting invalid updates while keeping previous valid value)
- Clamping values (stopping updates at a threshold)

**Use `useFacetWrap` to convert props that may be values or facets:**

```typescript
// Accepts Facet<T> or T, always returns Facet<T>
const facet = useFacetWrap(maybeFacetProp)
```

**Use `useFacetWrapMemo` when you need a stable facet reference:**

```typescript
// Facet reference stays stable even when the value changes
const stableFacet = useFacetWrapMemo(maybeFacetProp)
```

**`useFacetWrap` vs `useFacetWrapMemo` - When to use which:**

**`useFacetWrap` (creates new facet on value change):**

- ✅ Default choice for most wrapping scenarios
- ✅ Simpler implementation, lower overhead
- ✅ Best when facet reference changes don't matter
- ⚠️ Creates new facet instance when wrapped value changes

**`useFacetWrapMemo` (stable facet, updates internal value):**

- ✅ Maintains stable facet reference
- ✅ Best when wrapping frequently changing props
- ✅ Prevents downstream re-renders from facet reference changes
- ⚠️ Slightly higher overhead (uses effects for synchronization)

**Example:**

```typescript
// useFacetWrap: new facet instance on each prop change
const wrappedFacet = useFacetWrap(propValue)

// useFacetWrapMemo: same facet instance, value updates internally
const memoizedFacet = useFacetWrapMemo(propValue)
```

**Use shared facets for data from external sources:**

Most facet values should come from a shared facet data source (e.g., via context or imported modules), not created locally.

**Use `createFacet` only for testing or very advanced scenarios:**

```typescript
// Primarily for testing - creating mock data
const mockFacet = createFacet({
  initialValue: 'test-value',
  startSubscription: (update) => {
    // Custom subscription logic
    return () => {} // cleanup
  },
  equalityCheck: defaultEqualityCheck,
})
```

> **Note**: `createFacet` is a low-level API not intended for typical application code. Prefer `useFacetState` or `useFacetWrap` in components, or use shared facet sources.

### 2. Deriving Facets (Composition)

**Use `useFacetMap` for lightweight derived facets:**

```typescript
const healthBarClass = useFacetMap(
  (player) => (player.health > 50 ? 'healthy' : 'low-health'),
  [], // non-facet dependencies (props, local variables)
  [playerFacet], // facet dependencies
)
```

**NO_VALUE Retention Behavior:**

When a mapping function (in `useFacetMap` or `useFacetMemo`) returns `NO_VALUE`, the derived facet **retains its previous value** rather than updating. The observer does not notify listeners, so subscribers continue seeing the last successfully mapped value.

```typescript
const [countFacet, setCount] = useFacetState(0)

// Once count reaches 5, the mapped facet stops updating and retains the value 4
const clampedFacet = useFacetMap((count) => (count < 5 ? count : NO_VALUE), [], [countFacet])

// clampedFacet will show: 0, 1, 2, 3, 4, 4, 4, 4... (stuck at 4)
// Even though countFacet continues: 0, 1, 2, 3, 4, 5, 6, 7...
```

This is useful for:

- Conditional updates (only propagating values that meet certain criteria)
- Filtering unwanted values
- Clamping values at boundaries

**Map multiple facets:**

```typescript
const fullName = useFacetMap(
  (firstName, lastName) => `${firstName} ${lastName}`,
  [], // non-facet dependencies
  [firstNameFacet, lastNameFacet], // facet dependencies
)
```

**Use `useFacetMemo` for cached/expensive derived facets:**

```typescript
// Use when the derived facet has many subscribers or expensive computation
const expensiveResult = useFacetMemo((data) => heavyComputation(data), [], [dataFacet])
```

**Understanding the two dependency arrays:**

All facet hooks use a dual dependency array pattern:

1. **First array** (`deps`): Non-facet dependencies (props, local variables, functions) - works like standard React hooks
2. **Second array** (`facets`): Facet dependencies - these don't change reference (which is how facets maintain performance), so we need a separate mechanism to monitor their value changes

```typescript
const localMultiplier = props.multiplier

const result = useFacetMap(
  (value) => value * localMultiplier,
  [localMultiplier], // ← Non-facet dependencies
  [valueFacet], // ← Facet dependencies
)
```

**`useFacetMap` vs `useFacetMemo` - When to use which:**

Both hooks derive values from facets with identical APIs, but have different performance characteristics:

**Important: Facet Reference Stability**

Both `useFacetMap` and `useFacetMemo` **create a new facet reference when any dependency changes**:

- Changes to the `dependencies` array (non-facet dependencies) → new facet reference
- Changes to the `facets` array (different facet instances) → new facet reference
- Changes to the `equalityCheck` function → new facet reference

This is expected behavior and mirrors how React's `useMemo` works. The returned facet reference is memoized on these dependencies.

**`useFacetMap` (lightweight):**

- ✅ Fast to initialize (no internal facet creation overhead)
- ✅ Best for simple transformations (property access, string concatenation)
- ✅ Best for few subscribers (1-2 components)
- ⚠️ Computation runs independently for each subscriber
- **Use as default** for most derivations

**`useFacetMemo` (cached):**

- ⚠️ Heavier to initialize (uses `createFacet` internally)
- ✅ Caches results across all subscribers (single computation)
- ✅ Best for expensive computations
- ✅ Best for many subscribers (3+ components)
- **Use when profiling shows** a performance bottleneck with `useFacetMap`

**Example comparison:**

```typescript
// If this derived facet is used by 5 components:

// useFacetMap: computation runs 5 times (once per subscriber)
const lightweightFacet = useFacetMap(expensiveFunc, [], [sourceFacet])

// useFacetMemo: computation runs once, result cached for all 5 subscribers
const cachedFacet = useFacetMemo(expensiveFunc, [], [sourceFacet])
```

**In practice:** Start with `useFacetMap` for all derivations. Switch to `useFacetMemo` only when:

1. You identify a performance issue (profiling shows repeated expensive computations)
2. You know the facet will have many subscribers (e.g., passed to a list of components)
3. The mapping function is clearly expensive (complex calculations, large data processing)

### 3. Binding Facets to UI

**Use `fast-*` components (requires `@react-facet/dom-fiber`):**

```typescript
// Direct facet binding - NO reconciliation
<fast-text text={counterFacet} />
<fast-div className={healthClassFacet}>
  <fast-input value={usernameFacet} />
</fast-div>
```

**Mix facets and static values:**

```typescript
<fast-div id="static-id" className={dynamicClassFacet} />
```

### 4. Side Effects

**Use `useFacetEffect` for facet-based effects:**

```typescript
useFacetEffect(
  (playerHealth) => {
    if (playerHealth < 20) {
      playWarningSound()
    }
  },
  [], // dependencies
  [playerHealthFacet],
)
```

**Use `useFacetLayoutEffect` for synchronous effects (like useLayoutEffect):**

```typescript
useFacetLayoutEffect(
  (dimensions) => {
    measureAndUpdateLayout(dimensions)
  },
  [],
  [dimensionsFacet],
)
```

### 5. Callbacks with Facets

**Use `useFacetCallback` to create callbacks that depend on facet values:**

```typescript
const handleSubmit = useFacetCallback(
  (username, password) => () => {
    submitLoginForm(username, password)
  },
  [],
  [usernameFacet, passwordFacet],
)
```

### 6. Conditional Rendering

**Use `Mount` component for conditional mounting:**

```typescript
<Mount when={isVisibleFacet}>
  <ExpensiveComponent />
</Mount>
```

**Use `Map` component for lists:**

```typescript
<Map array={itemsFacet}>
  {(itemFacet, index) => (
    <div key={index}>
      <fast-text text={useFacetMap((item) => item.name, [], [itemFacet])} />
    </div>
  )}
</Map>
```

### 7. Performance Optimization with Transitions

**Use `useFacetTransition` for heavy updates in components:**

React Facet supports React 18's concurrent features through `useFacetTransition` and `startFacetTransition`. These mark facet updates as low-priority transitions, keeping the UI responsive during expensive operations.

**Key characteristics:**

- **Stable callbacks** - The `startTransition` function from `useFacetTransition` is stable and doesn't need to be in dependency arrays
- **Batching** - Uses `batchTransition` internally with separate task queues for transition vs non-transition updates
- **Error handling** - Errors cancel remaining queued tasks and re-throw
- **Nesting support** - Transitions can be nested; inner transitions complete when outer ones do

```typescript
const [isPending, startTransition] = useFacetTransition()

const handleHeavyUpdate = () => {
  // High-priority update - runs immediately
  setInputFacet(newValue)

  // Low-priority update - can be interrupted
  startTransition(() => {
    try {
      const results = expensiveComputation(newValue)
      setResultsFacet(results)
    } catch (error) {
      setErrorFacet(error)
    }
  })
}

// Show pending state
return (
  <div>
    {isPending && <div>Processing...</div>}
    <fast-input value={inputFacet} />
  </div>
)
```

**Use `startFacetTransition` outside components:**

```typescript
// In utility functions or event handlers
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
    const newData = generateData()
    loadDataAsTransition(setData, newData)
  }

  return <button onClick={handleLoad}>Load</button>
}
```

**When to use transitions:**

- ✅ Heavy facet updates that affect many components
- ✅ Expensive computations triggered by facet changes
- ✅ Large list updates or complex UI changes
- ✅ Keeping input fields responsive during processing
- ✅ Shared state updates where `isPending` isn't needed (use `startFacetTransition`)
- ❌ Don't use for urgent UI feedback (like input values)
- ❌ Don't use for critical user interactions

**Best practices:**

- Always wrap risky computations in try-catch blocks within transitions
- Use `startFacetTransition` for shared state to avoid provider re-renders
- The `startTransition` callback is stable - don't include it in dependency arrays
- Transitions can be nested for complex update patterns

### 8. Unwrapping (Use Sparingly!)

**Use `useFacetUnwrap` only when absolutely necessary:**

```typescript
// ⚠️ WARNING: Creates real component state - causes re-renders!
const plainValue = useFacetUnwrap(someFacet)
```

:::danger Critical: Always Check for NO_VALUE
**`useFacetUnwrap` returns `T | NO_VALUE`, not just `T`!** You must always check for `NO_VALUE` before using the unwrapped value, otherwise you'll get TypeScript errors.

```typescript
const value = useFacetUnwrap(numberFacet)

// ❌ WRONG - TypeScript error! value might be NO_VALUE
if (value > 50) { ... }

// ✅ CORRECT - Check for NO_VALUE first
if (value !== NO_VALUE && value > 50) { ... }
```

:::

**When to use `useFacetUnwrap`:**

1. **Passing to non-facet-aware components** (though refactoring the component to accept facets is preferred):

   ```typescript
   const value = useFacetUnwrap(facet)

   // Always check for NO_VALUE before using
   if (value === NO_VALUE) return null

   return <ThirdPartyComponent value={value} />
   ```

2. **Conditional mounting** (though `Mount` or `With` components are better as they scope the re-render):

   ```typescript
   // ❌ Avoid - causes component re-render
   const isVisible = useFacetUnwrap(isVisibleFacet)
   if (isVisible !== NO_VALUE && !isVisible) return null

   // ✅ Better - scopes re-render to Mount component
   <Mount when={isVisibleFacet}>
     <ExpensiveComponent />
   </Mount>
   ```

**Common NO_VALUE handling patterns:**

```typescript
// Early return
const value = useFacetUnwrap(facet)
if (value === NO_VALUE) return null

// Default value
const value = useFacetUnwrap(facet)
const safeValue = value === NO_VALUE ? defaultValue : value

// Guard in JSX
const items = useFacetUnwrap(arrayFacet)
return items !== NO_VALUE && items.map(...)
```

**Performance Impact:**

`useFacetUnwrap` defeats the primary benefit of facets by triggering React re-renders. Use it as a last resort, not as a standard pattern.

### 8. Unwrapping (Use Sparingly!)

**Use `useFacetUnwrap` only when absolutely necessary:**

```typescript
// ⚠️ WARNING: Creates real component state - causes re-renders!
const plainValue = useFacetUnwrap(someFacet)
```

:::danger Critical: Always Check for NO_VALUE
**`useFacetUnwrap` returns `T | NO_VALUE`, not just `T`!** You must always check for `NO_VALUE` before using the unwrapped value, otherwise you'll get TypeScript errors.

```typescript
const value = useFacetUnwrap(numberFacet)

// ❌ WRONG - TypeScript error! value might be NO_VALUE
if (value > 50) { ... }

// ✅ CORRECT - Check for NO_VALUE first
if (value !== NO_VALUE && value > 50) { ... }
```

:::

**When to use `useFacetUnwrap`:**

1. **Passing to non-facet-aware components** (though refactoring the component to accept facets is preferred):

   ```typescript
   const value = useFacetUnwrap(facet)

   // Always check for NO_VALUE before using
   if (value === NO_VALUE) return null

   return <ThirdPartyComponent value={value} />
   ```

2. **Conditional mounting** (though `Mount` or `With` components are better as they scope the re-render):

   ```typescript
   // ❌ Avoid - causes component re-render
   const isVisible = useFacetUnwrap(isVisibleFacet)
   if (isVisible !== NO_VALUE && !isVisible) return null

   // ✅ Better - scopes re-render to Mount component
   <Mount when={isVisibleFacet}>
     <ExpensiveComponent />
   </Mount>
   ```

**Common NO_VALUE handling patterns:**

```typescript
// Early return
const value = useFacetUnwrap(facet)
if (value === NO_VALUE) return null

// Default value
const value = useFacetUnwrap(facet)
const safeValue = value === NO_VALUE ? defaultValue : value

// Guard in JSX
const items = useFacetUnwrap(arrayFacet)
return items !== NO_VALUE && items.map(...)
```

**Performance Impact:**

`useFacetUnwrap` defeats the primary benefit of facets by triggering React re-renders. Use it as a last resort, not as a standard pattern.

### 9. Context

**Use `createFacetContext` for facet-based context:**

```typescript
const PlayerContext = createFacetContext<PlayerData>()

// Provider
<PlayerContext.Provider value={playerFacet}>
  <GameUI />
</PlayerContext.Provider>

// Consumer
const playerFacet = useContext(PlayerContext)
```

---

## Important Conventions

### Naming

- Facet variables: suffix with `Facet` (e.g., `counterFacet`, `playerHealthFacet`)
- Facet setters: prefix with `set` (e.g., `setCounter`, `setPlayerHealth`)
- Derived facets: descriptive names indicating transformation (e.g., `healthBarClass`, `formattedDate`)

### Dual Dependencies Arrays

All facet hooks use **two dependency arrays** (unlike standard React hooks):

```typescript
useFacetMap(
  (value) => transform(value, localVar),
  [localVar], // First array: non-facet dependencies (props, local vars)
  [facet], // Second array: facet dependencies
)
```

**Why two arrays?**

Facets don't change reference (this is key to their performance), so we need a separate mechanism to track when their _values_ change. The second array tells the hook which facets to subscribe to for value changes.

**Examples:**

```typescript
// Local variable dependency
const multiplier = props.multiplier
useFacetMap((x) => x * multiplier, [multiplier], [xFacet])

// Multiple facets, no local dependencies
useFacetMap((a, b) => a + b, [], [aFacet, bFacet])

// Both types of dependencies
const prefix = props.prefix
useFacetMap((name) => `${prefix}: ${name}`, [prefix], [nameFacet])
```

### Equality Checks

Use equality checks to prevent unnecessary updates:

```typescript
import { shallowObjectEqualityCheck, shallowArrayEqualityCheck, strictEqualityCheck } from '@react-facet/core'

// For objects
useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB], shallowObjectEqualityCheck)

// For arrays
useFacetMap((a, b) => [a, b], [], [facetA, facetB], shallowArrayEqualityCheck)

// For primitives (optional - default is already optimized)
useFacetMap((x) => x * 2, [], [xFacet], strictEqualityCheck)

// No check needed for primitives - defaultEqualityCheck is used automatically and is fastest
useFacetMap((x) => x * 2, [], [xFacet]) // Optimized by default
```

**Key differences between equality checks:**

- **`defaultEqualityCheck`** (used automatically when omitted):

  - **Performance optimized** - Inlined in mapping functions for best speed
  - For primitives: uses `===` comparison
  - For objects/arrays: always returns `false` (treats as mutable/always different)
  - Accepts any type but not type-safe

- **`strictEqualityCheck`**:

  - **Type-safe** - TypeScript constraint: `<T extends Immutable | Function>`
  - Only works with primitives (`boolean | number | string | undefined | null`) and functions
  - TypeScript will prevent usage with objects/arrays
  - Uses `===` comparison
  - Slightly slower than `defaultEqualityCheck` (not inlined)

- **`shallowObjectEqualityCheck`**: For objects with primitive values (deep value comparison)

- **`shallowArrayEqualityCheck`**: For arrays of primitives (deep value comparison)

**Best practices:**

- For primitives: Omit the equality check (uses optimized `defaultEqualityCheck`)
- For objects: Always use `shallowObjectEqualityCheck` or similar
- For arrays: Always use `shallowArrayEqualityCheck` or similar
- For type safety: Use `strictEqualityCheck` (though it's slightly slower)
- For functions: Use `strictEqualityCheck` (function reference comparison)

### NO_VALUE

`NO_VALUE` is a special sentinel value representing an uninitialized facet. It's a unique symbol that must be checked explicitly.

**CRITICAL with `useFacetUnwrap`:**

```typescript
import { NO_VALUE, useFacetUnwrap } from '@react-facet/core'

// useFacetUnwrap returns T | NO_VALUE
const value = useFacetUnwrap(numberFacet)

// ❌ WRONG - TypeScript error! value might be NO_VALUE
const doubled = value * 2

// ❌ WRONG - TypeScript error! NO_VALUE is not a number
if (value > 50) { ... }

// ✅ CORRECT - Check for NO_VALUE first
if (value !== NO_VALUE) {
  const doubled = value * 2  // Now TypeScript knows value is number
  if (value > 50) { ... }
}
```

**Other uses:**

```typescript
// Direct facet access
const value = someFacet.get()
if (value === NO_VALUE) {
  // Handle uninitialized state
}

// In useFacetMap (facet mapping handles NO_VALUE automatically)
const mappedFacet = useFacetMap(
  (value) => {
    // value here is T, not T | NO_VALUE
    // useFacetMap only calls this when value is available
    return value * 2
  },
  [],
  [numberFacet],
)
```

**Key difference:**

- **`useFacetMap`**: Automatically waits for all facets to have values, callback receives `T`
- **`useFacetUnwrap`**: Returns `T | NO_VALUE` immediately, YOU must check for `NO_VALUE`

### Batching

Batching is built into the library by default and **not intended for public use**.

The `batch` function exists primarily for internal library use and is exported only for library internals. In normal application code:

- **Don't use `batch` directly** - It's marked as `@private` in the source code
- **For transitions, use the public APIs**: `useFacetTransition` or `startFacetTransition`
- **The library handles batching automatically** - Facet updates are batched internally

**Internal implementation detail:**

- `batch` - General-purpose batching for facet updates
- `batchTransition` - Special batching for transitions (used by `useFacetTransition`/`startFacetTransition`)
- Separate task queues for transition vs non-transition updates ensure proper priority ordering

---

## fast-\* Components

### When to Use fast-\* Components

**Use `fast-*` components when you need to bind a Facet to a DOM property:**

```typescript
// ✅ Use fast-div when binding facet values
<fast-div className={classNameFacet}>
  <fast-text text={messageFacet} />
</fast-div>

// ✅ Use fast-input when value is a facet
<fast-input value={usernameFacet} />
```

**Use regular HTML elements when working with static values or non-facet props:**

```typescript
// ✅ Regular HTML is fine for static content
<div className="container">
  <p>Static text content</p>
  <button onClick={handleClick}>Click me</button>
</div>

// ✅ Mix regular HTML with fast-* when needed
<div className="form">
  <label>Username:</label>
  <fast-input value={usernameFacet} />
</div>
```

**Key principle**: `fast-*` components bypass React reconciliation for property updates. Use them when you need this performance benefit (binding facets), but regular HTML is perfectly fine otherwise.

### Available Components

**Primary Components:**

- **`fast-div`** - Container element that accepts facet props
- **`fast-text`** - Text content from a facet (renders as text node, no wrapper element)
- **`fast-input`** - Text input that can bind to facet values
- **`fast-textarea`** - Multi-line text input with facet support
- **`fast-img`** - Images with facet-bindable src and other attributes
- **`fast-span`** - Inline element with facet support
- **`fast-p`** - Paragraph element with facet support
- **`fast-a`** - Anchor/link element with facet support

### Usage Examples

```typescript
// fast-* components accept Facet<T> or T for all props
<fast-div className={classFacet} style={{ color: colorFacet, fontSize: '16px' }} onClick={handleClick}>
  <fast-text text={messageFacet} />
</fast-div>

// Regular HTML for static structure
<div className="game-ui">
  <div className="header">
    <h1>Player Stats</h1>
  </div>
  <div className="stats">
    {/* Use fast-text only where facet binding is needed */}
    Health: <fast-text text={healthFacet} />
  </div>
</div>
```

### Gameface Optimizations

`fast-*` components support numeric CSS properties (faster than strings):

- Properties ending in `PX`, `VH`, `VW` (e.g., `widthPX`, `heightVH`)
- Avoids string construction/parsing overhead

---

## Code Generation Guidelines

### When to Use Facets

✅ **Use facets when:**

- Frequent updates to UI (animations, counters, health bars)
- Derived state from multiple sources
- Performance-critical game UI
- Working within `@react-facet/dom-fiber` renderer

❌ **Don't use facets when:**

- One-time static values
- Infrequent updates where re-renders are acceptable
- Working with third-party components expecting plain props

### Facet Creation Patterns

```typescript
// ✅ Good - use hooks in components for local state
const [stateFacet, setState] = useFacetState(initialValue)

// ✅ Good - derive from other facets
const derivedFacet = useFacetMap(fn, deps, [sourceFacet])

// ✅ Good - wrap props that might be values or facets
const wrappedFacet = useFacetWrap(propValue)

// ✅ Good - use shared facets from context/modules
const sharedFacet = useContext(DataContext)

// ❌ Avoid - createFacet in application code
const facet = createFacet({ initialValue, startSubscription })

// ✅ OK - createFacet for testing only
const mockFacet = createFacet({ initialValue: 'test' })
```

### Keep Facets at Appropriate Scope

```typescript
// ✅ Good - facet at component level
function PlayerHealth() {
  const [healthFacet, setHealth] = useFacetState(100)
  return <fast-text text={healthFacet} />
}

// ✅ Good - shared facet via context
const PlayerContext = createFacetContext<Player>()

// ❌ Avoid - recreating facets unnecessarily
function Bad() {
  const healthFacet = useFacetMap((p) => p.health, [], [playerFacet])
  const healthFacet2 = useFacetMap((p) => p.health, [], [playerFacet]) // duplicate!
}
```

### Type Safety

**Prefer `type` over `interface`:**

```typescript
// ✅ Good - use type for facet data structures
type PlayerData = {
  health: number
  mana: number
  name: string
}

const [playerFacet, setPlayer] = useFacetState<PlayerData>({
  health: 100,
  mana: 50,
  name: 'Steve',
})

// Type inference works for simple cases
const [counterFacet, setCounter] = useFacetState(0) // inferred as number
```

---

## Common Pitfalls

### 1. Mixing Facets and React State

❌ **Don't mix paradigms unnecessarily:**

```typescript
const [count, setCount] = useState(0) // React state
const [countFacet, setCountFacet] = useFacetState(0) // Facet state
// Choose one approach per component
```

### 2. Forgetting Dependencies (Especially Non-Facet Dependencies)

```typescript
// ❌ Missing local variable in FIRST dependency array
const multiplier = props.multiplier
const result = useFacetMap(
  (value) => value * multiplier,
  [], // ❌ Missing: [multiplier]
  [valueFacet],
)

// ✅ Include all non-facet dependencies in first array
const result = useFacetMap(
  (value) => value * multiplier,
  [multiplier], // ✅ Non-facet dependencies here
  [valueFacet], // ✅ Facet dependencies here
)
```

### 3. Overusing useFacetUnwrap (Performance Killer!)

```typescript
// ❌ Causes re-renders - defeats the entire purpose of facets!
const value = useFacetUnwrap(facet)
return <div>{value}</div>

// ✅ Use fast-text with facet - no re-renders
return <fast-text text={facet} />

// ❌ Unwrapping for conditional rendering
const isVisible = useFacetUnwrap(isVisibleFacet)
if (!isVisible) return null
return <ExpensiveComponent />

// ✅ Use Mount component - scopes re-render
return (
  <Mount when={isVisibleFacet}>
    <ExpensiveComponent />
  </Mount>
)
```

**Remember**: `useFacetUnwrap` creates real component state and triggers re-renders. Use it only as a last resort when interfacing with non-facet-aware code.

### 4. Forgetting to Check for NO_VALUE After useFacetUnwrap

```typescript
// ❌ TypeScript ERROR - value might be NO_VALUE!
const value = useFacetUnwrap(numberFacet)
const doubled = value * 2  // Error: NO_VALUE is not a number

// ❌ TypeScript ERROR - can't compare NO_VALUE with number
if (value > 50) { ... }

// ✅ Always check for NO_VALUE first
const value = useFacetUnwrap(numberFacet)
if (value !== NO_VALUE) {
  const doubled = value * 2  // ✓ Now TypeScript knows it's a number
  if (value > 50) { ... }  // ✓ Safe to compare
}

// ✅ Or use early return pattern
const value = useFacetUnwrap(numberFacet)
if (value === NO_VALUE) return null
// After this point, TypeScript knows value is the actual type
```

### 5. Forgetting to Check for NO_VALUE in useFacetState Setter Callbacks

```typescript
const [itemsFacet, setItems] = useFacetState<string[]>([])

// ❌ WRONG - current might be NO_VALUE (a Symbol), can't spread!
setItems((current) => [...current, newItem])

// ❌ WRONG - NO_VALUE doesn't have .filter method
setItems((current) => current.filter((item) => item !== oldItem))

// ✅ CORRECT - Check for NO_VALUE first
setItems((current) => (current !== NO_VALUE ? [...current, newItem] : [newItem]))

// ✅ CORRECT - Handle NO_VALUE in all operations
setItems((current) => (current !== NO_VALUE ? current.filter((item) => item !== oldItem) : []))
```

**Critical**: The setter callback receives `Option<T>` (i.e., `T | NO_VALUE`), just like `useFacetUnwrap`. Always check before using the value!

### 6. Not Using Equality Checks for Objects/Arrays

```typescript
// ❌ Will update on every check (reference equality)
const combined = useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB])

// ✅ Use appropriate equality check
const combined = useFacetMap((a, b) => ({ a, b }), [], [facetA, facetB], shallowObjectEqualityCheck)
```

---

## Development Workflow

### Running Tests

```bash
# Run all tests with coverage
yarn test

# Watch mode for development
yarn test:watch
```

### Building Packages

```bash
# Build all packages (topological order)
yarn build

# Package for distribution
yarn package
```

### Documentation Site

```bash
# Install docs dependencies
yarn docs:install

# Start local docs server
yarn docs:start

# Build docs for production
yarn docs:build
```

### Linting & Formatting

```bash
# Format all files
yarn format

# Lint codebase
yarn lint
```

---

## Testing Patterns

### Test File Structure

All test files follow the pattern `*.spec.ts` or `*.spec.tsx` and are co-located with source files:

```typescript
// useFacetMap.spec.tsx
import { render, act } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { useFacetMap } from './useFacetMap'

it('maps values from a facet', () => {
  const facet = createFacet({ initialValue: 'test' })

  const Component = () => {
    const mapped = useFacetMap((value) => value.toUpperCase(), [], [facet])
    return <fast-text text={mapped} />
  }

  const { container } = render(<Component />)
  expect(container.textContent).toBe('TEST')

  act(() => facet.set('hello'))
  expect(container.textContent).toBe('HELLO')
})
```

### Key Testing Utilities

- **`render()`** - Renders components using dom-fiber
- **`act()`** - Wraps facet updates to ensure proper batching
- **`createFacet()`** - Creates mock facets for testing (this is where it's useful!)
- **`NO_VALUE`** - Test initial/uninitialized states

### Common Test Patterns

```typescript
// Testing facet updates
act(() => {
  facet.set(newValue)
})

// Testing multiple facets
const facetA = createFacet({ initialValue: 'A' })
const facetB = createFacet({ initialValue: 'B' })

// Testing with NO_VALUE
const facet = createFacet<string>({ initialValue: NO_VALUE })
expect(facet.get()).toBe(NO_VALUE)
```

---

## Documentation & Resources

- **Official Docs**: https://react-facet.mojang.com/
- **Target Runtime**: Coherent Labs Gameface, Chromium Embedded Framework
- **Compatibility**: Not all React DOM features are ported (no synthetic events layer)

---

## Quick Reference

### Most Common Hooks

```typescript
// State management
useFacetState<T>(initialValue): [Facet<T>, Setter<T>]

// Derivation
useFacetMap<M>(fn, deps, facets, equalityCheck?): Facet<M>      // Lightweight, fast init, best default
useFacetMemo<M>(fn, deps, facets, equalityCheck?): Facet<M>     // Cached, use for many subscribers/expensive computations

// Side effects
useFacetEffect(effect, deps, facets): void
useFacetLayoutEffect(effect, deps, facets): void
useFacetCallback<M>(callback, deps, facets, defaultReturn?): (...args) => M

// Utilities
useFacetWrap<T>(FacetProp<T>): Facet<T>                         // Creates new facet on value change
useFacetWrapMemo<T>(FacetProp<T>, equalityCheck?): Facet<T>    // Stable facet, updates internal value
useFacetUnwrap<T>(Facet<T>): T (⚠️ causes re-renders!)
useFacetRef<T>(facet): RefObject<T>

// Transitions (React 18+)
useFacetTransition(): [boolean, (fn: () => void) => void]      // Hook with pending state
startFacetTransition(fn: () => void): void                      // Function API for transitions
```

### Core Components

```typescript
// Conditional mounting
<Mount when={facet}><Child /></Mount>

// List rendering
<Map array={arrayFacet}>{(itemFacet, index) => <Item />}</Map>

// Conditional rendering with value
<With facet={facet}>{(value) => <div>{value}</div>}</With>
```

### Facet Factories

```typescript
// For testing/advanced use only
createFacet<T>({ initialValue, startSubscription, equalityCheck? }): WritableFacet<T>
createStaticFacet<T>(value): Facet<T>
createReadOnlyFacet<T>(facet): Facet<T>

// Context
createFacetContext<T>(): Context<Facet<T>>
```

### Equality Checks

```typescript
import {
  defaultEqualityCheck, // Reference equality (default)
  strictEqualityCheck, // Strict equality (===)
  shallowObjectEqualityCheck, // Shallow object comparison
  shallowArrayEqualityCheck, // Shallow array comparison
} from '@react-facet/core'
```

**Key characteristics:**

- **`defaultEqualityCheck`**: Performance optimized (inlined), primitives use `===`, objects/arrays always return `false`
- **`strictEqualityCheck`**: Type-safe (only primitives & functions), uses `===`, not optimized
- **`shallowObjectEqualityCheck`**: Deep value comparison for objects with primitive properties
- **`shallowArrayEqualityCheck`**: Deep value comparison for arrays of primitives

### Special Values & Types

```typescript
import { NO_VALUE } from '@react-facet/core'

type Facet<T>
type WritableFacet<T>
type FacetProp<T> = T | Facet<T>
type NoValue = typeof NO_VALUE
type EqualityCheck<T>
```

---

## Copilot-Specific Guidance

When generating or modifying React Facet code:

1. **Always use facet naming convention** (`*Facet` suffix for variables)
2. **Use `useFacetState` or `useFacetWrap` for creating facets** - avoid `createFacet` in application code
3. **Use `fast-*` components only when binding facets** - regular HTML (`<div>`, `<img>`, `<input>`, etc.) is fine for static content
4. **Use TWO dependency arrays correctly**:
   - First array: non-facet dependencies (props, local vars)
   - Second array: facet dependencies
5. **Default to `useFacetMap` for derivations** - only use `useFacetMemo` when you have many subscribers or expensive computations
6. **Use `useFacetWrap` vs `useFacetWrapMemo` appropriately**:
   - `useFacetWrap`: Default choice, creates new facet on value change
   - `useFacetWrapMemo`: When you need stable facet references or wrap frequently changing props
7. **Use transitions for heavy updates**:
   - `useFacetTransition`: In components when you need pending state
   - `startFacetTransition`: Outside components or when pending state not needed
   - The `startTransition` callback from `useFacetTransition` is stable - don't include it in dependency arrays
   - Always wrap risky computations in try-catch blocks within transitions
8. **Add equality checks** for object/array derivations to prevent unnecessary updates
9. **Handle `NO_VALUE`** in facet operations where appropriate
10. **CRITICAL: Always check for `NO_VALUE` after `useFacetUnwrap`** - the return type is `T | NO_VALUE`, not `T`
11. **CRITICAL: Always check for `NO_VALUE` in `useFacetState` setter callbacks** - the previous value is `Option<T>` (`T | NO_VALUE`), not just `T`
12. **CRITICAL: Understand NO_VALUE retention behavior**:
    - When a mapping function (`useFacetMap`/`useFacetMemo`) returns `NO_VALUE`, the derived facet retains its previous value (doesn't notify listeners)
    - When a setter callback (`useFacetState`) returns `NO_VALUE`, the facet retains its previous value (doesn't notify listeners)
    - Useful for conditional updates, validation, and clamping values
13. **Avoid `useFacetUnwrap`** unless absolutely necessary (causes re-renders!)
14. **Use `type` instead of `interface`** for TypeScript definitions
15. **Don't use `batch` in application code** - it's for internal library use
16. **Test facet-based components** using `@react-facet/dom-fiber-testing-library`
17. **Understand facet reference stability**:
    - `useFacetState`: Facet reference is **stable** - never changes across re-renders
    - `useFacetMap`/`useFacetMemo`: Create **new facet reference** when dependencies change (non-facet deps, facets array, or equalityCheck)
    - `useFacetWrap`: Creates **new facet reference** when wrapped value changes
    - `useFacetWrapMemo`: Maintains **stable facet reference**, updates value internally

When reviewing React Facet code, check for:

- **Dual dependency arrays**: First for non-facet deps, second for facet deps
- **No missing dependencies** in the first array (props, local variables, functions)
- **Appropriate equality checks** (objects/arrays need custom checks)
- **Correct hook choice for wrapping**: `useFacetWrap` vs `useFacetWrapMemo` based on stability needs
- **Transitions for heavy updates**: Using `useFacetTransition` or `startFacetTransition` for expensive operations
- **Error handling in transitions**: Try-catch blocks wrapping risky computations
- **Minimal use of `useFacetUnwrap`** (red flag if used frequently)
- **`NO_VALUE` checks after `useFacetUnwrap`** (CRITICAL - must check before using unwrapped values)
- **`NO_VALUE` checks in `useFacetState` setter callbacks** (CRITICAL - must check before spreading/accessing properties)
- **NO_VALUE retention awareness**: Understanding that returning `NO_VALUE` from mappers/setters retains previous value
- **`fast-*` components only used when needed** (binding facets to props)
- **`createFacet` only in tests** - not in components
- **`type` over `interface`** in TypeScript definitions
- **`useFacetMap` as default for derivations** - `useFacetMemo` only when needed for performance
- **Stable callback awareness**: Not including `startTransition` from `useFacetTransition` in dependency arrays
- **Facet reference stability awareness**: Understanding when facets create new references vs maintaining stable ones

---

## Maintaining These Instructions

> **Last Updated**: 16 October 2025

To keep these instructions accurate as the project evolves:

### When to Update This File

**API Changes** - Update when:

- New hooks are added to `@react-facet/core`
- Hook signatures change (new parameters, different return types)
- New `fast-*` components are added or deprecated
- New packages are added to the monorepo

**Pattern Changes** - Update when:

- Best practices evolve (e.g., new performance patterns discovered)
- Breaking changes require different usage patterns
- New testing utilities are added

**Structure Changes** - Update when:

- Folder structure is reorganized
- Import paths change
- New packages or examples are added

### Verification Checklist

Periodically verify these sections stay current:

- [ ] **Hook signatures** match actual implementations in `packages/@react-facet/core/src/hooks/`
- [ ] **Import examples** work with current package structure
- [ ] **fast-\* components list** matches `packages/@react-facet/dom-fiber/src/`
- [ ] **Repository structure** reflects actual folder organization
- [ ] **Code examples** run without errors
- [ ] **Links** to documentation site are valid

### Integration with Development

**Release Checklist**: Add to `CONTRIBUTING.md`:

- [ ] Review and update Copilot instructions for any API changes
- [ ] Verify all code examples in instructions work with new version
- [ ] Update "Last Updated" date in instructions
- [ ] Run `bash scripts/check-copilot-instructions-sync.sh` to verify documentation is in sync

### Ownership

**Maintainer Responsibility**: Assign documentation ownership

- Core team reviews instruction updates in PRs
- Release manager includes docs in release checklist
- Monthly review of instructions for accuracy

**Documentation Sync Tool**: The repository includes `scripts/check-copilot-instructions-sync.sh` to automatically detect drift between code and documentation.

---

## Documentation Code Examples

When writing code examples in the documentation (`docs/docs/**/*.md`):

### Fast-\* Component Usage

**CRITICAL:** All `fast-*` components (like `fast-text`, `fast-div`, `fast-input`, `fast-span`, `fast-img`, etc.) require importing the renderer:

```tsx
// ✅ CORRECT - Import renderer for any fast-* components
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMap } from '@react-facet/core'

const Example = () => {
  const [textFacet] = useFacetState('Hello')
  const [classFacet] = useFacetState('my-class')

  return (
    <fast-div className={classFacet}>
      <fast-text text={textFacet} />
      <fast-input value={textFacet} />
    </fast-div>
  )
}
```

```tsx
// ❌ WRONG - Missing renderer import causes TypeScript errors
// @esModuleInterop
import { useFacetState } from '@react-facet/core'

const Example = () => {
  const [textFacet] = useFacetState('Hello')
  return (
    <fast-div>
      {' '}
      {/* Error: Property 'fast-div' does not exist */}
      <fast-text text={textFacet} /> {/* Error: Property 'fast-text' does not exist */}
    </fast-div>
  )
}
```

**The pattern:**

- Add `// @esModuleInterop` at the top
- Add `import { render } from '@react-facet/dom-fiber'`
- Add `// ---cut---` to hide the import from the rendered example
- Then write your example code with any `fast-*` components

### Regular HTML Elements

Regular HTML elements don't need the renderer import:

```tsx
// ✅ Works without renderer import
// @esModuleInterop
import { useFacetState } from '@react-facet/core'

const Example = () => {
  return <div>Static content</div> // Regular HTML - no import needed
}
```

### When to Use Each

- Use any `fast-*` components when demonstrating facet binding to DOM properties
- Use regular HTML for examples focusing on hook usage or component structure
- Never use any `fast-*` component without the renderer import pattern shown above
