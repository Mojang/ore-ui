---
sidebar_position: 2
---

# Getting started

Here's a very simple example of how using `Facet`s for state management could look like:

<!-- Note to docs devs ⚠️ Make sure the ^? below is using a non-breaking space to get the right whitespace count without being linted away -->

```tsx twoslash
// @esModuleInterop
import React, { useCallback } from 'react'
import { useFacetState, NO_VALUE } from '@react-facet/core'
import { createRoot } from '@react-facet/dom-fiber'

const Counter = () => {
  const [counter, setCounter] = useFacetState(0)
  const handleClick = useCallback(() => {
    setCounter((counter) => (counter !== NO_VALUE ? counter + 1 : counter))
  }, [setCounter])

  return (
    <div>
      <p>
        Current count: <fast-text text={counter} />
        //                              ^?
      </p>
      <button onClick={handleClick}>Increment</button>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<Counter />)
```

## Installation

The packages of React Facet are grouped under the `@react-facet` scope on npm. To install the packages for the example above, run:

```sh
yarn add @react-facet/core @react-facet/dom-fiber
```

Note that if you want to use other [packages](api/packages), you will need to install them separately.

## Using `fast-*` Components

## Using the Custom Renderer

We recommend using the custom Renderer provided with [`@react-facet/dom-fiber`](rendering/using-the-custom-renderer) to leverage the full power of `Facet`s.

To render with the custom renderer, use `createRoot` from `@react-facet/dom-fiber`:

```tsx twoslash
// @esModuleInterop
import { useFacetState } from '@react-facet/core'
import { createRoot } from '@react-facet/dom-fiber'

const HelloWorld = () => {
  const [className, setClassName] = useFacetState('root')
  const [helloWorld, setHelloWorld] = useFacetState('Hello World!')

  return (
    <fast-div className={className}>
      <fast-text text={helloWorld} />
    </fast-div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<HelloWorld />)
```

## Creating Facets

Facets are just JavaScript objects that update over time. An example of a facet interface definition could be:

```tsx twoslash
export interface UserFacet {
  username: string
  signOut(): void
}
```

They can be initialized by using Hooks provided in `@react-facet/core`, and can be read and written to:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'

interface Props {
  onSubmit: (values: any) => void
}
// ---cut---
import { useFacetMap, useFacetState, useFacetCallback, NO_VALUE } from '@react-facet/core'

interface TemporaryValuesFacet {
  username: string
  password: string
}

const UpdateLogin = ({ onSubmit }: Props) => {
  const [temporaryValues, updateValues] = useFacetState<TemporaryValuesFacet>({
    username: '',
    password: '',
  })
  const username = useFacetMap((values) => values.username, [], [temporaryValues])
  const password = useFacetMap((values) => values.password, [], [temporaryValues])
  const handleClick = useFacetCallback(
    (values) => () => {
      onSubmit(values)
    },
    [onSubmit],
    [temporaryValues],
  )

  return (
    <div>
      <p>User name</p>
      <fast-input
        type="text"
        value={username}
        onKeyUp={(event) => {
          updateValues((values) => {
            if (values !== NO_VALUE) {
              values.username = (event.target as HTMLInputElement).value
            }
            return values
          })
        }}
      />

      <p>Password</p>
      <fast-input
        type="text"
        value={password}
        onKeyUp={(event) => {
          updateValues((values) => {
            if (values !== NO_VALUE) {
              values.password = (event.target as HTMLInputElement).value
            }
            return values
          })
        }}
      />

      <button onClick={handleClick}>Submit</button>
    </div>
  )
}
```

## Interfacing with the game engine (Shared Facets)

[Shared facets](game-ui-development/shared-facet) are facets that come from the "backend" game engine, usually implemented in C++. They are largely used the same way as "local" facets, except for a couple key differences:

1. They **cannot** be mutated directly by JavaScript
2. They are available globally
3. They must be initialized using `sharedFacet`
4. They must be consumed in a React Component with `useSharedFacet`

To use shared facets, you must wrap your React application inside `SharedFacetDriverProvider`. You must also provide a `sharedFacetDriver`, which takes care of requesting the facet from a C++ backend and registering a listener to be notified about updates. Below you can find a pseudo-code of a how an implementation would look like using an `engine` that implements `EventEmitter`

```tsx twoslash
const engine = {
  on: (...args: any[]) => {},
  off: (...args: any[]) => {},
  trigger: (...args: any[]) => {},
}
// ---cut---
import { SharedFacetDriverProvider, OnChange } from '@react-facet/shared-facet'
const sharedFacetDriver = (facetName: string, update: OnChange<unknown>) => {
  // register a listener
  engine.on(`facet:updated:${facetName}`, update)

  // trigger an event to notify C++ we want to listen for updates
  engine.trigger('facet:request', facetName)

  // returns a cleanup function once no more components need the facet data
  return () => {
    engine.off(`facet:updated:${facetName}`, update)
    engine.trigger('facet:discard', facetName)
  }
}

const App = () => {
  return <SharedFacetDriverProvider value={sharedFacetDriver}>...</SharedFacetDriverProvider>
}
```

An example of defining and consuming a shared facet:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useSharedFacet, sharedFacet, sharedSelector } from '@react-facet/shared-facet'

interface UserFacet {
  username: string
  signOut(): void
}

const userFacet = sharedFacet<UserFacet>('data.user', {
  username: 'Alex',
  signOut() {},
})

const usernameSelector = sharedSelector((value) => value.username, [userFacet])

export const CurrentUser = () => {
  const username = useSharedFacet(usernameSelector)
  return <fast-text text={username} />
}
```
