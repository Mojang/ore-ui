---
sidebar_position: 11
---

# useFacetTransition

React Facet provides APIs for integrating facet updates with React 18's concurrent rendering features. These allow you to mark facet updates as non-urgent transitions, enabling React to keep the UI responsive during heavy updates.

## The Hook: useFacetTransition

A hook that works analogously to React's `useTransition`, but ensures that any React state changes resulting from facet updates are handled within a React transition.

### Hook Signature

```typescript
function useFacetTransition(): [boolean, (fn: () => void) => void]
```

**Returns:** A tuple containing:

1. `isPending` - Boolean indicating if a transition is in progress
2. `startTransition` - Function to execute facet updates as a transition

:::note Callback Stability
The `startTransition` function returned by `useFacetTransition` is stable across re-renders and doesn't need to be included in dependency arrays of `useCallback`, `useEffect`, or other hooks.
:::

### When to Use

Use `useFacetTransition` when:

1. **Heavy facet updates** - Facet changes trigger expensive computations or rendering
2. **Keeping UI responsive** - Need to prioritize user interactions over state updates
3. **Large lists or complex UIs** - Updates affect many components simultaneously
4. **Mixed React state and facets** - Some components use React state alongside facets

### Basic Usage

The following example keeps input fields responsive while processing updates, during which time it indicates to the user that it is loading via the `isPending` flag:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetTransition } from '@react-facet/core'

const SearchResults = () => {
  const [queryFacet, setQuery] = useFacetState('')
  const [resultsFacet, setResults] = useFacetState<string[]>([])
  const [isPending, startTransition] = useFacetTransition()

  const handleSearch = (newQuery: string) => {
    // Update query immediately (high priority)
    setQuery(newQuery)

    // Update results as a transition (low priority)
    startTransition(() => {
      // Expensive computation or data fetching
      const results = performExpensiveSearch(newQuery)
      setResults(results)
    })
  }

  return (
    <div>
      <input type="text" onChange={(e) => handleSearch(e.target.value)} placeholder="Search..." />
      {isPending && <div>Searching...</div>}
      <fast-div style={{ opacity: isPending ? 0.5 : 1 }}>{/* Results display */}</fast-div>
    </div>
  )
}

const performExpensiveSearch = (query: string): string[] => {
  // Simulate expensive search
  return Array.from({ length: 1000 }, (_, i) => `Result ${i} for ${query}`)
}
```

## The Function: startFacetTransition

A function API that works analogously to React's `startTransition`, for use outside of components.

### Function Signature

```typescript
function startFacetTransition(fn: () => void): void
```

**Parameters:**

- `fn` - Function containing facet updates to execute as a transition

### When to Use startFacetTransition

Use `startFacetTransition` when:

1. **Outside React components** - In utility functions, event handlers, or callbacks
2. **Global state updates** - Updating shared facets from non-React code
3. **One-off transitions** - Don't need the `isPending` state
4. **Event handlers** - Processing events that trigger heavy facet updates

### Usage Examples

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, startFacetTransition } from '@react-facet/core'

// Utility function outside of React
export const loadDataAsTransition = (setData: (data: string[]) => void, newData: string[]) => {
  startFacetTransition(() => {
    // Heavy update marked as low priority
    setData(newData)
  })
}

// Use in component
const Component = () => {
  const [dataFacet, setData] = useFacetState<string[]>([])

  const handleLoad = () => {
    const data = Array.from({ length: 5000 }, (_, i) => `Item ${i}`)
    loadDataAsTransition(setData, data)
  }

  return <button onClick={handleLoad}>Load Data</button>
}
```

### In Event Handlers

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, startFacetTransition } from '@react-facet/core'

const BatchProcessor = () => {
  const [statusFacet, setStatus] = useFacetState('Ready')

  const processBatch = (items: string[]) => {
    setStatus('Processing...')

    // Process as transition - won't block UI
    startFacetTransition(() => {
      items.forEach((item) => {
        // Heavy processing per item
        processItem(item)
      })
      setStatus('Complete')
    })
  }

  return (
    <div>
      <button onClick={() => processBatch(generateItems())}>Process Batch</button>
      <fast-text text={statusFacet} />
    </div>
  )
}

const generateItems = () => Array.from({ length: 1000 }, (_, i) => `Item ${i}`)
const processItem = (item: string) => {
  /* heavy processing */
}
```

### With Shared State

When working with shared state across multiple components, `startFacetTransition` (the function API) is often preferable to `useFacetTransition` (the hook):

**Why use `startFacetTransition` for shared state:**

- **No pending state needed** - Notifications are "fire-and-forget", consumers don't need loading indicators
- **Called from children** - The transition is triggered in child components, not where `isPending` would be available
- **Cleaner API** - No need to expose `isPending` through context if it won't be used
- **Better performance** - Provider doesn't re-render when `isPending` changes

**Comparison:**

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetTransition, startFacetTransition, NO_VALUE } from '@react-facet/core'
import { createContext, useContext } from 'react'
import type { Facet } from '@react-facet/core'

// ❌ Less ideal: Using useFacetTransition in provider causes re-renders
type NotificationContextBad = {
  notificationsFacet: Facet<string[]>
  addNotification: (message: string) => void
  isPending: boolean // Provider re-renders when this changes
}

const NotificationContextBad = createContext<NotificationContextBad | null>(null)

export const NotificationProviderBad = ({ children }: { children: React.ReactNode }) => {
  const [notificationsFacet, setNotifications] = useFacetState<string[]>([])
  const [isPending, startTransition] = useFacetTransition()

  const addNotification = (message: string) => {
    startTransition(() => {
      setNotifications((current) => (current !== NO_VALUE ? [...current, message] : [message]))
    })
  }

  // ⚠️ Provider re-renders on every isPending change, even if not used
  return (
    <NotificationContextBad.Provider value={{ notificationsFacet, addNotification, isPending }}>
      {children}
    </NotificationContextBad.Provider>
  )
}

// ✅ Better: Using startFacetTransition avoids unnecessary re-renders
type NotificationContextGood = {
  notificationsFacet: Facet<string[]>
  addNotification: (message: string) => void
}

const NotificationContextGood = createContext<NotificationContextGood | null>(null)

export const NotificationProviderGood = ({ children }: { children: React.ReactNode }) => {
  const [notificationsFacet, setNotifications] = useFacetState<string[]>([])

  const addNotification = (message: string) => {
    // ✅ Use startFacetTransition: no isPending state, no re-renders
    startFacetTransition(() => {
      setNotifications((current) => (current !== NO_VALUE ? [...current, message] : [message]))
    })
  }

  return (
    <NotificationContextGood.Provider value={{ notificationsFacet, addNotification }}>
      {children}
    </NotificationContextGood.Provider>
  )
}
```

