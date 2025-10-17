---
sidebar_position: 2
---

# useFacetMap

The lightweight hook for deriving facets. Best for simple transformations and few subscribers. **This should be your default choice for most derivations.**

## When to Use

**Use `useFacetMap` (lightweight) - THE DEFAULT CHOICE:**

- ✅ The derived facet has **few subscribers** (1-2 components)
- ✅ The mapping function is **lightweight** (property access, string concatenation, simple math)
- ✅ You want **fast initialization** (no overhead from internal facet creation)
- ⚠️ Each subscriber recomputes the mapping function independently

## Comparison with useFacetMemo

Both `useFacetMap` and [`useFacetMemo`](./use-facet-memo) derive new facets from one or more source facets. They have identical APIs but different performance characteristics:

**`useFacetMap`** creates a simple facet that recomputes the mapping function for each subscriber independently. It's fast to initialize but computation runs N times for N subscribers.

**`useFacetMemo`** creates a full facet using `createFacet` internally. It's heavier to initialize but caches the result, so computation runs only once regardless of subscriber count.

```typescript
// Scenario: derived facet used by 5 components

// useFacetMap: computation runs 5 times (once per subscriber)
const lightweightFacet = useFacetMap(expensiveFunc, [], [sourceFacet])

// useFacetMemo: computation runs 1 time (cached for all subscribers)
const cachedFacet = useFacetMemo(expensiveFunc, [], [sourceFacet])
```

**Rule of thumb:** Start with `useFacetMap` for everything. Switch to `useFacetMemo` only when profiling shows a performance issue or you know you'll have many subscribers to an expensive computation.

## Facet Reference Stability

:::info
**`useFacetMap` creates a new facet reference when any dependency changes.** This includes:

- Changes to the `dependencies` array (non-facet dependencies like props or local variables)
- Changes to the `facets` array (different facet instances)
- Changes to the `equalityCheck` function

When the returned facet reference changes, any component or hook that depends on it will re-run. This is expected behavior and mirrors how React's `useMemo` works.
:::

**Example:**

```tsx
const Component = ({ multiplier }: { multiplier: number }) => {
  const [valueFacet] = useFacetState(10)

  // derivedFacet is a NEW reference when multiplier changes
  const derivedFacet = useFacetMap(
    (val) => val * multiplier,
    [multiplier], // ← When this changes, new facet is created
    [valueFacet],
  )

  return <ChildComponent facet={derivedFacet} />
}
```

This is usually fine, but be aware when passing derived facets to components that might be sensitive to prop reference changes.

## NO_VALUE Retention Behavior

:::info Important: Returning NO_VALUE Retains Previous Value
When a mapping function returns `NO_VALUE`, **the facet retains its previous value** rather than updating to `NO_VALUE`. The observer does not notify listeners, so subscribers continue seeing the last emitted value.

This is useful for conditional updates where you want to "freeze" a facet's value under certain conditions:

```tsx twoslash
// @esModuleInterop
import { useFacetState, useFacetMap, NO_VALUE } from '@react-facet/core'

const ClampedCounter = () => {
  const [countFacet, setCount] = useFacetState(0)

  // Once count reaches 5, the mapped facet stops updating and retains the value 5
  const clampedFacet = useFacetMap((count) => (count < 5 ? count : NO_VALUE), [], [countFacet])

  // clampedFacet will show: 0, 1, 2, 3, 4, 4, 4, 4... (stuck at 4)
  // Even though countFacet continues: 0, 1, 2, 3, 4, 5, 6, 7...

  return <button onClick={() => setCount((prev) => (prev === NO_VALUE ? 0 : prev + 1))}>Increment</button>
}
```

**Key points:**

- Returning `NO_VALUE` from a mapping function **does not** set the facet's value to `NO_VALUE`
- It prevents the facet from updating, keeping the last successfully mapped value
- This applies to both `useFacetMap` and `useFacetMemo`
- Useful for implementing conditional updates, clamping, or filtering unwanted values

:::

## Usage Examples

### Basic Derivation

Use this to combine React component props with facet data and prepare facets to be passed to `fast-*` components.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMap } from '@react-facet/core'

const HealthBar = ({ lowHealthThreshold }: { lowHealthThreshold: number }) => {
  const [playerFacet, setPlayerFacet] = useFacetState({
    health: 80,
    mana: 65,
  })

  const className = useFacetMap(
    ({ health }) => (health > lowHealthThreshold ? 'healthy' : 'hurt'),
    [lowHealthThreshold],
    [playerFacet],
  )

  return <fast-div className={className} />
}
```

### Combining Multiple Facets

The `useFacetMap` hook supports passing in several facets to listen to, so you can merge the values of several facets into one using it.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMap, Facet } from '@react-facet/core'

type Props = {
  placeholderFacet: Facet<string>
  valueFacet: Facet<string>
}

const InputField = ({ placeholderFacet, valueFacet }: Props) => {
  const valueToDisplay = useFacetMap(
    (placeholder, value) => (value != null ? value : placeholder),
    [],
    [placeholderFacet, valueFacet],
  )

  return (
    <span>
      <fast-text text={valueToDisplay} />
    </span>
  )
}
```

### Using Equality Checks

Optionally, you can pass an equality check function as the fourth argument to `useFacetMap`. This is particularly useful when grouping more than one facet together into a single array / object, since hard equality checks will not work on arrays / objects.

```tsx twoslash
const SubComponent = ({ facets }: { facets: any }) => null
// ---cut---
// @esModuleInterop

import { shallowArrayEqualityCheck, useFacetState, useFacetMap } from '@react-facet/core'

const WrapperComponent = () => {
  const [facetA, setFacetA] = useFacetState('A')
  const [facetB, setFacetB] = useFacetState('B')

  const groupedFacet = useFacetMap((a, b) => [a, b], [], [facetA, facetB], shallowArrayEqualityCheck)

  return <SubComponent facets={groupedFacet} />
}
```

## See Also

- [useFacetMemo](./use-facet-memo) - For expensive computations or many subscribers
- [Equality Checks](../equality-checks) - Available equality check functions
