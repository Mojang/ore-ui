import React from 'react'
import { render } from '../../dom-fiber-testing-library/src'
import { Setter } from '@react-facet/core'
import { sharedFacetWithSetter } from './sharedFacetWithSetter'
import { useSharedFacetWithSetter } from './useSharedFacetWithSetter'
import { SharedFacetDriver } from './types'
import { SharedFacetDriverProvider } from './context'

it('allows setting a shared facet', () => {
  // defines a Facet that has a setter
  const testSharedFacetWithSetter = sharedFacetWithSetter<string>('test-facet-name')

  // define a component that will expose the set function, so that we can use it for testing
  let setter: Setter<string>
  const TestComponent = () => {
    const [set, facet] = useSharedFacetWithSetter(testSharedFacetWithSetter)
    setter = set

    return <fast-text text={facet} />
  }

  // mock driver implementation to check if the set is being called
  const sharedFacetDriverSetMock = jest.fn()
  const sharedFacetDriver: SharedFacetDriver = {
    observe: jest.fn(),
    set: sharedFacetDriverSetMock,
  }

  render(
    <SharedFacetDriverProvider value={sharedFacetDriver}>
      <TestComponent />
    </SharedFacetDriverProvider>,
  )

  // after rendering, we try to simulate as if the component had called the set function
  setter('new value')

  // and we verify it was called on the driver
  expect(sharedFacetDriverSetMock).toHaveBeenCalledWith('test-facet-name', 'new value')
})
