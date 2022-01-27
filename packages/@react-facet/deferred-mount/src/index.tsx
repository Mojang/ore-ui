import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
  ReactElement,
} from 'react'
import { createFacet, Facet, useFacetLayoutEffect, useFacetState } from '@react-facet/core'

/**
 * Targeting around 60fps
 */
const DEFAULT_FRAME_TIME_BUDGET = 16

interface DeferredMountProviderProps {
  children: ReactNode

  /**
   * How many milliseconds we can spend mounting components.
   */
  frameTimeBudget?: number
}

/**
 * Provider that must wrap a tree with nodes being deferred
 */
export function DeferredMountProvider({
  children,
  frameTimeBudget = DEFAULT_FRAME_TIME_BUDGET,
}: DeferredMountProviderProps) {
  const [isDeferring, setIsDeferring] = useFacetState(true)
  const [requestingToRun, setRequestingToRun] = useFacetState(false)

  const deferredMountsRef = useRef<UpdateFn[]>([])

  const pushDeferUpdateFunction = useCallback(
    (updateFn: UpdateFn) => {
      // Causes a re-render of this component that will kick-off the effect below
      setRequestingToRun(true)

      deferredMountsRef.current.push(updateFn)

      /**
       * Cleanup function that makes sure that we don't try to "mount" a deferred component
       * if it has already been unmounted.
       */
      return () => {
        // It is most common that we will be cleaning up after all deferred mounting has been run
        if (deferredMountsRef.current.length === 0) return

        const index = deferredMountsRef.current.indexOf(updateFn)
        if (index !== -1) {
          deferredMountsRef.current.splice(index, 1)
        }
      }
    },
    [setRequestingToRun],
  )

  useFacetLayoutEffect(
    (requestingToRun) => {
      // Even if we are not considered to be running, we need to check if there is still
      // work pending to be done. If there is... we still need to run this effect.
      if (!requestingToRun && deferredMountsRef.current.length === 0) return

      const work = (startTimestamp: number) => {
        const deferredMounts = deferredMountsRef.current

        // We need to request the new frame at the top
        // otherwise, the state change at the bottom will trigger a new render
        // before we have a chance to cancel
        // Its not possible to detect this with unit testing, so verify on the browser
        // after a change here that this function is not executing every frame unnecessarily
        if (deferredMounts.length > 0) {
          frameId = window.requestAnimationFrame(work)
        }

        let lastUpdateCost = 0
        let now = startTimestamp

        while (deferredMounts.length > 0 && now - startTimestamp + lastUpdateCost < frameTimeBudget) {
          const before = now

          const updateFn = deferredMounts.shift() as UpdateFn
          updateFn(false)

          const after = performance.now()

          lastUpdateCost = after - before
          now = after
        }

        if (deferredMounts.length === 0) {
          setIsDeferring(false)
          setRequestingToRun(false)
        }
      }

      let frameId = window.requestAnimationFrame(work)

      return () => {
        window.cancelAnimationFrame(frameId)
      }
    },
    [frameTimeBudget, setIsDeferring, setRequestingToRun],
    [requestingToRun],
  )

  return (
    <isDeferringContext.Provider value={isDeferring}>
      <pushDeferUpdateContext.Provider value={pushDeferUpdateFunction}>{children}</pushDeferUpdateContext.Provider>
    </isDeferringContext.Provider>
  )
}

interface DeferredMountProps {
  children: ReactElement
}

/**
 * Component that should wrap some mounting that must be deferred to a later frame
 * @param children component to be mounted deferred
 */
export function DeferredMount({ children }: DeferredMountProps) {
  const pushDeferUpdateFunction = useContext(pushDeferUpdateContext)
  const [deferred, setDeferred] = useState(pushDeferUpdateFunction != null)

  useEffect(() => {
    if (pushDeferUpdateFunction) pushDeferUpdateFunction(setDeferred)
  }, [pushDeferUpdateFunction])

  if (deferred) return null
  return children
}

interface ImmediateMountProps {
  children: ReactElement
}

/**
 * Hook that informs if any mounting is currently being deferred
 * Can be used to show some loading indicator
 */
export function useIsDeferring() {
  return useContext(isDeferringContext)
}

/**
 * Allow us to pause costly mounting (mounting) of components
 * So that transitions can occur
 */
export function useIsPaused() {
  return useContext(isPausedContext)
}

/**
 * API compatible component with DeferredMount, but renders immediately
 */
export function ImmediateMount({ children }: ImmediateMountProps) {
  return children
}

interface UpdateFn {
  (deferred: boolean): void
}

interface PushDeferUpdateFunction {
  (updateFn: UpdateFn): void
}

const pushDeferUpdateContext = createContext<PushDeferUpdateFunction | undefined>(undefined)

const isDeferringContext = createContext<Facet<boolean>>(createFacet({ initialValue: false }))

const isPausedContext = createContext<boolean>(false)

/**
 * This pauses the mounting of children components.
 * Given it affects mounting, it should only happen the first time! Asking to pause again in the future is not possible
 */
export function PauseMountProvider({ paused, children }: { paused: boolean; children: ReactNode }) {
  const wasEverResumed = useRef(!paused)

  useEffect(() => {
    if (!paused) {
      wasEverResumed.current = true
    }
  }, [paused])

  return <isPausedContext.Provider value={wasEverResumed.current ? false : paused}>{children}</isPausedContext.Provider>
}
