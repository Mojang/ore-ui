---
sidebar_position: 4
---

# Mount Components

Neither `fast-*` components supported by the custom renderer nor the components in `@react-facet/dom-elements` provide a way to mount or unmount children based on the value of a `Facet`.

For that purpose, you can use the [`Mount`](#mount) and [`Map`](#map) components when there is a need to add or remove nodes in the React tree.

## `Mount`

Mounts its children conditionally. The condition is a `Facet` passed in to the `when` prop that should contain a boolean or be `undefined` (which will be interpreted as `false`).

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

## `Map`

Mounts a list of components based on a facet of an array.

The length of the array passed into the `array` prop will be used to know how many components to mount. The `children` of the `Map` components should be a function, and this function will receive a facet containing the data and index of the current item.

The `Map` only re-renders if the size of the array changes, so we need to be mindful about changing the size of the array, as it will cause a performance hit. On the other hand, if only the data inside the items in the list change, but not the _amount_ of items, there will be no re-render: the facet passed into the `children` function will simply be updated with the latest data.

Example:

```tsx

const Example = () => {
	const [arrayFacet, setArrayFacet] = useFacetState(['1', '2', '3', '4', '5']])

	return <Map array={arrayFacet}>{(item) => <span><fast-text text={item} /></span>}</Map>
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
