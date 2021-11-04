import React from 'react'
import { render, fireEvent } from '@react-facet/dom-fiber-testing-library'
import { Option, NO_VALUE } from '../types'
import { useFacetReducer } from './useFacetReducer'

it('supports passing a reducer that takes actions to update the facet value', () => {
  const initialState = 0

  type Action = 'increment' | 'decrement'

  function reducer(state: Option<number>, action: Action) {
    state = state === NO_VALUE ? 0 : state

    switch (action) {
      case 'increment':
        return state + 1
      case 'decrement':
        return state - 1
      default:
        throw new Error()
    }
  }

  function Counter() {
    const [state, dispatch] = useFacetReducer<number, Action>(reducer, initialState)

    return (
      <>
        <fast-text text={state} />
        <button data-testid="decrement" onClick={() => dispatch('decrement')} />
        <button data-testid="increment" onClick={() => dispatch('increment')} />
      </>
    )
  }

  const { container, getByTestId } = render(<Counter />)
  expect(container.textContent).toBe('0')

  fireEvent(
    getByTestId('increment'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  expect(container.textContent).toBe('1')

  fireEvent(
    getByTestId('decrement'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  expect(container.textContent).toBe('0')
})
