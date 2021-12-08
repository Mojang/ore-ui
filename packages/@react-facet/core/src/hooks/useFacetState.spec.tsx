import React from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { Setter, NO_VALUE } from '../types'
import { useFacetState } from './useFacetState'
import { useFacetEffect } from './useFacetEffect'

it('first value is the facet, second is the setter', () => {
  let setAdaptValue: Setter<string>

  const ComponentWithFacetEffect = () => {
    const [facet, setFacet] = useFacetState('initial value')
    setAdaptValue = setFacet

    return (
      <span>
        <fast-text text={facet} />
      </span>
    )
  }

  const scenario = <ComponentWithFacetEffect />

  const { container } = render(scenario)
  expect(container.textContent).toBe('initial value')

  act(() => {
    setAdaptValue((previousValue) => (previousValue !== NO_VALUE ? `${previousValue} ${previousValue}` : ''))
  })

  expect(container.textContent).toBe('initial value initial value')
})

it('should be possible to have value undefined as the first value', () => {
  const effect = jest.fn()

  const ComponentWithFacetEffect = () => {
    const [facet] = useFacetState(undefined)

    useFacetEffect(effect, [], [facet])

    return null
  }

  render(<ComponentWithFacetEffect />)

  expect(effect).toHaveBeenCalledWith(undefined)
})
