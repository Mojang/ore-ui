---
sidebar_position: 7
---

# useFacetRef

Returns a React `Ref` with the value held inside the provided Facet.

Analog to React's `useRef`, but the argument it receives is a Facet instead of a plain value.

Whenever the value inside the provided Facet is updated, the value inside the
`current` property of the `Ref` will be also updated.

If the `Facet` is not yet initialized, the `Ref` will contain a `NO_VALUE`

## Usage

```tsx twoslash
import { useEffect } from 'react'
import { useFacetRef, Facet } from '@react-facet/core'

const LogWhenRendered = ({ exampleFacet }: { exampleFacet: Facet<unknown> }) => {
  const facetRef = useFacetRef(exampleFacet)

  useEffect(() => {
    console.log(`The exampleFacet value at the time of rendering: ${facetRef.current}`)
  })

  return null
}
```

## When to Use

Use `useFacetRef` when you need to:

- Access the current facet value in imperative code (event handlers, timers)
- Store the facet value without triggering re-renders
- Pass the value to third-party libraries that expect refs

## Important Notes

- The ref value updates synchronously with facet changes
- Accessing `ref.current` does not trigger component re-renders
- Check for `NO_VALUE` when accessing `ref.current` if the facet might be uninitialized
