import { useTransition, useCallback } from 'react'
import { Batch } from '../types'
import { batchTransition } from '../scheduler'

export const useFacetTransition = (): [boolean, (fn: () => void) => void] => {
  const [isPending, reactStartTransition] = useTransition()

  const startTransition = useCallback((fn: Batch) => {
    reactStartTransition(() => batchTransition(fn))
  }, [])

  return [isPending, startTransition]
}
