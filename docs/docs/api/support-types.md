---
sidebar_position: 10
---

# Support Types

## `StrictReactNode`

More strict type than default `React.ReactNode`

It prevents passing a function as a Node. This allow us to catch accidental passing of `Facet`s as `children`.
