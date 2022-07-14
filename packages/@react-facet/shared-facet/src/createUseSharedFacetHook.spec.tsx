import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { createUseSharedFacetHook } from './createUseSharedFacetHook'
import { SharedFacetDriver } from './types'
import { Facet, useFacetEffect } from '@react-facet/core'
import { SharedFacetDriverProvider } from './context'

it('initialized with a type, propagates the call to the driver', () => {
  type User = {
    id: number
    name: string
  }

  type Store = {
    users: User[]
    currentUser: number
    test: {
      nested: {
        structure: boolean
      }
    }
  }

  const useSharedFacet = createUseSharedFacetHook<Store>()

  const store: Store = {
    users: [
      {
        id: 1,
        name: 'Alex',
      },
    ],
    currentUser: 1,
    test: {
      nested: {
        structure: true,
      },
    },
  }

  const unsubscribing = jest.fn()

  const demoDriver: SharedFacetDriver = (path, onUpdate) => {
    if (path.length === 1) {
      onUpdate(store[path[0]])
    }
    if (path.length === 2) {
      onUpdate(store[path[0]][path[1]])
    }
    if (path.length === 3) {
      onUpdate(store[path[0]][path[1]][path[2]])
    }

    return () => {
      unsubscribing(path)
    }
  }

  let currentUserValue: number | null = null
  let structureValue: boolean | null = null
  let userNameValue: string | null = null

  const DemoComponent = () => {
    const currentUser = useSharedFacet('currentUser')
    const structure = useSharedFacet('test', 'nested', 'structure')
    const userName = useSharedFacet('users', 0, 'name')

    useFacetEffect(
      (currentUser, structure, userName) => {
        currentUserValue = currentUser
        structureValue = structure
        userNameValue = userName
      },
      [],
      [currentUser, structure, userName],
    )

    return null
  }

  const result = render(
    <SharedFacetDriverProvider value={demoDriver}>
      <DemoComponent />
    </SharedFacetDriverProvider>,
  )

  expect(currentUserValue).toBe(1)
  expect(structureValue).toBe(true)
  expect(userNameValue).toBe('Alex')

  result.rerender(
    <SharedFacetDriverProvider value={demoDriver}>
      <div />
    </SharedFacetDriverProvider>,
  )

  expect(unsubscribing).toHaveBeenCalledTimes(3)
  expect(unsubscribing).toHaveBeenCalledWith(['currentUser'])
  expect(unsubscribing).toHaveBeenCalledWith(['test', 'nested', 'structure'])
  expect(unsubscribing).toHaveBeenCalledWith(['users', 0, 'name'])
})

describe('subscription lifecycle', () => {
  it.only('only subscribes to the driver once for the same path, returns same facet', () => {
    type User = {
      id: number
      name: string
    }

    type Store = {
      users: User[]
      currentUser: number
      test: {
        nested: {
          structure: boolean
        }
      }
    }

    const useSharedFacet = createUseSharedFacetHook<Store>()

    const subscribing = jest.fn()
    const unsubscribing = jest.fn()

    const demoDriver: SharedFacetDriver = (path) => {
      subscribing(path)

      return () => {
        unsubscribing(path)
      }
    }

    const firstComponent: { [key: string]: Facet<unknown> } = {}
    const secondComponent: { [key: string]: Facet<unknown> } = {}

    const FirstDemoComponent = () => {
      firstComponent.currentUserFacet = useSharedFacet('currentUser')
      firstComponent.structureFacet = useSharedFacet('test', 'nested', 'structure')
      firstComponent.userNameFacet = useSharedFacet('users', 0, 'name')

      return null
    }

    const SecondDemoComponent = () => {
      secondComponent.currentUserFacet = useSharedFacet('currentUser')
      secondComponent.structureFacet = useSharedFacet('test', 'nested', 'structure')
      secondComponent.userNameFacet = useSharedFacet('users', 0, 'name')

      return null
    }

    const result = render(
      <SharedFacetDriverProvider value={demoDriver}>
        <FirstDemoComponent />
        <SecondDemoComponent />
      </SharedFacetDriverProvider>,
    )

    expect(firstComponent.currentUserFacet).toBe(secondComponent.currentUserFacet)
    expect(firstComponent.structureFacet).toBe(secondComponent.structureFacet)
    expect(firstComponent.userNameFacet).toBe(secondComponent.userNameFacet)

    expect(subscribing).toHaveBeenCalledTimes(3)
    expect(subscribing).toHaveBeenCalledWith(['currentUser'])
    expect(subscribing).toHaveBeenCalledWith(['test', 'nested', 'structure'])
    expect(subscribing).toHaveBeenCalledWith(['users', 0, 'name'])

    result.rerender(
      <SharedFacetDriverProvider value={demoDriver}>
        <FirstDemoComponent />
      </SharedFacetDriverProvider>,
    )

    expect(unsubscribing).toHaveBeenCalledTimes(0)

    result.rerender(
      <SharedFacetDriverProvider value={demoDriver}>
        <div />
      </SharedFacetDriverProvider>,
    )

    expect(unsubscribing).toHaveBeenCalledTimes(3)
    expect(unsubscribing).toHaveBeenCalledWith(['currentUser'])
    expect(unsubscribing).toHaveBeenCalledWith(['test', 'nested', 'structure'])
    expect(unsubscribing).toHaveBeenCalledWith(['users', 0, 'name'])
  })
})
