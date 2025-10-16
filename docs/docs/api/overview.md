---
sidebar_position: 1
---

# API Overview

React Facet provides a complete API for building performant game UIs with observable state management. This overview covers the main APIs you'll use when building with React Facet.

## Hooks

React Facet provides a comprehensive set of hooks for working with facets. Most mirror standard React hooks, making them familiar and easy to learn.

### Core State & Derivation Hooks

**Standard React analogs:**

- [`useFacetState`](./hooks/use-facet-state) - Create local facet state (`useState` equivalent)
- [`useFacetEffect`](./hooks/use-facet-effect) - React to facet changes (`useEffect` equivalent)
- [`useFacetLayoutEffect`](./hooks/use-facet-layout-effect) - Synchronous facet effects (`useLayoutEffect` equivalent)
- [`useFacetMemo`](./hooks/use-facet-memo) - Cached derived facets (`useMemo` equivalent)
- [`useFacetCallback`](./hooks/use-facet-callback) - Memoized callbacks (`useCallback` equivalent)
- [`useFacetRef`](./hooks/use-facet-ref) - Ref tracking facet values (`useRef` equivalent)

**Facet-specific hooks:**

- [`useFacetMap`](./hooks/use-facet-map) - Derive facets (lightweight, default choice)
- [`useFacetWrap`](./hooks/use-facet-wrap) - Convert values or facets to facets
- [`useFacetWrapMemo`](./hooks/use-facet-wrap-memo) - Wrap with stable facet reference
- [`useFacetUnwrap`](./hooks/use-facet-unwrap) - ⚠️ Extract plain values (causes re-renders)
- [`useFacetTransition`](./hooks/use-facet-transition) - Mark updates as low-priority transitions

[View all hooks →](./hooks/)

## Mount Components

Conditional rendering components that work seamlessly with facets and the custom renderer.

- [`Mount`](./mount-components#mount) - Conditionally mount children based on a `Facet<boolean>`
- [`Map`](./mount-components#map) - Render lists from a `Facet<Array<T>>`
- [`With`](./mount-components#with) - Render with facet value (scopes re-renders)

**When to use:** These components are essential for conditional rendering and lists when working with facets, as they prevent unnecessary re-renders by scoping updates.

[Learn more about Mount components →](./mount-components)

## `fast-*` Components

High-performance DOM elements that accept facets directly as props, bypassing React reconciliation for updates.

**Available with [`@react-facet/dom-fiber`](../rendering/using-the-custom-renderer):**

- [`fast-div`](./fast-components) - Container element
- [`fast-text`](./fast-components) - Text content (no wrapper element)
- [`fast-input`](./fast-components) - Text input field
- [`fast-textarea`](./fast-components) - Multi-line text input
- [`fast-img`](./fast-components) - Image element
- [`fast-a`](./fast-components) - Anchor/link element
- [`fast-span`](./fast-components) - Inline element
- [`fast-p`](./fast-components) - Paragraph element

**When to use:** Use `fast-*` components when you need to bind facets to DOM properties. For static content or non-facet props, regular HTML elements work fine.

**Performance benefit:** Updates to facet-bound props bypass React reconciliation, providing near-native DOM performance.

[Learn more about fast-components →](./fast-components)

## Equality Checks

Built-in equality check functions for controlling when facets update.

- [`defaultEqualityCheck`](./equality-checks#defaultequalitycheck) - Default (primitives: `===`, objects/arrays: always different). **Performance optimized**.
- [`strictEqualityCheck`](./equality-checks#strictequalitycheck) - Type-safe strict equality for primitives and functions only
- [`shallowObjectEqualityCheck`](./equality-checks#shallowobjectequalitycheck) - Shallow object comparison
- [`shallowArrayEqualityCheck`](./equality-checks#shallowarrayequalitycheck) - Shallow array comparison

**When to use:** Pass custom equality checks to hooks like `useFacetMap` and `useFacetMemo` to prevent unnecessary updates when deriving objects or arrays. For primitives, the default is already optimized.

[Learn more about equality checks →](./equality-checks)

## Helpers

Utility functions for working with facets.

- [`multiObserve`](./helpers#multiobserve) - Observe multiple facets simultaneously
- [`hasDefinedValue`](./helpers#hasdefinedvalue) - Check if a facet has a value (not `NO_VALUE`)
- [`areAllDefinedValues`](./helpers#arealldefinedvalues) - Check if all facets have values

[View helper functions →](./helpers)
