---
sidebar_position: 5
---

# useFacetEffect

The `useFacetEffect` hook gives you a way of performing some imperative action (effect) whenever the underlying facets are updated. It is very similar in structure and goal to React's own `useEffect`.

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

It also supports a cleanup function that can be returned by the effect function. This cleanup is called whenever any of the dependencies or the facets have changed or when the component is unmounted. In short, it behaves exactly like React's `useEffect`.

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

      // Supports a cleanup function (same as React's useEffect)
      return () => clearTimeout(timerId)
    },
    [shouldLog],
    [statusFacet],
  )

  return <span>{shouldLog ? 'Logger is active' : 'Logger is disabled'}</span>
}
```

## Cleanup Functions

Like React's `useEffect`, `useFacetEffect` supports returning a cleanup function from the effect. This cleanup function is essential for avoiding memory leaks and properly managing resources.

**When cleanup runs:**

1. **Before the effect runs again** - When any facet value or dependency changes
2. **When the component unmounts** - For final cleanup

This matches React's `useEffect` behavior exactly, making it familiar and predictable.

**Common cleanup use cases:**

- Clearing timers and intervals
- Removing event listeners
- Canceling subscriptions
- Aborting network requests
- Cleaning up DOM references

```tsx twoslash
// @esModuleInterop
import { useFacetEffect, useFacetState, Facet } from '@react-facet/core'

// Example: Auto-refresh with cleanup
const AutoRefresh = ({ intervalFacet }: { intervalFacet: Facet<number> }) => {
  useFacetEffect(
    (interval) => {
      const intervalId = setInterval(() => {
        console.log('Refreshing...')
      }, interval)

      // Cleanup runs before next effect or on unmount
      return () => clearInterval(intervalId)
    },
    [],
    [intervalFacet],
  )

  return <div>Auto-refreshing component</div>
}
```
