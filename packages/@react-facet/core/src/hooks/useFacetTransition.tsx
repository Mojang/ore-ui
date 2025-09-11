import { useTransition, useCallback } from 'react'
import { Batch } from '../types'
import { batchTransition } from '../scheduler'

export const useFacetTransition = () => {
  const [isPending, reactStartTransition] = useTransition()

  return [
    isPending,
    useCallback((fn: Batch) => {
      reactStartTransition(() => batchTransition(fn))
    }, []),
  ]
}
