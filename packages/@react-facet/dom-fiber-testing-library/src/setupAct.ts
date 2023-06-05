import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGlobalThis(): any {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }

  if (typeof self !== 'undefined') {
    return self
  }

  if (typeof window !== 'undefined') {
    return window
  }

  if (typeof global !== 'undefined') {
    return global
  }

  throw new Error('unable to locate global object')
}

/**
 * More info: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
 * Reference implementation: https://github.com/testing-library/react-testing-library/blob/c80809a956b0b9f3289c4a6fa8b5e8cc72d6ef6d/src/act-compat.js#L5
 */
export const setupAct = (): Act => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const act = (React as any).unstable_act as Act

  getGlobalThis().IS_REACT_ACT_ENVIRONMENT = act

  return act
}

export interface Act {
  (work: () => void): boolean
}
