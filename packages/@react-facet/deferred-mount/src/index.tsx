import React, { createContext, useContext, FC, PropsWithChildren, useTransition, useState, useEffect } from 'react'
import { createFacet, Facet } from '@react-facet/core'

type BLANK = Record<string, unknown>

const DeferredMountConfig = createContext<BLANK>({})

export const DeferredMountConfigProvider: FC<PropsWithChildren<BLANK>> = ({ children }) => {
  return <DeferredMountConfig.Provider value={{}}>{children}</DeferredMountConfig.Provider>
}

export const InnerDeferredMountProvider: FC<PropsWithChildren<BLANK>> = ({ children }) => {
  return <>{children}</>
}

export const DeferredMountProvider: FC<PropsWithChildren<BLANK>> = ({ children }) => {
  return <>{children}</>
}

export const DeferredMount: FC<PropsWithChildren<{ isReady?: (x: boolean) => void }>> = ({ children, isReady }) => {
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      isReady && isReady(pending)
    })
  }, [startTransition])

  return <>{children}</>
}

const NotifyMountComplete = createContext(() => {})

export const useNotifyMountComplete = () => useContext(NotifyMountComplete)

/**
 * Component that should wrap some mounting that must be deferred to a later frame.
 * This will wait for a callback from the child component before marking itself as rendered.
 * @param children component to be mounted deferred
 */
export const DeferredMountWithCallback: FC<PropsWithChildren<BLANK>> = ({ children }) => {
  return <>{children}</>
}

const isDeferringContext = createContext<Facet<boolean>>(createFacet({ initialValue: false }))

const isPausedContext = createContext<boolean>(false)

/**
 * Hook that informs if any mounting is currently being deferred
 * Can be used to show some loading indicator
 */
export const useIsDeferring = () => {
  return useContext(isDeferringContext)
}

/**
 * Allow us to pause costly mounting (mounting) of components
 * So that transitions can occur
 */
export const useIsPaused = () => {
  return useContext(isPausedContext)
}

/**
 * API compatible component with DeferredMount, but renders immediately
 */
export const ImmediateMount: FC<PropsWithChildren<BLANK>> = ({ children }) => {
  return <>{children}</>
}

/**
 * This pauses the mounting of children components.
 * Given it affects mounting, it should only happen the first time! Asking to pause again in the future is not possible
 */
export const PauseMountProvider: FC<PropsWithChildren<BLANK>> = ({ children }) => {
  return <>{children}</>
}
