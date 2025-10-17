---
sidebar_position: 6
---

# useFacetLayoutEffect

Much like React offers a `useLayoutEffect` as a complement to `useEffect`, so too does `react-facet` offer a `useFacetLayoutEffect`. It takes the exact same input as `useFacetEffect` and has an identical implementation, the sole exception being that it uses React's underlying `useLayoutEffect` instead that fires synchronously after all DOM mutations.

## When to Use

Use `useFacetLayoutEffect` when you need to:

- Measure DOM elements before the browser paints
- Make synchronous DOM mutations
- Read layout from the DOM and synchronously re-render

## Example

```tsx twoslash
// @esModuleInterop
import { useFacetLayoutEffect, useFacetState, Facet } from '@react-facet/core'
import { useRef } from 'react'

const MeasureElement = ({ dimensionsFacet }: { dimensionsFacet: Facet<{ width: number; height: number }> }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useFacetLayoutEffect(
    (dimensions) => {
      // Synchronously measure the element after dimensions change
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        console.log('Element measured:', rect.width, 'x', rect.height)
      }
    },
    [],
    [dimensionsFacet],
  )

  return <div ref={elementRef}>Measured content</div>
}
```

## Comparison with useFacetEffect

| Feature                | useFacetEffect         | useFacetLayoutEffect        |
| ---------------------- | ---------------------- | --------------------------- |
| **Execution timing**   | Asynchronous           | Synchronous                 |
| **Browser paint**      | After paint            | Before paint                |
| **Use case**           | Data fetching, logging | DOM measurements, mutations |
| **Performance impact** | Lower                  | Can block visual updates    |

:::caution Performance Warning
`useFacetLayoutEffect` runs synchronously, which can block the browser from painting. Use `useFacetEffect` unless you specifically need synchronous DOM operations.
:::
