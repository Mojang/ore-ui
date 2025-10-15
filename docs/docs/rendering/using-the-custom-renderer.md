---
sidebar_position: 2
---

# Using the Custom Renderer

The `@react-facet/dom-fiber` package is a replacement for `react-dom` to work with Facets and React in DOM environments.

To use it, render your application using `createRoot` from `@react-facet/dom-fiber`:

```tsx twoslash
// @esModuleInterop
import React, { useCallback } from 'react'
import { createRoot } from '@react-facet/dom-fiber'
import { useFacetState, NO_VALUE } from '@react-facet/core'

const Counter = () => {
  const [counter, setCounter] = useFacetState(0)

  const handleIncrement = useCallback(
    () =>
      setCounter((counter) => {
        return counter !== NO_VALUE ? counter + 1 : counter
      }),
    [],
  )
  const handleDecrement = useCallback(
    () =>
      setCounter((counter) => {
        return counter !== NO_VALUE ? counter - 1 : counter
      }),
    [],
  )

  return (
    <div>
      <p>
        Counter: <fast-text text={counter} />
      </p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<Counter />)
```

> **Note:** The `render` function is deprecated. Use `createRoot` instead, which follows React 18's concurrent rendering API.

## `fast-*` components

The purpose of using the custom renderer is to get access to the `fast-*` family of components, which are drop-in replacements for HTML components that support `Facet`s as properties out of the box. You can refer to the [`fast-*` components](../api/fast-components) for all details.

## Compatibility with `react-dom`

The main drawback of adopting `@react-facet/dom-fiber` is that some features of React DOM are not ported. The reason for not aiming at total compatibility has to do with React Facet's aim: [as a library designed for Game UI development](../game-ui-development/overview), performance is paramount, and whenever there is a trade-off between compatibility and performance, we opted for performance.

In particular, React DOM goes a long way to simplify native DOM events. Several well-known React events, such as `onChange`, are actually synthetic events created by React DOM as a developer experience / cross-browser compatibility layer. This is excellent, but it adds overhead that is not necessary in the development of Game UIs: in game UIs, the browser environment is [typically well known](../game-ui-development/overview#target-runtimes) and the challenge is to support a wide range of hardware, not different browser engines.

All this means that `@react-facet/dom-fiber` does not do any cross-browser abstraction, or really any abstraction whatsoever over the default DOM events as supported by the underlying engine. Since the browser engines for Game UIs that we are currently targeting are based on modern browsers, this does not prove to be a problem in practice. However, it does mean that some third-party React components designed to work with `react-dom` might malfunction when used with `@react-facet/dom-fiber`, if they rely on `react-dom` synthetic APIs.
