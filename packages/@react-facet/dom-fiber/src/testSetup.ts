import React, { ReactElement } from 'react'
import { createFiberRoot } from './createFiberRoot'
import { createReconciler } from './createReconciler'

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
  getGlobalThis().IS_REACT_ACT_ENVIRONMENT = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const act = (React as any).unstable_act as Act
  return act
}

export interface Act {
  (work: () => void): boolean
}

document.body.innerHTML = `<div id="root"></div><div id="portal"></div>`

const reconcilerInstance = createReconciler()
export const root = document.getElementById('root') as HTMLElement
const fiberRoot = createFiberRoot(reconcilerInstance)(root)
export const act = setupAct()

/**
 * Render function local to testing that shared the same instance of the reconciler.
 *
 * This is needed otherwise React complains that we are sharing a context across different renderers.
 */
export const render = function render(ui: ReactElement) {
  act(() => {
    reconcilerInstance.updateContainer(ui, fiberRoot, null, () => {})
  })
}

afterEach(() => {
  act(() => {
    reconcilerInstance.updateContainer(null, fiberRoot, null, () => {})
  })
})
