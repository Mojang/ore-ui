import React from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { useFacetEffect } from './useFacetEffect'
import { createFacet } from '../facet'

it('triggers the effect on mount with the initial value and on any update of the facet', () => {
  const demoFacet = createFacet({ initialValue: 'initial value' })

  const callback = jest.fn()

  const ComponentWithFacetEffect = () => {
    useFacetEffect(
      (value) => {
        callback(value)
      },
      [],
      demoFacet,
    )

    return null
  }

  const scenario = <ComponentWithFacetEffect />

  render(scenario)

  expect(callback).toHaveBeenCalledWith('initial value')

  // prepare mock for next check
  callback.mockClear()

  // change the facet
  act(() => {
    demoFacet.set(() => 'new value')
  })

  // verify that it was called again, but with the new value
  expect(callback).toHaveBeenCalledWith('new value')
})

it('triggers the effect when a dependency changes', () => {
  const demoFacet = createFacet({ initialValue: 'initial value' })

  const callback = jest.fn()

  const ComponentWithFacetEffect = ({ dependency }: { dependency: number }) => {
    useFacetEffect(
      (value) => {
        callback(`${value} ${dependency}`)
      },
      [dependency],
      demoFacet,
    )

    return null
  }

  const { rerender } = render(<ComponentWithFacetEffect dependency={0} />)

  expect(callback).toHaveBeenCalledWith('initial value 0')

  // clear the mock, since it was called on the mount
  callback.mockClear()

  // change the dependency
  rerender(<ComponentWithFacetEffect dependency={1} />)

  // verify that the effect was called
  expect(callback).toHaveBeenCalledWith('initial value 1')
})

describe('cleanup', () => {
  it('handles cleanup the effect on changing the value and unmounting', () => {
    const demoFacet = createFacet({ initialValue: 'initial value' })

    const cleanup = jest.fn()

    const ComponentWithFacetEffect = () => {
      useFacetEffect(
        () => {
          return cleanup
        },
        [],
        demoFacet,
      )

      return null
    }

    const scenario = <ComponentWithFacetEffect />

    const { rerender } = render(scenario)

    // cleanup is not called immediately
    expect(cleanup).not.toHaveBeenCalled()

    act(() => {
      demoFacet.set(() => 'new value')
    })

    // once a new value is triggered we expect that the previous cleanup was called
    expect(cleanup).toHaveBeenCalled()

    // clear any recorded calls ahead of next check
    cleanup.mockClear()

    // unmount the component to check if the cleanup is also called
    rerender(<></>)

    // once a new value is triggered we expect that the previous cleanup was called
    expect(cleanup).toHaveBeenCalled()
  })
})
