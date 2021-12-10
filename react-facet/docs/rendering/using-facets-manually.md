---
sidebar_position: 3
---

# Using Facets manually

The recommended way to consume Facets in your React application is to either [use the custom renderer](using-the-custom-renderer) or [apply the DOM Components](../api/dom-components). That said, there might be reasons in which neither option makes sense (for example, when using React Native or some other non-DOM target). It is also sometimes possible to get even more performance by consuming the Facets manually and using their values to mutate DOM, instead of relying on components—although be warned that there are so many gotchas when attempting this that most likely performance will degrade instead of improve.

Consuming Facets manually means, in short, to listen to their changes to do DOM manipulations imperatively. For example:

```tsx
import React, { useCallback, useRef } from 'react'
import { useFacetEffect, useFacetState } from '@react-facet/core'

const Counter = () => {
  const [counter, setCounter] = useFacetState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useFacetEffect(
    (counterValue) => () => {
      if (ref.current == null) return

      ref.current.textContent = `${counterValue}`
    },
    [],
    [counter],
  )

  const handleClick = useCallback(() => {
    setCounter((counterValue) => counterValue + 1)
  })
  return (
    <div>
      <p>
        Counter: <span ref={ref} />
      </p>

      <button onClick={handleClick}>Increment</button>
    </div>
  )
}
```

This is the leanest possible use case of Facets.
