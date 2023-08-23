import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useSharedFacetPropSetter } from './useSharedFacetPropSetter'
import { sharedFacet } from './sharedFacet'
import { PropSetter } from './types'

type Result = {
  result: boolean
}

it('updates a given prop on a shared facet', () => {
  const value: Result = { result: false }
  const testFacet = sharedFacet('test.facet', value)

  let setTargetState

  const Instance = () => {
    setTargetState = useSharedFacetPropSetter(testFacet, 'result')
    return null
  }

  render(<Instance />)

  const setTargetStateAsPropSetter = setTargetState as unknown as PropSetter<Result, 'result'>

  setTargetStateAsPropSetter(true)

  expect(value.result).toBe(true)
})
