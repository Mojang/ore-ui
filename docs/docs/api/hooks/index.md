---
sidebar_position: 2
sidebar_label: Hooks
---

# Hooks Overview

React Facet provides a comprehensive set of hooks for working with facets. These hooks follow React's naming conventions where possible, making them familiar and easy to understand.

**Key Pattern**: All facet hooks use a **dual dependency array** pattern:

1. **First array** - Non-facet dependencies (props, local variables, functions)
2. **Second array** - Facet dependencies (the facets to observe)

This separation is necessary because facet references never change (which is key to their performance), so we need a dedicated mechanism to track value changes.

## Quick Reference

| Hook                                                | Purpose                                                | React Equivalent  |
| --------------------------------------------------- | ------------------------------------------------------ | ----------------- |
| [`useFacetState`](./use-facet-state)                | Create local facet state                               | `useState`        |
| [`useFacetMap`](./use-facet-map)                    | Derive facet (lightweight, default choice)             | `useMemo`         |
| [`useFacetMemo`](./use-facet-memo)                  | Derive facet (cached, for expensive computations)      | `useMemo`         |
| [`useFacetCallback`](./use-facet-callback)          | Create callback that depends on facets                 | `useCallback`     |
| [`useFacetEffect`](./use-facet-effect)              | Perform side effects when facets change                | `useEffect`       |
| [`useFacetLayoutEffect`](./use-facet-layout-effect) | Synchronous side effects when facets change            | `useLayoutEffect` |
| [`useFacetRef`](./use-facet-ref)                    | Create ref that tracks facet value                     | `useRef`          |
| [`useFacetWrap`](./use-facet-wrap)                  | Convert value or facet to facet                        | -                 |
| [`useFacetWrapMemo`](./use-facet-wrap-memo)         | Convert value or facet to facet (memoized, stable)     | -                 |
| [`useFacetUnwrap`](./use-facet-unwrap)              | ⚠️ Extract plain value (causes re-renders)             | -                 |
| [`useFacetTransition`](./use-facet-transition)      | Mark facet updates as transitions (with pending state) | `useTransition`   |

## State Management

### useFacetState

The primary hook for creating local facet state in components. Returns a `[facet, setFacet]` pair, analogous to React's `useState`.

**Key features:**

- **Stable facet reference** - The facet instance never changes across re-renders
- **Functional updates** - Setter accepts updater functions
- **NO_VALUE handling** - Setter callbacks receive `Option<T>` (must check for `NO_VALUE`)

[Learn more →](./use-facet-state)

## Deriving State

React Facet provides two hooks for deriving new facets from existing ones. Both have identical APIs but different performance characteristics.

### useFacetMap

The **default choice** for deriving facets - lightweight and fast to initialize.

**When to use:**

- Simple transformations (property access, string concatenation, basic math)
- Few subscribers (1-2 components using the derived facet)
- Most common use cases

[Learn more →](./use-facet-map)

### useFacetMemo

The **optimization choice** for expensive derivations or shared state.

**When to use:**

- Many subscribers (3+ components using the same derived facet)
- Expensive computations (complex calculations, large data processing)
- Profiling shows performance bottleneck with `useFacetMap`

**Rule of thumb:** Start with `useFacetMap`, switch to `useFacetMemo` only when needed.

[Learn more →](./use-facet-memo)

## Effects

React to facet value changes with side effects.

### useFacetEffect

Perform imperative actions when facet values change, similar to React's `useEffect`.

**Key features:**

- Waits for all facets to have values before executing
- Supports cleanup functions (runs before next effect and on unmount)
- Runs asynchronously after render (doesn't block painting)

[Learn more →](./use-facet-effect)

### useFacetLayoutEffect

Synchronous version of `useFacetEffect`, analogous to React's `useLayoutEffect`.

**When to use:**

- DOM measurements needed before browser paint
- Synchronous DOM mutations required
- Immediate layout calculations

**Warning:** Blocks visual updates - use sparingly!

[Learn more →](./use-facet-layout-effect)

## Callback Hook

### useFacetCallback

Create memoized callbacks that depend on facet values, similar to React's `useCallback`.

**Key features:**

- Access current facet values without triggering re-renders
- Stable callback reference
- Optional default return value

[Learn more →](./use-facet-callback)

## Utilities

### useFacetRef

Create a React ref that tracks the current value of a facet.

**Use case:** Access the latest facet value imperatively (e.g., in event handlers, timers).

[Learn more →](./use-facet-ref)

### useFacetWrap

Convert props that might be values or facets into facets. Accepts `Facet<T>` or `T`, always returns `Facet<T>`.

**Behavior:** Creates a new facet instance when the wrapped value changes.

**Use case:** Enable gradual migration by accepting both facets and plain values.

[Learn more →](./use-facet-wrap)

### useFacetWrapMemo

Memoized version of `useFacetWrap` with stable facet reference.

**Behavior:** Maintains the same facet instance, updates value internally.

**Use case:** Wrapping frequently changing props where facet reference stability matters.

[Learn more →](./use-facet-wrap-memo)

### useFacetUnwrap

:::danger Performance Warning
Extract plain values from facets - **causes component re-renders!** Use sparingly.
:::

Converts a `Facet<T>` to plain `T | NO_VALUE`, creating React state that triggers re-renders on updates.

**Only use when:**

- Interfacing with non-facet-aware third-party components
- Complex conditional rendering (though `<Mount>` is usually better)

**Always check for `NO_VALUE`** before using the unwrapped value.

[Learn more →](./use-facet-unwrap)

## Performance Optimization

### useFacetTransition

Mark facet updates as low-priority transitions, keeping the UI responsive during expensive operations.

**Key features:**

- **Returns `isPending` state** - Show loading indicators during transitions
- **Stable callback** - The `startTransition` function reference never changes
- **React 18 integration** - Works with concurrent features

**Also available:** `startFacetTransition(fn)` - Function API for use outside components (doesn't provide `isPending`).

**When to use:**

- Heavy facet updates affecting many components
- Expensive computations triggered by facet changes
- Large list updates or complex UI changes
- Keeping input fields responsive during background processing

[Learn more →](./use-facet-transition)

## Choosing the Right Hook

Quick decision guide for selecting the appropriate hook.

### For State Creation

- **useFacetState** - Creating local component state (like `useState`)

### For Deriving Values

- **Start with useFacetMap** - Default choice for 90% of derivations
- **Switch to useFacetMemo** - Only when profiling shows a bottleneck OR you know you'll have many subscribers

### For Side Effects

- **useFacetEffect** - Asynchronous effects (data fetching, subscriptions, logging)
- **useFacetLayoutEffect** - Synchronous DOM effects (measurements, layout calculations)

### For Callbacks

- **useFacetCallback** - Accessing current facet values in callbacks without re-renders

### For Interop & Migration

- **useFacetWrap** - Default wrapping (simple, creates new facet on value change)
- **useFacetWrapMemo** - When facet reference stability is required
- **useFacetUnwrap** - ⚠️ Last resort when you must work with non-facet-aware code

### For Performance

- **useFacetTransition** - Marking expensive updates as low-priority to keep UI responsive
