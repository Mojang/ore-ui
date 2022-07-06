import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useFacetPropSetter } from './useFacetPropSetter'
import { createFacet } from '@react-facet/core'

it('updates a given prop on a shared facet', () => {
  const value = { result: false }
  const testFacet = createFacet({ initialValue: value })

  let setTargetState

  const Instance = () => {
    setTargetState = useFacetPropSetter(testFacet, 'result')
    return null
  }

  render(<Instance />)

  setTargetState(true)

  expect(value.result).toBe(true)
})
