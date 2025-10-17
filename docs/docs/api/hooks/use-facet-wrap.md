---
sidebar_position: 8
---

# useFacetWrap

To simplify the use case in which a certain variable can hold either a value or a Facet containing that value, `useFacetWrap` accepts plain values or facets (a generic type called `FacetProp<A>`, which will either be `A` or `Facet<A>`) and lifts them into a facet. This allows you to migrate components more easily, since inside the implementation can work exclusively with facets and the prop can support both regular values and facets.

> Note that if the consumers of the component pass a regular prop instead of a facet, that will cause the component to re-render, negating all performance benefits. This hook is useful to be able to migrate, for compatibility, but it is still recommended that all consumers of the components that support facets use facets for maximum performance improvement.

## Usage

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMap, useFacetState, useFacetWrap, FacetProp } from '@react-facet/core'

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

## Facet Reference Stability

:::info
**`useFacetWrap` creates a new facet reference whenever the wrapped value changes.** The facet is memoized on the `prop` parameter, so:

- If the prop is already a facet, it returns that facet (stable reference)
- If the prop is a value, it creates a `StaticFacet` wrapping that value
- When the prop value changes, a new `StaticFacet` is created

This is usually fine, but can cause issues when facet reference stability matters. If you need a stable facet reference that doesn't change when the value updates, use [`useFacetWrapMemo`](./use-facet-wrap-memo) instead.
:::

**Quick comparison:**

- `useFacetWrap` → new facet instance on value change (lighter, simpler)
- `useFacetWrapMemo` → same facet instance, value updates internally (stable reference)

**Example showing new facet on each change:**

```tsx
const Component = ({ label }: { label: string }) => {
  // labelFacet is a NEW reference when label changes
  const labelFacet = useFacetWrap(label)

  return <ChildComponent facet={labelFacet} />
  // ChildComponent will receive a new facet prop when label changes
}
```

For most use cases, `useFacetWrap` is the right choice. Only use `useFacetWrapMemo` when you specifically need facet reference stability.

## See Also

- [useFacetWrapMemo](./use-facet-wrap-memo) - Memoized version with stable facet reference
