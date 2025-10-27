---
sidebar_position: 4
---

# Mount Components

Neither the `fast-*` components supported by the custom renderer nor the components in `@react-facet/dom-elements` provide a way to mount or unmount children based on the value of a `Facet`.

For that purpose, you can use the [`Mount`](#mount), [`Map`](#map), and [`With`](#with) components. They allow you to add or remove nodes in the React tree.

## `Mount`

Mounts its children conditionally. The mandatory prop `when` should be a `Facet<boolean | undefined>`. The component's children will be mounted when value contained within the `Facet` is `true`.

Example:

```tsx twoslash
// @esModuleInterop
import { useFacetState, Mount } from '@react-facet/core'

const Example = () => {
  const [displayFacet, setDisplayFacet] = useFacetState(true)

  return (
    <Mount when={displayFacet}>
      <div>Hello there</div>
    </Mount>
  )
}
```

The `Mount` component is commonly used together with `useFacetMap`. For example, imagine that you have a search bar and a search results component. You might only want to show the search results component if the search bar has a value. That can be accomplished like so:

```tsx twoslash
// @esModuleInterop
const SomeComponent = () => null
// ---cut---
import { useFacetState, useFacetMap, Mount } from '@react-facet/core'

const Example = () => {
  const [valueFacet, setValueFacet] = useFacetState('')

  const isValueNotNullOrEmptyFacet = useFacetMap(
    (value) => {
      return value != null && value.length > 0
    },
    [],
    [valueFacet],
  )

  return (
    <Mount when={isValueNotNullOrEmptyFacet}>
      <SomeComponent />
    </Mount>
  )
}
```

Additionally, the `Mount` component takes an optional prop called `condition`. This will default to `true`. When set to `false`, it will mount its children when when the value contained within the `Facet` is `false`.

```tsx twoslash
// @esModuleInterop
import { useFacetState, Mount } from '@react-facet/core'

const Example = () => {
  const [isSignedInFacet, setIsSignedInFacet] = useFacetState(true)

  return (
    <>
      <Mount when={isSignedInFacet}>
        <div>You are logged in!</div>
      </Mount>
      <Mount when={isSignedInFacet} condition={false}>
        <div>Create an account.</div>
      </Mount>
    </>
  )
}
```

## `Map`

Mounts a list of components based on a `Facet` of an array.

The length of the array passed into the `array` prop is used to determine how many components to mount. The `children` of the `Map` components should be a function, and this function will receive a `Facet` containing the data and index of the current item.

The `Map` only re-renders if the size of the array changes, so we need to be mindful about changing the size of the array, as it will cause a performance hit. On the other hand, if only the data inside the items in the list change, but not the _amount_ of items, there will be no re-render: the `Facet` passed into the `children` function will simply be updated with the latest data.

Example:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, Map } from '@react-facet/core'

const Example = () => {
  const [arrayFacet, setArrayFacet] = useFacetState(['1', '2', '3', '4', '5'])

  return (
    <Map array={arrayFacet}>
      {(item) => (
        <span>
          <fast-text text={item} />
        </span>
      )}
    </Map>
  )
}
```

`Map` accepts an optional equality check, to be performed and prevent unnecessary facet updates.

Example:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMap, Map, Facet, shallowObjectEqualityCheck } from '@react-facet/core'

type Input = { value: string }

const Example = () => {
  const [arrayFacet, setArrayFacet] = useFacetState<Input[]>([
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
  ])

  const PrintItem = ({ item, index }: { item: Facet<Input>; index: number }) => {
    return (
      <span>
        <fast-text text={useFacetMap(({ value }) => value, [], [item])} />
        <span>{index}</span>
      </span>
    )
  }

  return (
    <Map array={arrayFacet} equalityCheck={shallowObjectEqualityCheck}>
      {(item, index) => <PrintItem item={item} index={index} />}
    </Map>
  )
}
```

## `With`

Mounts its children conditionally. The mandatory prop `data` should be a Facet of any type (`Facet<T | null | undefined>`). The component's children will be mounted when value contained within the `Facet` is not `null` or `undefined`.

This component is meant to solve an issue with refining types in TypeScript. When the `data` prop facet contains a value, `With` will call the function passed as `children`, passing the `data` Facet as an argument. The type becomes refined so that it will not be `null` or `undefined`.

Example:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, With, FacetProp, useFacetWrap } from '@react-facet/core'

type UserDataProps = {
  name: FacetProp<string>
  middlename?: FacetProp<string | undefined>
}

const UserData = ({ name, middlename }: UserDataProps) => {
  const nameFacet = useFacetWrap(name)
  const middlenameFacet = useFacetWrap(middlename)

  return (
    <div>
      <p>
        Name: <fast-text text={nameFacet} />
      </p>
      <With data={middlenameFacet}>
        {(middlenameFacetWithData) => (
          <p>
            Middlename: <fast-text text={middlenameFacetWithData} />
          </p>
        )}
      </With>
    </div>
  )
}
```

For contrast, attempting to do the same thing with `Mount` will _not_ allow for correct type checking. In this scenario, the type of `middlenameFacet` is not refined and could still contain a `null` or `undefined`.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrap, useFacetMap, Mount, FacetProp } from '@react-facet/core'

type UserDataProps = {
  name: FacetProp<string>
  middlename?: FacetProp<string | undefined>
}

const UserData = ({ name, middlename }: UserDataProps) => {
  const nameFacet = useFacetWrap(name)
  const middlenameFacet = useFacetWrap(middlename)

  return (
    <div>
      <p>
        Name: <fast-text text={nameFacet} />
      </p>
      <Mount when={useFacetMap((middlename) => middlename != null, [], [middlenameFacet])}>
        <p>
          Middlename: <fast-text text={useFacetMap((middlename) => middlename || '', [], [middlenameFacet])} />
        </p>
        {/* Since TypeScript cannot know that `middlenameFacet` now holds a `string` for sure, it will still believe that
            it could be `string | undefined`. The only way to solve this issue is to extract a new component or use a type
            assertion. Neither is a good option, hence we recommend using `With` instead in this scenario. */}
      </Mount>
    </div>
  )
}
```

