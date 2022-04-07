import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useSharedFacetPropSetter } from './useSharedFacetPropSetter'
import { sharedFacet } from './sharedFacet'

it('updates a given prop on a shared facet', () => {
  const value = { result: false }
  const testFacet = sharedFacet('test.facet', value)

  let setTargetState

  const Instance = () => {
    setTargetState = useSharedFacetPropSetter(testFacet, 'result')
    return null
  }

  render(<Instance />)

  setTargetState(true)

  expect(value.result).toBe(true)
})