## How Transitions Work

When you use `useFacetTransition` or `startFacetTransition`:

1. **Batching** - Facet updates are batched together using `batchTransition` internally (a special variant that ensures all tasks run at the end of the transition, maintaining separate task queues for transition and non-transition updates)
2. **Priority** - React treats these updates as low priority (interruptible)
3. **Concurrent rendering** - React can pause and resume the work
4. **User responsiveness** - High-priority updates (like user input) can interrupt transitions
5. **Task Queue Separation** - Transition tasks are queued separately from regular tasks, ensuring proper priority ordering and preventing transition updates from blocking urgent updates

### Nested Transitions

Transitions can be nested within each other:

- Inner transitions inherit the transition context from outer transitions
- Task queues are maintained separately for transition and non-transition contexts
- Tasks flush when the outermost transition completes
- This allows for complex update patterns while maintaining UI responsiveness

```tsx twoslash
// @esModuleInterop
import { useFacetState, startFacetTransition } from '@react-facet/core'

const ComplexUpdate = () => {
  const [dataFacet, setData] = useFacetState<string[]>([])

  const handleUpdate = () => {
    // Outer transition
    startFacetTransition(() => {
      const partialData = processFirstBatch()
      setData(partialData)

      // Inner transition - will complete when outer completes
      startFacetTransition(() => {
        const finalData = processSecondBatch()
        setData(finalData)
      })
    })
  }

  return <button onClick={handleUpdate}>Update</button>
}

const processFirstBatch = () => ['item1', 'item2']
const processSecondBatch = () => ['item1', 'item2', 'item3']
```

### Error Handling

If a facet update throws an error within a transition, the behavior is:

- All remaining queued tasks in the current batch are cancelled
- The task queue is cleared to prevent cascading errors
- The error is re-thrown for you to handle

Always ensure your facet updates handle errors appropriately:

```tsx twoslash
// @esModuleInterop
import { useFacetState, startFacetTransition } from '@react-facet/core'

const SafeUpdate = () => {
  const [dataFacet, setData] = useFacetState<string[]>([])
  const [errorFacet, setError] = useFacetState<string | null>(null)

  const handleLoad = () => {
    startFacetTransition(() => {
      try {
        const result = riskyComputation()
        setData(result)
        setError(null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    })
  }

  return <button onClick={handleLoad}>Load Data</button>
}

const riskyComputation = (): string[] => {
  if (Math.random() > 0.5) throw new Error('Computation failed')
  return ['data']
}
```

## Performance Benefits

**Without transitions:**

```tsx
// Heavy update blocks the UI
setData(expensiveComputation())
// User interactions are delayed until this completes
```

**With transitions:**

```tsx
startTransition(() => {
  setData(expensiveComputation())
})
// User interactions remain responsive
// Heavy update happens in the background
```

## Best Practices

1. **Don't transition urgent updates** - Keep critical UI feedback (like input fields) outside transitions
2. **Show pending state** - Use `isPending` to indicate background work when using `useFacetTransition`
3. **Handle errors explicitly** - Always wrap risky computations in try-catch blocks within transitions
4. **Combine with useFacetMemo** - Cache expensive derivations within transitions for better performance
5. **Test on slower devices** - Transitions shine on lower-end hardware
6. **Use `startFacetTransition` for shared state** - Avoid unnecessary provider re-renders when `isPending` isn't needed
7. **Don't include `startTransition` in dependency arrays** - The callback from `useFacetTransition` is stable

## Comparison: Hook vs Function API

| Feature               | `useFacetTransition`                       | `startFacetTransition`                     |
| --------------------- | ------------------------------------------ | ------------------------------------------ |
| Usage location        | Inside React components                    | Anywhere (components or utils)             |
| Returns pending state | Yes (`isPending`)                          | No                                         |
| Re-renders on pending | Yes                                        | N/A                                        |
| Callback stability    | Stable (safe in deps arrays)               | N/A                                        |
| Best for              | Interactive UI with feedback               | Fire-and-forget updates                    |
| Example use case      | Search with loading spinner                | Background data refresh                    |
| Error handling        | Errors cancel remaining tasks and re-throw | Errors cancel remaining tasks and re-throw |

:::tip Performance Tip
Use transitions for updates that affect large portions of your UI or trigger expensive computations. This keeps your app feeling snappy even during heavy updates.
:::
