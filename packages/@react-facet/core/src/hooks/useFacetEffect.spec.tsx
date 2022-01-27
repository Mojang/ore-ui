import React from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { useFacetEffect } from './useFacetEffect'
import { createFacet } from '../facet'
import { NO_VALUE } from '../types'

it('triggers the effect on mount with the initial value and on any update of the facet', () => {
  const demoFacet = createFacet({ initialValue: 'initial value' })

  const callback = jest.fn()

  const ComponentWithFacetEffect = () => {
    useFacetEffect(
      (value) => {
        callback(value)
      },
      [],
      [demoFacet],
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
    demoFacet.set('new value')
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
      [demoFacet],
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
        [demoFacet],
      )

      return null
    }

    const scenario = <ComponentWithFacetEffect />

    const { rerender } = render(scenario)

    // cleanup is not called immediately
    expect(cleanup).not.toHaveBeenCalled()

    act(() => {
      demoFacet.set('new value')
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

it('supports multiple facets, only triggering the effect once all facets have a value', () => {
  const facetA = createFacet<string>({ initialValue: 'initial value' })
  const facetB = createFacet<number>({ initialValue: NO_VALUE })

  const cleanup = jest.fn()
  const effect = jest.fn().mockReturnValue(cleanup)

  const ComponentWithFacetEffect = () => {
    useFacetEffect(
      (valueA, valueB) => {
        return effect(valueA, valueB)
      },
      [],
      [facetA, facetB],
    )

    return null
  }

  const scenario = <ComponentWithFacetEffect />

  const { rerender } = render(scenario)

  expect(cleanup).not.toHaveBeenCalled()
  expect(effect).not.toHaveBeenCalled()
  effect.mockClear()
  cleanup.mockClear()

  // change only the initialized facet
  act(() => {
    facetA.set('new value')
  })

  // expect that the effect was not called
  expect(cleanup).not.toHaveBeenCalled()
  expect(effect).not.toHaveBeenCalled()
  effect.mockClear()
  cleanup.mockClear()

  // set a value for the second facet
  act(() => {
    facetB.set(123)
  })

  // verify that the effect was finally called with both values
  expect(cleanup).not.toHaveBeenCalled()
  expect(effect).toHaveBeenCalledWith('new value', 123)
  expect(effect).toHaveBeenCalledTimes(1)
  effect.mockClear()
  cleanup.mockClear()

  // update the first facet again
  act(() => {
    facetA.set('one more update')
  })

  // verify that the effect was called again, and now we verify that the previous cleanup was called
  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(effect).toHaveBeenCalledWith('one more update', 123)
  expect(effect).toHaveBeenCalledTimes(1)
  effect.mockClear()
  cleanup.mockClear()

  // and finally we unmount the component
  rerender(<></>)

  // then we get a final cleanup, without the effect being fired
  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(effect).not.toHaveBeenCalled()
})
