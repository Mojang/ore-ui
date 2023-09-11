import React, { useEffect, useRef } from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { useFacetCallback } from './useFacetCallback'
import { useFacetEffect } from './useFacetEffect'
import { useFacetMap } from './useFacetMap'
import { NO_VALUE, Facet } from '../types'
import { createFacet, createStaticFacet } from '../facet'
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
      (value) => (event: string) => {
        cb(value, dependency, event)
      },
      [dependency, cb],
      [demoFacet],
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
    const callback = useFacetCallback(() => () => {}, [], [demoFacet])

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
      [internalDemoFacet],
    )

    useFacetEffect(
      () => {
        handler()
      },
      [handler],
      [internalDemoFacet],
    )

    return null
  }

  render(<ComponentWithFacetCallback cb={callback} />)

  expect(callback).toHaveBeenCalledTimes(0)
  demoFacet.set('value')

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith('valuevalue')
})

it('supports multiple facets', () => {
  const facetA = createFacet({ initialValue: 'a' })
  const facetB = createFacet({ initialValue: 123 })

  const callback = jest.fn()
  let handler: (event: string) => void

  const TestComponent = ({ dependency }: { dependency: string }) => {
    handler = useFacetCallback(
      (valueA, valueB) => (event: string) => {
        callback(valueA, valueB, dependency, event)
      },
      [dependency],
      [facetA, facetB],
    )

    return null
  }

  render(<TestComponent dependency="dependency" />)

  act(() => {
    handler('event')
  })

  expect(callback).toHaveBeenCalledWith('a', 123, 'dependency', 'event')
})

it('returns NO_VALUE if any facet has NO_VALUE and skip calling the callback', () => {
  const facetA = createFacet({ initialValue: 'a' })
  const facetB = createFacet<number>({ initialValue: NO_VALUE })

  const callback = jest.fn()
  let handler: (event: string) => void

  const TestComponent = ({ dependency }: { dependency: string }) => {
    handler = useFacetCallback(
      (valueA, valueB) => (event: string) => {
        callback(valueA, valueB, dependency, event)
      },
      [dependency],
      [facetA, facetB],
    )

    return null
  }

  render(<TestComponent dependency="dependency" />)

  act(() => {
    const result = handler('event')
    expect(result).toBe(NO_VALUE)
  })

  expect(callback).not.toHaveBeenCalledWith()
})

it('has proper return type with NO_VALUE in it', () => {
  const facetA = createFacet({ initialValue: 'a' })

  let handler: (event: string) => void

  const TestComponent = () => {
    handler = useFacetCallback(
      (a) => (b: string) => {
        return a + b
      },
      [],
      [facetA],
    )

    return null
  }

  render(<TestComponent />)

  act(() => {
    const result = handler('string')
    expect(result).toBe('astring')
  })
})

it('returns the defaultValue, when provided, if any facet has NO_VALUE and skip calling the callback', () => {
  const facetA = createFacet({ initialValue: 'a' })
  const facetB = createFacet<number>({ initialValue: NO_VALUE })

  const callback = jest.fn()
  let handler: (event: string) => string

  const TestComponent = ({ dependency }: { dependency: string }) => {
    handler = useFacetCallback(
      (valueA, valueB) => (event: string) => {
        callback(valueA, valueB, dependency, event)
        return `${valueA} ${valueB}`
      },
      [dependency],
      [facetA, facetB],
      'default value',
    )

    return null
  }

  render(<TestComponent dependency="dependency" />)

  act(() => {
    const result = handler('event')
    expect(result).toBe('default value')
  })

  expect(callback).not.toHaveBeenCalledWith()
})

describe('regressions', () => {
  it('should always have the current value of tracked facets', () => {
    const facetA = createFacet<string>({ initialValue: NO_VALUE })

    let handler: (event: string) => void = () => {}

    const TestComponent = () => {
      handler = useFacetCallback(
        (a) => (b: string) => {
          return a + b
        },
        [],
        [facetA],
      )

      return null
    }

    // We make sure to be the first listener registered, so this is called before
    // the listener within the useFacetCallback (which would have created the issue)
    facetA.observe(() => {
      const result = handler('string')
      expect(result).toBe('newstring')
    })

    render(<TestComponent />)

    // In this act, the effect within useFacetCallback will be executed, subscribing for changes of the facetA
    // Then we set the value, causing the listener above to being called
    act(() => {
      facetA.set('new')
    })
  })

  it('should always have the current value of tracked facets (even after another component unmounts)', () => {
    const facetA = createFacet<string>({
      initialValue: NO_VALUE,

      // We need to have a value from a startSubscription so that after the last listener is removed, we set the facet back to NO_VALUE
      startSubscription: (update) => {
        update('value')
        return () => {}
      },
    })

    let handler: (event: string) => void = () => {}

    const TestComponentA = () => {
      handler = useFacetCallback(
        (a) => (b: string) => {
          return a + b
        },
        [],
        [facetA],
      )

      return null
    }

    const TestComponentB = () => {
      useFacetCallback(() => () => {}, [], [facetA])

      return null
    }

    // We mount both components, both internally calling the useFacetCallback to start subscriptions towards the facetA
    const { rerender } = render(
      <>
        <TestComponentA />
        <TestComponentB />
      </>,
    )

    // Then we unmount one of the components, causing it to unsubscribe from the facetA
    rerender(
      <>
        <TestComponentA />
      </>,
    )

    // However, with a prior implementation, a shared instance of a listener (noop) was used across all useFacetCallback usages
    // causing a mismatch between calls to observer and unsubscribe.
    act(() => {
      const result = handler('string')
      expect(result).toBe('valuestring')
    })
  })

  it('always returns the same callback instance, even if the Facet instances change', () => {
    let handler: () => void = () => {}
    const facetA = createStaticFacet('a')
    const facetB = createStaticFacet('b')

    const TestComponent = ({ facet }: { facet: Facet<string> }) => {
      handler = useFacetCallback(
        (a) => () => {
          return a
        },
        [],
        [facet],
      )

      return null
    }

    const { rerender } = render(<TestComponent facet={facetA} />)
    const firstHandler = handler
    expect(firstHandler()).toBe('a')

    rerender(<TestComponent facet={facetB} />)
    const secondHandler = handler
    expect(secondHandler()).toBe('b')

    expect(firstHandler).toBe(secondHandler)
  })
})
