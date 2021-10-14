---
sidebar_position: 1
---

# Rendering Overview

There are two principal ways of working with facets:

- [Custom Renderer](#custom-renderer): complete custom renderer that provides the best performance
- [DOM Components](#dom-components) components that are compatible with `react-dom`, but don't provide the same level of performance

It is also possible to [use `Facet`s manually](using-facets-manually), triggering DOM updates as effects, but it is not recommended since it involves a lot of manual wiring and can easily lead to situations in which the performance benefits or `Facet`s are lost.

## Custom Renderer

Using the `@react-facet/dom-fiber` custom renderer is the recommended approach to consume `Facet`s, but be aware: it is also the highest commitment one.

The goal of using a custom renderer is to be able to operate with `Facet`s as first class citizens: by using `@react-facet/dom-fiber` instead of `react-dom`, you have access to the [`fast-*`](../api/fast-components) family of components, that are already aware of facets; and this is implemented at the renderer level, ensuring the highest level of performance.

There are of course some drawbacks: `react-dom` performs a lot of heavy lifting around events; many of React's DOM events are synthetic, meaning that they have no equivalent or behave differently than the in the plain vanilla DOM. `onChange` is a good example of this. By using `@react-facet/dom-fiber`, you are losing this abstraction layer, since it was not implemented in the custom renderer [because it is typically not needed in the game development context](../game-ui-development/overview).

Continue to the section on [Using the Custom Renderer](using-the-custom-renderer) if this solution sounds interesting.

## DOM Components

If you are not ready to go all-in with Facets, or if keeping `react-dom` compatibility is paramount in your codebase, there is an alternative way of using facets with the family of components `@react-facet/dom-components`. These are drop in replacements for the basic HTML components, similar to the [`fast-*` components](../api/fast-components), but as React components compatible with `react-dom` instead of custom primitives.

These are definitely easier to adopt, since you can just install the package and start using them in your existing project. The downside is that they don't provide as good a performance improvement as the custom renderer, but they do still provide performance improvements over vanilla `react-dom`.

If you would like to use the [DOM components you can read more about them here](../api/dom-components).

## Mixing and matching

It is possible to use the DOM Components with the Custom Renderer all together; it is not recommended to keep the DOM Components around once you adopted the Custom Renderer, since the primitive `fast-*` components that the Renderer supports are better optimized than the DOM Components, but it is possible.

This can be useful because it allows for a gradual migration into Facets. It can also be useful when writing a library that supports Facets but cannot be sure how is it going to be consumed; if the library itself is using DOM Components, it will work in both `react-dom` and `@react-facet/dom-fiber` applications.

### Testing

This package includes a drop-in replacement based on `@testing-library/react` that will use the custom renderer instead of `react-dom` as a target.

For more information on [`@testing-library/react` head to their docs](https://testing-library.com/docs/react-testing-library/intro/).

```diff
-import {render, fireEvent, waitFor, screen} from '@testing-library/react'
+import {render, fireEvent, waitFor, screen} from '@react-facet/dom-fiber-testing-library'
```
