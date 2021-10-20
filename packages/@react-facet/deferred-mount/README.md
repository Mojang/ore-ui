# @react-facet/deferred-mount

React Facet is a state management for performant game UIs. For more information on how to use this package check the official documentation available at https://react-facet.mojang.com/.

This package allows deferring mounting a component to the next frame. It can be used wrapping components on a big list to keep the frame time low while everything is mounted.

When the `DeferredMountProvider` is used, it requires that there is at least one descendent as a `DeferredMount`, otherwise it will wait forever as `deferring`.

## Example

In the example below it will mount:

- Mounting: nothing
- First Frame: `First`
- Second Frame: `First` and `Second`
- Third Frame: `First`, `Second` and `Third`

The `useIsDeferring` hook allows to check what is the status of the deferred mounting (by returning a Facet) so we can, for example, show a spinner.

```tsx
const SampleComponent = () => {
  const isDeferringFacet = useIsDeferring()

  return (
    <>
      <fast-text text={useFacetMap((isDeferring) => (isDeferring ? 'deferring' : 'done'), [], [isDeferringFacet])} />
      <DeferredMount>
        <div>First</div>
      </DeferredMount>
      <DeferredMount>
        <div>Second</div>
      </DeferredMount>
      <DeferredMount>
        <div>Third</div>
      </DeferredMount>
    </>
  )
}

render(
  <DeferredMountProvider frameTimeBudget={16}>
    <SampleComponent />
  </DeferredMountProvider>,
  document.getElementById('root'),
)
```

The `frameTimeBudget` prop allows the tweaking of how much time the library has available to do work on a given frame (by default it targets 60fps).
