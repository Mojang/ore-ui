import { useTransition, useCallback } from 'react'
import { Batch } from '../types'
import { batchTransition } from '../scheduler'

/**
 * Hook that acts analogous to React's useTransition, ensuring that any React state change that happens as a
 * result of a Facet update is handled within a React transition.
 */
export const useFacetTransition = (): [boolean, (fn: () => void) => void] => {
  const [isPending, reactStartTransition] = useTransition()

  const startTransition = useCallback((fn: Batch) => {
    reactStartTransition(() => batchTransition(fn))
  }, [])

  return [isPending, startTransition]
}
