import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { createFacet, useFacetMap } from '@react-facet/core'
import { useRemoteFacetPropSetter } from './useRemoteFacetPropSetter'

it('updates a given prop on a remote facet', () => {
  const target = { result: false }
  const state = createFacet({ initialValue: target })

  const Instance = () => {
    const wrappedState = useFacetMap((facet) => facet, [], [state])
    const setTargetState = useRemoteFacetPropSetter(wrappedState, 'result')
    setTargetState(true)
    return null
  }

  render(<Instance />)
  expect(target.result).toBe(true)
})
