---
sidebar_position: 9
---

# useFacetWrapMemo

The `useFacetWrapMemo` hook is a memoized version of [`useFacetWrap`](./use-facet-wrap) that maintains a stable facet reference even when the wrapped value changes. Unlike `useFacetWrap` which creates a new facet when the wrapped value changes, `useFacetWrapMemo` creates the facet once and updates its value internally.

## Signature

```typescript
function useFacetWrapMemo<T>(prop: FacetProp<T>, equalityCheck?: EqualityCheck<T>): Facet<T>
```

**Parameters:**

- `prop`: A `Facet<T>` or plain value `T` (via `FacetProp<T>`)
- `equalityCheck`: Optional equality check function to prevent unnecessary updates (default: `defaultEqualityCheck`)

**Returns:** A stable `Facet<T>` that updates its internal value when `prop` changes

## When to Use

Use `useFacetWrapMemo` instead of `useFacetWrap` when:

1. **Facet reference stability matters** - When passing the facet to child components that should not re-render when the facet reference changes
2. **Wrapping frequently changing props** - When the prop value changes often but you want to maintain a stable facet reference

**Note:** `useFacetWrapMemo` always creates a new facet internally (even when the prop is already a facet) and sets up an observer. This means there is overhead compared to passing facets directly. Use this hook when the stability of the facet reference is more important than avoiding the additional facet creation and subscription.

## Comparison with useFacetWrap

**`useFacetWrap` (creates new facet on value change):**

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrap, FacetProp } from '@react-facet/core'

const Component = ({ value }: { value: FacetProp<string> }) => {
  // Creates a new facet instance when value changes
  const facet = useFacetWrap(value)

  return <fast-text text={facet} />
}
```

**`useFacetWrapMemo` (stable facet, updates internal value):**

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrapMemo, FacetProp } from '@react-facet/core'

const Component = ({ value }: { value: FacetProp<string> }) => {
  // Facet instance remains stable, only the value updates
  const facet = useFacetWrapMemo(value)

  return <fast-text text={facet} />
}
```

## Basic Usage

Wrapping a prop value that might be a facet or plain value, with stable facet reference:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrapMemo, useFacetMap, FacetProp } from '@react-facet/core'

type ButtonProps = {
  label: FacetProp<string>
  isDisabled: FacetProp<boolean>
}

const Button = ({ label, isDisabled }: ButtonProps) => {
  // Both facets remain stable across re-renders
  const labelFacet = useFacetWrapMemo(label)
  const isDisabledFacet = useFacetWrapMemo(isDisabled)

  const className = useFacetMap((disabled) => (disabled ? 'button-disabled' : 'button-active'), [], [isDisabledFacet])

  return (
    <fast-div className={className}>
      <fast-text text={labelFacet} />
    </fast-div>
  )
}
```

## Using Equality Checks

Provide an equality check to optimize updates for complex data types:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetWrapMemo, useFacetMap, shallowObjectEqualityCheck, FacetProp } from '@react-facet/core'

type UserData = {
  name: string
  age: number
}

const UserDisplay = ({ user }: { user: FacetProp<UserData> }) => {
  // Use equality check to prevent updates when object properties haven't changed
  const userFacet = useFacetWrapMemo(user, shallowObjectEqualityCheck)

  const userName = useFacetMap((u) => u.name, [], [userFacet])

  return (
    <div>
      <fast-text text={userName} />
    </div>
  )
}
```

## Performance Considerations

**When `useFacetWrapMemo` helps:**

- Prevents unnecessary downstream re-renders when facet references change
- Reduces memory allocation from creating new facet instances
- Maintains consistent subscription behavior

**When `useFacetWrap` is sufficient:**

- Simple components where facet reference changes don't matter
- Props that change infrequently
- No performance issues observed with current approach

## Key Differences from useFacetWrap

| Feature                   | `useFacetWrap`                      | `useFacetWrapMemo`                        |
| ------------------------- | ----------------------------------- | ----------------------------------------- |
| Facet reference stability | New facet on value change           | Stable facet reference                    |
| Value updates             | New facet with new value            | Same facet, updated internal value        |
| Memory allocation         | New facet instance per value change | One facet instance, reused                |
| Best for                  | Simple wrapping, infrequent changes | Stable references, frequent value changes |
| Performance overhead      | Lower (simple memoization)          | Slightly higher (effect subscriptions)    |

## See Also

- [useFacetWrap](./use-facet-wrap) - Simpler version without stable references
- [Equality Checks](../equality-checks) - Available equality check functions
