---
sidebar_position: 1
---

# Rendering Overview

There are two principal ways of working with facets:

- [Custom Renderer](#custom-renderer): complete custom renderer that provides the best performance (recommended)
- [Manual Facet Usage](using-facets-manually): triggering DOM updates as effects (not recommended)

## Custom Renderer

Using the `@react-facet/dom-fiber` custom renderer is the **recommended approach** to use `Facet`s in your application.

The goal of using a custom renderer is to operate with `Facet`s as first-class citizens. By using `@react-facet/dom-fiber` instead of `react-dom`, you have access to the [`fast-*`](../api/fast-components) family of components that are natively aware of facets. This is implemented at the renderer level, ensuring the highest level of performance.

There are some important differences from `react-dom`: React DOM performs heavy lifting around events, providing synthetic events that behave differently from vanilla DOM events. By using `@react-facet/dom-fiber`, you're using the native DOM event system instead. This is typically not a problem in game development contexts, where synthetic event behavior isn't needed.

Continue to the section on [Using the Custom Renderer](using-the-custom-renderer) to get started.

## Manual Facet Usage

It is possible to [use `Facet`s manually](using-facets-manually), triggering DOM updates as effects. However, this is **not recommended** since it involves extensive manual wiring and can easily lead to situations where the performance benefits of `Facet`s are lost.

## Testing

The `@react-facet/dom-fiber-testing-library` package provides a drop-in replacement for `@testing-library/react` that uses the custom renderer instead of `react-dom`.

For more information on the testing library, see the [`@testing-library/react` docs](https://testing-library.com/docs/react-testing-library/intro/).

```diff
-import {render, fireEvent, waitFor, screen} from '@testing-library/react'
+import {render, fireEvent, waitFor, screen} from '@react-facet/dom-fiber-testing-library'
```
