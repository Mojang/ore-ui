import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { createUseSharedFacetHook } from './createUseSharedFacetHook'
import { SharedFacetDriver } from './types'
import { useFacetEffect } from '@react-facet/core'
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
