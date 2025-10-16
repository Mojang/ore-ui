---
sidebar_position: 3
---

# useFacetMemo

The cached hook for deriving facets. Use when you have many subscribers or expensive computations.

## When to Use

**Use `useFacetMemo` (cached) - FOR OPTIMIZATION:**

- ✅ The derived facet has **many subscribers** (3+ components, or passed to a list)
- ✅ The mapping function is **computationally expensive** (complex calculations, data processing)
- ✅ You want to **cache results** across all subscribers (single computation shared by all)
- ⚠️ Heavier to initialize (uses `createFacet` internally)

Use `useFacetMemo` instead of [`useFacetMap`](./use-facet-map) when:

1. **Many subscribers** - The derived facet is passed to multiple child components or used in a list
2. **Expensive computation** - The mapping function does complex calculations or data processing
3. **Profiling shows bottleneck** - You've measured that the repeated computation is a performance issue

## Comparison with useFacetMap

Both [`useFacetMap`](./use-facet-map) and `useFacetMemo` derive new facets from one or more source facets. They have identical APIs but different performance characteristics:

**`useFacetMap`** creates a simple facet that recomputes the mapping function for each subscriber independently. It's fast to initialize but computation runs N times for N subscribers.

**`useFacetMemo`** creates a full facet using `createFacet` internally. It's heavier to initialize but caches the result, so computation runs only once regardless of subscriber count.

**Rule of thumb:** Start with `useFacetMap` for everything. Switch to `useFacetMemo` only when profiling shows a performance issue or you know you'll have many subscribers to an expensive computation.

## Facet Reference Stability

:::info
**`useFacetMemo` creates a new facet reference when any dependency changes.** This behavior is identical to `useFacetMap`:

- Changes to the `dependencies` array trigger a new facet
- Changes to the `facets` array trigger a new facet
- Changes to the `equalityCheck` function trigger a new facet

See the [Facet Reference Stability](./use-facet-map#facet-reference-stability) note under `useFacetMap` for more details and examples.
:::

## NO_VALUE Retention Behavior

Like [`useFacetMap`](./use-facet-map), `useFacetMemo` retains the previous value when the mapping function returns `NO_VALUE`. See the [NO_VALUE Retention Behavior](./use-facet-map#no_value-retention-behavior) section under `useFacetMap` for details and examples. This behavior is identical for both hooks.

## API

The API is identical to `useFacetMap`:

```typescript
useFacetMemo<M>(
  selector: (...args: FacetValues) => M,
  dependencies: unknown[],     // Non-facet dependencies
  facets: Facet[],            // Facet dependencies
  equalityCheck?: EqualityCheck<M>
): Facet<M>
```

## Usage Examples

### Caching for Multiple Subscribers

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetState, useFacetMemo } from '@react-facet/core'

const ExpensiveComponent = () => {
  const [dataFacet] = useFacetState({ values: [1, 2, 3, 4, 5] })

  // Expensive computation that we want to cache
  const processedDataFacet = useFacetMemo(
    (data) => {
      // Imagine this is a heavy computation
      return data.values.reduce((sum, val) => sum + val, 0)
    },
    [],
    [dataFacet],
  )

  // Multiple components subscribe to the same cached result
  // With useFacetMap, this would compute 3 times
  // With useFacetMemo, this computes only once
  return (
    <fast-div>
      <fast-text text={processedDataFacet} />
      <fast-text text={processedDataFacet} />
      <fast-text text={processedDataFacet} />
    </fast-div>
  )
}
```

### Combining Multiple Facets

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
// ---cut---
import { useFacetMemo, Facet } from '@react-facet/core'

type Props = {
  playerHealthFacet: Facet<number>
  playerMaxHealthFacet: Facet<number>
  playerManaFacet: Facet<number>
  playerMaxManaFacet: Facet<number>
}

const PlayerStatsDisplay = ({
  playerHealthFacet,
  playerMaxHealthFacet,
  playerManaFacet,
  playerMaxManaFacet,
}: Props) => {
  // Complex computation combining multiple facets
  const statsMessageFacet = useFacetMemo(
    (health, maxHealth, mana, maxMana) => {
      // Expensive formatting or computation
      const healthPercent = Math.round((health / maxHealth) * 100)
      const manaPercent = Math.round((mana / maxMana) * 100)
      return `Health: ${healthPercent}% | Mana: ${manaPercent}%`
    },
    [],
    [playerHealthFacet, playerMaxHealthFacet, playerManaFacet, playerMaxManaFacet],
  )

  // Result is cached and shared if used in multiple places
  return <fast-text text={statsMessageFacet} />
}
```

### Using Equality Checks

Like `useFacetMap`, you can provide an equality check function to prevent unnecessary updates:

```tsx twoslash
// @esModuleInterop
import { shallowObjectEqualityCheck, useFacetState, useFacetMemo } from '@react-facet/core'

const DataAggregator = () => {
  const [facetA, setFacetA] = useFacetState('A')
  const [facetB, setFacetB] = useFacetState('B')

  // Use equality check for object results
  const combinedFacet = useFacetMemo(
    (a, b) => ({ valueA: a, valueB: b }),
    [],
    [facetA, facetB],
    shallowObjectEqualityCheck,
  )

  return <div>Combined data component</div>
}
```

## See Also

- [useFacetMap](./use-facet-map) - The lightweight default choice for derivations
- [Equality Checks](../equality-checks) - Available equality check functions
