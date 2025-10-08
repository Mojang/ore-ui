---
sidebar_position: 1
---

# Goals

React Facet is a React library meant to provide performant state management for game UIs using web technologies.

The issue that React Facet aims to address is that vanilla React state management via props and `useState` is not performant enough for the budget requirements of games, specially in slower devices. This is not typically a concern for React web applications, since there isn't an expectation that web applications will update on a fixed budget of frames per second, so the tooling around React is not already optimized for the game UI use case.

React Facet aims to address this issue by turning state management into a parallel mechanism to React's own state, to avoid the processing that causes the most cost in terms of performance. In particular:

- React Facet makes it possible to update leaf values in a React tree without triggering reconciliation. Mounting and unmounting is still costly, but updates to styles, text content and attributes of HTML elements are [significantly cheaper](citation needed) when reconciliation is bypassed.

## Web technology in game UIs? But why?

The explosive growth of web application development in the last decades caused a lot of knowledge and tooling on how to do great UIs to have been accumulated within the web community. In turn, this led to the adoption of web-inspired technologies into non-web platforms, such as the integration of JavaScript engines as part of iOS development libraries, and many efforts to make mobile application development look like web development to drive developers into the mobile platforms.

Games have started integrating web engines into their platform to be able to make use of the talent pool and tooling already available for UI development. In particular, [Coherent Lab's Gameface](https://coherent-labs.com/products/coherent-gameface/) provides a web browser environment that can be directly integrated into a C++ codebase, with plugins to Unreal Engine and Unity. Other similar options are the [Chromium Embedded Framework](https://en.wikipedia.org/wiki/Chromium_Embedded_Framework), [Ultralight](https://ultralig.ht/) and [Cobalt](https://cobalt.foo/).

## UI state management within Game Engines

TODO

## Platform characteristics

React Facet is targeted quite specifically at Game UI development. In particular, Game UIs implemented with embedded web technologies, such as [Coherent Labs' Gameface](https://coherent-labs.com/products/coherent-gameface/) and [Chromium Embedded Framework](https://github.com/chromiumembedded).

This means that not all features associated with end-user browsers are available in the environments where we intend React Facet to be primarily used. In turn, this means that the Custom Renderer and DOM Components target a subset of the DOM, the subset that it known to work well with Gameface and that we deem essential.

You can check the [entire list of supported properties here](api/supported-attributes)
