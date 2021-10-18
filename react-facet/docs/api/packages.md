---
sidebar_position: 9
---

# Overview of packages

`@react-facet/core` includes:

- Implementation of core `Facet` data structure
- Functions for constructing and operating with `Facet`s
- React Hooks for working with `Facet`s inside React components

`@react-facet/dom-fiber` includes:

- A custom React Renderer that understands `Facet`s natively
- Implementation of `fast-*` components to be used in place of traditional JSX DOM elements when using `Facet`s

`@react-facet/dom-components` includes:

- React components that have an identical API surface to `fast-*` components, but not reliant on the custom Renderer.
- Useful for teams looking to progressively adopt `Facet`s

`@react-facet/remote` includes:

- Custom `Facet` designed to interface directly with game engines that use Gameface
- Custom `Context` component for driving communication between React and the game engine
- React hooks and helper functions for using `remoteFacet`s

`@react-facet/dom-fiber-testing-library` includes:

- Testing utilities