## `Unwrap`

The `Unwrap` component extracts the plain value from a `Facet` and renders children with that unwrapped value. Use it when you need to pass a plain value into JSX (for example to a third-party component), or when you want to limit the scope of a React re-render to a small subtree.

Important: `Unwrap` uses `useFacetUnwrap` internally, which creates React state for the unwrapped value. However, `Unwrap` typically produces a smaller re-render scope than calling `useFacetUnwrap` at the top level of a component because it confines the stateful re-render to its children.

Signature:

```tsx
<Unwrap data={someFacet}>{(value) => <SomeChild value={value} />}</Unwrap>
```

Basic example:

```tsx twoslash
// @esModuleInterop
import { useFacetState, Unwrap } from '@react-facet/core'

const Example = () => {
  const [nameFacet] = useFacetState<string | undefined>('Alex')

  return <Unwrap data={nameFacet}>{(name) => <div>Hello, {name}!</div>}</Unwrap>
}
```

When to use:

- Interfacing with third-party components that accept plain values (not facets).
- Local rendering scenarios where a small, controlled re-render is acceptable.
- Prefer `Unwrap` over calling `useFacetUnwrap` at the top level of your component: `Unwrap` limits the re-render to its children instead of making the entire component re-render on facet updates.

Prefer `Unwrap` over multiple `Mount` components when you need to choose between mutually-exclusive branches. For example, instead of creating two `Mount`s for opposite conditions:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetMap, Mount } from '@react-facet/core'
const Foo = () => <div>Foo</div>
const Bar = () => <div>Bar</div>

const Bad = () => {
  const [condFacet] = useFacetState<boolean | undefined>(true)

  return (
    <>
      <Mount when={useFacetMap((c) => !!c, [], [condFacet])}>
        <Foo />
      </Mount>
      <Mount when={useFacetMap((c) => !c, [], [condFacet])}>
        <Bar />
      </Mount>
    </>
  )
}
```

Use a single `Unwrap` that renders one branch or the other:

```tsx twoslash
// @esModuleInterop
import { useFacetState, Unwrap } from '@react-facet/core'
const Foo = () => <div>Foo</div>
const Bar = () => <div>Bar</div>

const Good = () => {
  const [condFacet] = useFacetState<boolean | undefined>(true)

  return <Unwrap data={condFacet}>{(cond) => (cond ? <Foo /> : <Bar />)}</Unwrap>
}

// Note: Foo and Bar are declared in the previous example for brevity and re-use in this file.
```

Why this matters:

- Each `Mount` internally manages mounting state; using two `Mount`s for opposite conditions can create more internal React state and may result in multiple re-renders for the same logical switch. A single `Unwrap` keeps the state and re-render scope smaller.
- When opposing conditions change at slightly different times, multiple `Mount`s can briefly both mount or unmount, causing transient visual glitches. A single `Unwrap` evaluates the condition once and consistently renders the chosen branch.

When NOT to use:

- For binding dynamic values to the DOM — prefer `fast-*` components or facet-aware patterns instead.
- For simple single-condition mounts where `Mount` or `With` are the clearer, more efficient choice. Use `Unwrap` when you need a concise multi-branch conditional rendered from a single facet.

See also:

- [useFacetUnwrap](./hooks/use-facet-unwrap) - The hook used internally (performance warning applies)

## `Times`

Renders a child-producing function a fixed number of times based on a `Facet<number>`.

The `Times` component accepts a single required prop, `count`, which must be a `Facet<number>`. Its `children` prop is a function that will be called for each index from `0` to `count - 1` and should return a `ReactElement` or `null`.

This component is useful when you want to repeat a piece of UI a dynamic number of times while keeping updates scoped to the repeated subtree.

Signature:

```tsx
<Times count={countFacet}>{(index, count) => <Item key={index} index={index} total={count} />}</Times>
```

Basic example:

```tsx twoslash
// @esModuleInterop
import { useFacetState, Times, NO_VALUE } from '@react-facet/core'

const Example = () => {
  const [countFacet, setCount] = useFacetState(3)

  return (
    <div>
      <Times count={countFacet}>{(index) => <div key={index}>Row {index}</div>}</Times>
      <button onClick={() => setCount((c) => (c !== NO_VALUE ? c + 1 : 1))}>Add</button>
    </div>
  )
}
```

Performance considerations

- `Times` subscribes to the provided `count` facet. When the numeric value changes, `Times` will re-evaluate how many children to render.
- If the `count` increases or decreases, the component mounts or unmounts the corresponding child subtrees, which can be more expensive than updating existing children. Prefer keeping the array size stable when possible (e.g., reuse items) to avoid mounting churn.
- The child function receives the `index` and the current `count` as plain values. If you need facet-aware children, use `Map` with an array facet instead.

When to use

- Use `Times` when you need to repeat a UI fragment a variable number of times determined by a numeric facet.
- Use `Map` instead when you have an array of data and want each item wrapped in a `Facet` (for per-item updates without remounting the whole list when data changes but length stays the same).

Related APIs

- `Map` — for rendering lists from an array `Facet` (per-item facets)
- `Unwrap` / `useFacetUnwrap` — when you need to work with plain values inside children
- `Mount` / `With` — conditional mounting utilities
