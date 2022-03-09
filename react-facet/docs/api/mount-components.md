---
sidebar_position: 4
---

# Mount Components

Neither the `fast-*` components supported by the custom renderer nor the components in `@react-facet/dom-elements` provide a way to mount or unmount children based on the value of a `Facet`.

For that purpose, you can use the [`Mount`](#mount), [`Map`](#map), and [`With`](#with) components. They allow you to add or remove nodes in the React tree.

## `Mount`

Mounts its children conditionally. The mandatory prop `when` should be a `Facet<boolean | undefined>`. The component's children will be mounted when value contained within the `Facet` is `true`.

Example:

```tsx
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

```tsx
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

Additionally, the `Mount` component takes an optional prop called `conditional`. This will default to `true`. When set to `false`, it will mount its children when when the value contained within the `Facet` is `false`.

```tsx
const Example = () => {
  const [shouldDisplayIsTrueElementFacet, setShouldDisplayIsTrueElementFacet] = useFacetState(true)

  return (
    <>
      <Mount when={shouldDisplayIsTrueElementFacet}>
        <div>It's true!</div>
      </Mount>
      <Mount when={shouldDisplayIsTrueElementFacet} condition={false}>
        <div>It's false!</div>
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

```tsx
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

```tsx
const Example = () => {
  const [arrayFacet, setArrayFacet] = useFacetState([
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
  ])

  const PrintItem = ({ item, index }: { item: Facet<Input>; index: number }) => {
    return (
      <span>
        <fast-text text={useFacetMap(({ a }) => a, [], [item])} />
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

```tsx
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
        {(middlename) => (
          <p>
            Middlename: <fast-text text={middlename} />
          </p>
        )}
      </With>
    </div>
  )
}
```

For contrast, attempting to do the same thing with `Mount` will _not_ allow for correct type checking. In this scenario, the type of `middlenameFacet` is not refined and could still contain a `null` or `undefined`.

```tsx
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
      <Mount data={useFacetMap((middlename) => middlename != null, [], [middlenameFacet])}>
        <p>
          Middlename: <fast-text text={middlenameFacet} />
        </p>
        {/* Since TypeScript cannot know that `middlenameFacet` now holds a `string` for sure, it will still believe that
            it could be `string | undefined`. The only way to solve this issue is to extract a new component or use a type
            assertion. Neither is a good option, hence we recommend using `With` instead in this scenario. */}
      </Mount>
    </div>
  )
}
```
