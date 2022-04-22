---
sidebar_position: 2
---

# Getting started

Here's a very simple example of how using `Facet`s for state management could look like:

```tsx twoslash
// @esModuleInterop
// @errors: 2365
import React, { useCallback } from 'react'
import { useFacetState, NO_VALUE } from '@react-facet/core'
import { render } from '@react-facet/dom-fiber'

const Counter = () => {
  const [counter, setCounter] = useFacetState(0)
  const handleClick = useCallback(() => {
    setCounter((counter) => counter + 1)
  }, [setCounter])

  return (
    <div>
      <p>
        Current count: <fast-text text={counter} />
      </p>
      <button onClick={handleClick}>Increment</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

## Installation

The packages of React Facet are grouped under the `@react-facet` scope on npm. To install the packages for the example above, run:

```sh
yarn add @react-facet/core @react-facet/dom-fiber
```

Note that if you want to use other [packages](api/packages), such as the [DOM Components](api/dom-components), you will need to install them separately:

```sh
yarn add @react-facet/dom-components
```

…and so on for any other required package.

### Fastest path

Use the components provided in [`@react-facets/dom-components`](api/dom-components) wherever you need to render using `Facet`s. There are components that serve as drop-in replacements for most of the heavily used HTML elements.

While this won't give you the full performance benefits of Facets, it provides an easier/less risky adoption path if you have a large codebase.

> Note: since Gameface only supports a subset of HTML elements, we don't attempt to create components for every single HTML element.

```tsx twoslash
// @esModuleInterop
// @errors: 2305
import { useFacetState } from '@react-facet/core'
import { Div, Text } from '@react-facet/dom-components'

const HelloWorld = () => {
  const [className, setClassName] = useFacetState('root')
  const [text, setText] = useFacetState('Hello World!')

  return (
    <Div className={className}>
      <Text text={text} />
    </Div>
  )
}
```

### Recommended path

We recommend using the custom Renderer provided with [`@react-facet/dom-fiber`](rendering/using-the-custom-renderer) to leverage the full power of `Facet`s.

To render with the custom renderer, replace the `render` function from `react-dom` with the new one:

```diff
- import { render } from 'react-dom'
+ import { render } from '@react-facet/dom-fiber'
```

From here, you can start using [`fast-*`](api/fast-components) elements anywhere you need to bind a `Facet` to the DOM:

```tsx twoslash
// @esModuleInterop
// @errors: 2695 1109
import { useFacetState } from '@react-facet/core'
import { render } from '@react-facet/dom-fiber'

const HelloWorld = () => {
	const [className, setClassName] = useFacetState('root')
	const [helloWorld, setHelloWorld] = useFacetState('Hello World!')

	return (
		<fast-div className={className}>
			<fast-text text={helloWorld} />
		</fast-div>,
	)
}

render(<HelloWorld />, document.getElementById('root'))
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

```tsx
interface TemporaryValuesFacet {
  username: string
  password: string
}

const UpdateLogin = ({ onSubmit }) => {
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
        onChange={(event) => {
          updateValues((values) => {
            values.username = event.target.value
            return values
          })
        }}
      />

      <p>Password</p>
      <fast-input
        type="text"
        value={password}
        onChange={(event) => {
          updateValues((values) => {
            values.password = event.target.value
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

```ts
const sharedFacetDriver = (facetName, update) => {
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

```tsx
interface UserFacet {
	username: string
	signOut(): void
}

const userFacet = sharedFacet<UserFacet>('data.user', {
	username: 'Alex',
	signOut() {},
})

const usernameSelector = sharedSelector([userFacet], (value) => value.username);

export const CurrentUser = () => {
	const username = useSharedFacet(usernameSelector)

	return <fast-p>
		<fast-text text={username}>
	</fast-p>
}
```
