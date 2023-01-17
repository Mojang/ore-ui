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
import { createFacet, Facet, useFacetEffect, useFacetState } from '@react-facet/core'

type Config = {
  forceImmediateMount: boolean
}

const DeferredMountConfig = createContext<Config>({ forceImmediateMount: false })

export function DeferredMountConfigProvider({ config, children }: { config: Config; children: React.ReactNode }) {
  return <DeferredMountConfig.Provider value={config}>{children}</DeferredMountConfig.Provider>
}

function useConfig() {
  return useContext(DeferredMountConfig)
}

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

export function InnerDeferredMountProvider({
  children,
  frameTimeBudget = DEFAULT_FRAME_TIME_BUDGET,
}: DeferredMountProviderProps) {
  const [isDeferring, setIsDeferring] = useFacetState(true)
  const waitingForMountCallback = useRef(false)

  const deferredMountsRef = useRef<UpdateFn[]>([])

  const pushDeferUpdateFunction = useCallback(
    (updateFn: UpdateFn) => {
      // Causes a re-render of this component that will kick-off the effect below
      setIsDeferring(true)

      deferredMountsRef.current.push(updateFn)

      /**
       * Cleanup function that makes sure that we don't try to "mount" a deferred component
       * if it has already been unmounted.
       */
      return () => {
        // It is most common that we will be cleaning up after all deferred mounting has been run
        if (deferredMountsRef.current.length === 0 && !waitingForMountCallback.current) return

        const index = deferredMountsRef.current.indexOf(updateFn)
        if (index !== -1) {
          deferredMountsRef.current.splice(index, 1)
        }
      }
    },
    [setIsDeferring],
  )

  useFacetEffect(
    (isDeferring) => {
      // Even if we are not considered to be running, we need to check if there is still
      // work pending to be done. If there is... we still need to run this effect.
      if (!isDeferring && deferredMountsRef.current.length === 0 && !waitingForMountCallback.current) return

      const work = (startTimestamp: number) => {
        const deferredMounts = deferredMountsRef.current

        // We need to request the new frame at the top
        // otherwise, the state change at the bottom will trigger a new render
        // before we have a chance to cancel
        // Its not possible to detect this with unit testing, so verify on the browser
        // after a change here that this function is not executing every frame unnecessarily
        if (deferredMounts.length > 0 || waitingForMountCallback.current) {
          frameId = window.requestAnimationFrame(work)
        } else {
          // Used to check if the requestAnimationFrame has stopped running
          frameId = -1
        }

        let lastUpdateCost = 0
        let now = startTimestamp

        while (
          deferredMounts.length > 0 &&
          now - startTimestamp + lastUpdateCost < frameTimeBudget &&
          !waitingForMountCallback.current
        ) {
          const before = now

          const updateFn = deferredMounts.shift() as UpdateFn
          const result = updateFn(false)

          const after = performance.now()

          lastUpdateCost = after - before
          now = after

          // Can be a function that takes a callback if using DeferredMountWithCallback
          const resultTakesCallback = typeof result === 'function'

          if (resultTakesCallback) {
            waitingForMountCallback.current = true

            result(() => {
              waitingForMountCallback.current = false

              // If the requestAnimationFrame stops running while waiting for the
              // callback we need to restart it to process the rest of the queue.
              if (frameId === -1) {
                frameId = window.requestAnimationFrame(work)
              }
            })
          }
        }

        if (deferredMounts.length === 0 && !waitingForMountCallback.current) {
          setIsDeferring(false)
        }
      }

      let frameId = window.requestAnimationFrame(work)

      return () => {
        window.cancelAnimationFrame(frameId)
      }
    },
    [frameTimeBudget, setIsDeferring],
    [isDeferring],
  )

  return (
    <isDeferringContext.Provider value={isDeferring}>
      <pushDeferUpdateContext.Provider value={pushDeferUpdateFunction}>{children}</pushDeferUpdateContext.Provider>
    </isDeferringContext.Provider>
  )
}

/**
 * Provider that must wrap a tree with nodes being deferred
 */
export function DeferredMountProvider(props: DeferredMountProviderProps) {
  const config = useConfig()
  if (config.forceImmediateMount) {
    return <>{props.children}</>
  }

  return <InnerDeferredMountProvider {...props} />
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

interface DeferredMountWithCallbackProps {
  children: ReactElement
}

const NotifyMountComplete = createContext(() => {})
export const useNotifyMountComplete = () => useContext(NotifyMountComplete)

/**
 * Component that should wrap some mounting that must be deferred to a later frame.
 * This will wait for a callback from the child component before marking itself as rendered.
 * @param children component to be mounted deferred
 */
export function DeferredMountWithCallback({ children }: DeferredMountWithCallbackProps) {
  const pushDeferUpdateFunction = useContext(pushDeferUpdateContext)
  const [deferred, setDeferred] = useState(pushDeferUpdateFunction != null)
  const resolveMountComplete = useRef<(value: void | PromiseLike<void>) => void>()
  const mountCompleteBeforeInitialization = useRef(false)

  const onMountComplete = useCallback(() => {
    if (resolveMountComplete.current != null) {
      resolveMountComplete.current()
    } else {
      mountCompleteBeforeInitialization.current = true
    }
  }, [])

  useEffect(() => {
    if (pushDeferUpdateFunction)
      pushDeferUpdateFunction((isDeferred) => {
        return (resolve) => {
          setDeferred(isDeferred)

          if (mountCompleteBeforeInitialization.current) {
            resolve()
          } else {
            resolveMountComplete.current = resolve
          }
        }
      })
  }, [pushDeferUpdateFunction, onMountComplete])

  if (deferred) return null
  return <NotifyMountComplete.Provider value={onMountComplete}>{children}</NotifyMountComplete.Provider>
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
  (deferred: boolean): void | ((onMountComplete: () => void) => void)
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
