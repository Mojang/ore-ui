---
sidebar_position: 2
---

# Hooks

The API of the hooks used to define, manipulate and consume facets is modelled after the API of the standard React Hooks; similarly named hooks have similar functionalities.

This is done to make it easier to understand the purpose of each hook, but it is also because they are very similar to the default React Hooks; they just happen to support `Facet`s as dependencies, alongside regular props.

There are only three hooks that have no equivalence in React:

- [`useFacetMap`](#usefacetmap) is used to derive a `Facet` from another(s)
- [`useFacetWrap`](#usefacetwrap) is used to encapsulate a regular value in a `Facet`
- [`useFacetUnwrap`](#usefacetunwrap) is used to get the plain value from inside a `Facet`

### `useFacetState`

To define facets within React components, there is a main hook `useFacetState` that provides a very familiar API when compared with React's `useState`.

Returns a `[facet, setFacet]` pair. Like React’s `useState`, but with a Facet instead of a value.

This example illustrates how to use this hook in the common use case of having to store the temporary state of the input field until it is submitted.

```tsx twoslash
// @esModuleInterop
import { useCallback } from 'react'
import { render, KeyboardCallback } from '@react-facet/dom-fiber'
import { useFacetMap, useFacetState, useFacetCallback } from '@react-facet/core'

interface Props {
  onSubmit: (value: string) => void
  initialValue: string
}

// ---cut---
const Form = ({ onSubmit, initialValue }: Props) => {
  const [value, setValue] = useFacetState(initialValue)

  const handleChange = useCallback<KeyboardCallback>(
    (event) => {
      if (event.target instanceof HTMLInputElement) {
        setValue(event.target.value)
      }
    },
    [setValue],
  )

  const handleClick = useFacetCallback(
    (currentValue) => () => {
      onSubmit(currentValue)
    },
    [onSubmit],
    [value],
  )

  return (
    <fast-div>
      <fast-input onKeyUp={handleChange} value={value} />

      <fast-div onClick={handleClick}>Submit</fast-div>
    </fast-div>
  )
}
```

## `useFacetCallback`

The `useFacetCallback` hook is similar to React’s `useCallback` in that it allows you to create a memoized callback that will only be updated if some of the explicit dependencies change. On top of that, `useFacetCallback` allows you to pass one or more Facets and get the current values of those facets in the callback body.

Say for example that you have a small form, and want to create a handler for the Submit action. You need to have access to the current value of a facet that stores the `value` of an input field in order to send that value back to the parent component when the `Submit` button of the form. `useFacetCallback` allows you to create such handler, which will always have access to the current value of the facet.

```tsx twoslash
// @esModuleInterop
import { render, KeyboardCallback } from '@react-facet/dom-fiber'
interface Props {
  onSubmit: (value: string) => void
  initialValue: string
}
// ---cut---
import { useCallback } from 'react'
import { useFacetState, useFacetCallback } from '@react-facet/core'

const Form = ({ onSubmit, initialValue }: Props) => {
  const [value, setValue] = useFacetState(initialValue)

  const handleChange = useCallback<KeyboardCallback>(
    (event) => {
      if (event.target instanceof HTMLInputElement) {
        setValue(event.target.value)
      }
    },
    [setValue],
  )

  const handleClick = useFacetCallback(
    (currentValue) => () => {
      onSubmit(currentValue)
    },
    [onSubmit],
    [value],
  )

  return (
    <fast-div>
      <fast-input onKeyUp={handleChange} value={value} />

      <fast-div onClick={handleClick}>Submit</fast-div>
    </fast-div>
  )
}
```

## `useFacetEffect`

The `useFacetEffect` hook gives you a way of performing some imperative action (effect) whenever the underlying facets are updated. It is very similar in structure and goal to React’s own `useEffect`.

Like `useEffect`, `useFacetEffect` takes an effect function to be called when the updates happen, a dependency list, and finally an array of facets. If there are more than one facet in the array, then the `useFacetEffect` will only be called when all facets have a value. This is an implementation made to avoid flickering. Once all facets do have a value, the `useFacetEffect` will be called when a value changes in any facet.

```tsx twoslash
// @esModuleInterop
import { useFacetEffect, useFacetState } from '@react-facet/core'

const Logger = ({ shouldLog }: { shouldLog: boolean }) => {
  const [statusFacet, setStatusFacet] = useFacetState('loading')

  useFacetEffect(
    (newStatus) => {
      if (shouldLog) {
        console.log('Status was updated to: ' + newStatus)
      }
    },
    [shouldLog],
    [statusFacet],
  )

  return <span>{shouldLog ? 'Logger is active' : 'Logger is disabled'}</span>
}
```

It also supports a cleanup function that can be returned by the effect function. This cleanup is called whenever any of the dependencies or the facets have changed or when the component is unmounted. In short, it behaves exactly like React’s `useEffect`.

```tsx twoslash
// @esModuleInterop
import { useFacetEffect, useFacetState } from '@react-facet/core'

const Logger = ({ shouldLog }: { shouldLog: boolean }) => {
  const [statusFacet, setStatusFacet] = useFacetState('loading')

  useFacetEffect(
    (newStatus) => {
      const timerId = setTimeout(() => {
        if (shouldLog) {
          console.log('Status was updated to: ' + newStatus)
        }
      }, 1000)

      // Supports a cleanup function (same as React’s useEffect)
      return () => clearTimeout(timerId)
    },
    [shouldLog],
    [statusFacet],
  )

  return <span>{shouldLog ? 'Logger is active' : 'Logger is disabled'}</span>
}
```

## `useFacetLayoutEffect`

Much like React offers a `useLayoutEffect` as a complement to `useEffect`, so too does `react-facet` offer a `useFacetLayoutEffect`. It takes the exact same input as `useFacetEffect` and has an identical implementation, the sole exception being that it uses React's underlying `useLayoutEffect` instead that fires synchronously after all DOM mutations.

## `useFacetMap`

The `useFacetMap` hook allows you to do a sort of "inline selector" to narrow down the data from a facet inside a component’s body.

This is useful to be able to combine React component props with facet data and to prepare the facet to be passed down as a prop / style into a `fast-*` component.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMap } from '@react-facet/core'

const HealthBar = ({ lowHealthThreshold }: { lowHealthThreshold: number }) => {
  const [playerFacet, setPlayerFacet] = useFacetState({
    health: 80,
    mana: 65,
  })

  const className = useFacetMap(
    ({ health }) => (health > lowHealthThreshold ? 'healthy' : 'hurt'),
    [lowHealthThreshold],
    [playerFacet],
  )

  return <fast-div className={className} />
}
```

The `useFacetMap` hook supports passing in several facets to listen to, so you can merge the values of several facets into one using it.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMap, Facet } from '@react-facet/core'

type Props = {
  placeholderFacet: Facet<string>
  valueFacet: Facet<string>
}

const InputField = ({ placeholderFacet, valueFacet }: Props) => {
  const valueToDisplay = useFacetMap(
    (placeholder, value) => (value != null ? value : placeholder),
    [],
    [placeholderFacet, valueFacet],
  )

  return (
    <span>
      <fast-text text={valueToDisplay} />
    </span>
  )
}
```

Optionally, you can pass an equality check function as the fourth argument to `useFacetMap`. This is particularly useful when grouping more than one facet together into a single array / object, since hard equality checks will not work on arrays / objects.

```tsx twoslash
const SubComponent = ({ facets }: { facets: any }) => null
// ---cut---
// @esModuleInterop

import { shallowArrayEqualityCheck, useFacetState, useFacetMap } from '@react-facet/core'


const WrapperComponent = () => {
	const [facetA, setFacetA] = useFacetState('A')
	const [facetB, setFacetB] = useFacetState('B')

	const groupedFacet = useFacetMap(
		(a, b) => [a, b],
		[],
		[facetA, facetB],
		shallowArrayEqualityCheck
	)

	return <SubComponent facets={groupedFacet} />
}
```

## `useFacetMemo`

TODO

## `useFacetRef`

Returns a React `Ref` with the value held inside the provided Facet.

Analog to React's `useRef`, but the argument it receives is a Facet instead of a plain value.

Whenever the value inside the provided Facet is updated, the value inside the
`current` property of the `Ref` will be also updated.

If the `Facet` is not yet initialized, the `Ref` will contain a `NO_VALUE`

```tsx twoslash
import { useEffect } from 'react'
import { useFacetRef, Facet } from '@react-facet/core'

const LogWhenRendered = ({ exampleFacet }: { exampleFacet: Facet<unknown>}) => {
  const facetRef = useFacetRef(exampleFacet)

  useEffect(() => {
    console.log(`The exampleFacet value at the time of rendering: ${facetRef.current}`)
  })

  return null
}
```

## `useFacetWrap`

To simplify the use case in which a certain variable can hold either a value or a Facet containing that value, `useFacetWrap` accepts plain values or facets (a generic type called `FacetProp<A>`, which will either be `A` or `Facet<A>`) and lifts them into a facet. This allows you to migrate components more easily, since inside the implementation can work exclusively with facets and the prop can support both regular values and facets.

> Note that if the consumers of the component pass a regular prop instead of a facet, that will cause the component to re-render, negating all performance benefits. This hook is useful to be able to migrate, for compatibility, but it is still recommended that all consumers of the components that support facets use facets for maximum performance improvement.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMap, useFacetState, useFacetWrap, FacetProp,  } from '@react-facet/core'

type ButtonProps = {
  isDisabled: FacetProp<boolean>
}

const Button = ({ isDisabled }: ButtonProps) => {
  const isDisabledFacet = useFacetWrap(isDisabled)
  const className = useFacetMap((isDisabled) => (isDisabled ? 'disabled' : 'active'), [], [isDisabledFacet])

  return <fast-div className={className} />
}

const Submit = () => {
  const [isDisabledFacet, setIsDisabledFacet] = useFacetState(false)

  // It can receive a facet as in the examples before
  return <Button isDisabled={isDisabledFacet} />
}

const Cancel = () => {
  // But it can also receive a plain value!
  return <Button isDisabled={false} />
}
```

## `useFacetUnwrap`

**Note: this particular hook will negate all the performance benefits of using Facets for state management.** This hook exists mostly to enable a simpler migration while we adapt existing code, but should be avoided whenever possible.

The `useFacetUnwrap` hook gives a way to access the value of a facet as a regular React component state.

The upside is that it is backwards compatible, but the downside is that any updates to the facet will cause a re-render of the component where `useFacetUnwrap` is being used.

For most scenarios, consider using the other hooks or the facet itself directly into a `fast.*` component instead. That approach removes all unnecessary React re-renders.

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetMap, useFacetUnwrap, NO_VALUE } from '@react-facet/core'

const HealthBar = ({ lowHealthThreshold }: { lowHealthThreshold: number }) => {
  const [playerFacet, setPlayerFacet] = useFacetState({ health: 80, mana: 65 })

  const health = useFacetUnwrap(useFacetMap(({ health }) => health, [], [playerFacet]))
  const className = health !== NO_VALUE && health > lowHealthThreshold ? 'healthy' : 'hurt'

  return <div className={className} />
}
```
