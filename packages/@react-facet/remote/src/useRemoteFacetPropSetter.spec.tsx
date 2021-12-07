import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useRemoteFacetPropSetter } from './useRemoteFacetPropSetter'
import { remoteFacet } from './remoteFacet'

it('updates a given prop on a remote facet', () => {
  const value = { result: false }
  const testFacet = remoteFacet('test.facet', value)

  let setTargetState

  const Instance = () => {
    setTargetState = useRemoteFacetPropSetter(testFacet, 'result')
    return null
  }

  render(<Instance />)

  setTargetState(true)

  expect(value.result).toBe(true)
})
