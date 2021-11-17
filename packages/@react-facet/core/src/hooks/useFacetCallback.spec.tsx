import React, { useEffect, useRef } from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useFacetCallback } from './useFacetCallback'
import { useFacetEffect } from './useFacetEffect'
import { useFacetMap } from './useFacetMap'
import { NO_VALUE } from '../types'
import { createFacet } from '../facet'
import { NoValue } from '..'

it('captures the current value of the facet in a function that can be used as handler', () => {
  const demoFacet = createFacet({ initialValue: 'initial value' })

  const callback = jest.fn()

  type ComponentWithFacetCallbackProps = {
    cb: (value: string | undefined, dependency: string, event: string) => void
    dependency: string
  }

  const ComponentWithFacetCallback = ({ cb, dependency }: ComponentWithFacetCallbackProps) => {
    const handler = useFacetCallback(
      (value) => (event) => {
        cb(value, dependency, event)
      },
      [dependency, cb],
      demoFacet,
    )

    useEffect(() => {
      handler('event')
    })

    return null
  }

  const result = render(<ComponentWithFacetCallback cb={callback} dependency="dependency" />)

  expect(callback).toHaveBeenCalledWith('initial value', 'dependency', 'event')

  // prepare mock for next check
  callback.mockClear()

  result.rerender(<ComponentWithFacetCallback cb={callback} dependency="dependency changed" />)

  expect(callback).toHaveBeenCalledWith('initial value', 'dependency changed', 'event')

  // prepare mock for next check
  callback.mockClear()

  // change the facet
  demoFacet.set('new value')

  result.rerender(<ComponentWithFacetCallback cb={callback} dependency="dependency changed" />)

  expect(callback).toHaveBeenCalledWith('new value', 'dependency changed', 'event')
})

it('properly memoizes the returned facet', () => {
  const demoFacet = createFacet({ initialValue: 'initial value' })

  const TestComponent = () => {
    const previousCallbackRef = useRef<() => void | NoValue>()
    const callback = useFacetCallback(() => () => {}, [], demoFacet)

    // Check if it is a second render
    if (previousCallbackRef.current) {
      // check if previous and current are the same instance
      if (previousCallbackRef.current !== callback) {
        throw new Error('Callback instance has change')
      }
    }

    previousCallbackRef.current = callback

    return null
  }

  const { rerender } = render(<TestComponent />)

  // Render a second time to check (inside the component)
  // if the instance is the same
  rerender(<TestComponent />)
})

it('should work with uninitialized values', () => {
  const demoFacet = createFacet<string>({ initialValue: NO_VALUE })

  const callback = jest.fn()

  type ComponentWithFacetCallbackProps = {
    cb: (value: string | undefined) => void
  }

  const ComponentWithFacetCallback = ({ cb }: ComponentWithFacetCallbackProps) => {
    const internalDemoFacet = useFacetMap((facet) => facet + facet, [], [demoFacet])
    const handler = useFacetCallback(
      (value) => () => {
        cb(value)
      },
      [cb],
      internalDemoFacet,
    )

    useFacetEffect(
      () => {
        handler()
      },
      [handler],
      internalDemoFacet,
    )

    return null
  }

  render(<ComponentWithFacetCallback cb={callback} />)

  expect(callback).toHaveBeenCalledTimes(0)
  demoFacet.set('value')

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith('valuevalue')
})
