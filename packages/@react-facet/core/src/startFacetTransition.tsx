import { startTransition as reactStartTransition } from 'react'
import { batchTransition } from './scheduler'

export const startFacetTransition = (fn: () => void) => {
  reactStartTransition(() => batchTransition(fn))
}
