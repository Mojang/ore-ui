import { startTransition as reactStartTransition } from 'react'
import { batchTransition } from './scheduler'

/**
 * API that acts analogous to React's startTransition, ensuring that any React state change that happens as a
 * result of a Facet update is handled within a React transition.
 */
export const startFacetTransition = (fn: () => void) => {
  reactStartTransition(() => batchTransition(fn))
}
