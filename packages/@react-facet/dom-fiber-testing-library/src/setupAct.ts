import React, { MutableRefObject } from 'react'
import { ReactFacetReconciler } from '@react-facet/dom-fiber'

export type Act = <A>(callback: () => A) => A

export const setupAct = ({ batchedUpdates, flushPassiveEffects, IsThisRendererActing }: ReactFacetReconciler): Act => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { IsSomeRendererActing } = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as {
    IsSomeRendererActing: MutableRefObject<boolean>
  }

  const isSchedulerMocked = false
  const flushWork = function () {
    let didFlushWork = false
    while (flushPassiveEffects()) {
      didFlushWork = true
    }

    return didFlushWork
  }

  let actingUpdatesScopeDepth = 0

  function act<A>(callback: () => A) {
    actingUpdatesScopeDepth++

    const previousIsSomeRendererActing = IsSomeRendererActing.current
    const previousIsThisRendererActing = IsThisRendererActing.current
    IsSomeRendererActing.current = true
    IsThisRendererActing.current = true

    function onDone() {
      actingUpdatesScopeDepth--
      IsSomeRendererActing.current = previousIsSomeRendererActing
      IsThisRendererActing.current = previousIsThisRendererActing
    }

    try {
      // TODO: check what we should pass as the second argument
      const result = batchedUpdates(callback, null)

      try {
        if (actingUpdatesScopeDepth === 1 && (isSchedulerMocked === false || previousIsSomeRendererActing === false)) {
          // we're about to exit the act() scope,
          // now's the time to flush effects
          flushWork()
        }
        onDone()
      } catch (err) {
        onDone()
        throw err
      }

      return result
    } catch (error) {
      // on sync errors, we still want to 'cleanup' and decrement actingUpdatesScopeDepth
      onDone()
      throw error
    }
  }

  return act
}
