import React, { Suspense } from 'react'
import { render, act } from '@react-facet/dom-fiber-testing-library'
import { useFacetUnwrap } from './useFacetUnwrap'
import { createFacet } from '../facet'
import { NO_VALUE } from '..'

describe('when mounting facets with values', () => {
  it('renders only once for Immutable value of type string', () => {
    const demoFacet = createFacet({ initialValue: 'initial value' })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(<ComponentWithFacetEffect />)
    expect(renderedMock).toHaveBeenCalledTimes(1)
  })

  it('renders only once for Immutable value of type number', () => {
    const demoFacet = createFacet({ initialValue: 1234 })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(<ComponentWithFacetEffect />)
    expect(renderedMock).toHaveBeenCalledTimes(1)
  })

  it('renders only once for Immutable value of type boolean', () => {
    const demoFacet = createFacet({ initialValue: true })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(<ComponentWithFacetEffect />)
    expect(renderedMock).toHaveBeenCalledTimes(1)
  })

  it('renders only once for Immutable value of type undefined', () => {
    const demoFacet = createFacet({ initialValue: undefined })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(<ComponentWithFacetEffect />)
    expect(renderedMock).toHaveBeenCalledTimes(1)
  })

  it('renders only once for Immutable value of type null', () => {
    const demoFacet = createFacet({ initialValue: null })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(<ComponentWithFacetEffect />)
    expect(renderedMock).toHaveBeenCalledTimes(1)
  })

  // Ideally this should be one time, but unwrapping is mostly used for immutable values
  it('renders twice for Mutable values', () => {
    const demoFacet = createFacet({ initialValue: [] })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(<ComponentWithFacetEffect />)
    expect(renderedMock).toHaveBeenCalledTimes(2)
  })
})

it('triggers when there is a change in the facet', () => {
  const demoFacet = createFacet({ initialValue: 'initial value' })

  const ComponentWithFacetEffect = () => {
    const adaptValue = useFacetUnwrap(demoFacet)

    return <span>{adaptValue}</span>
  }

  const scenario = <ComponentWithFacetEffect />

  const dom = render(scenario)

  expect(dom.container.textContent).toBe('initial value')
})

it('returns static values when given static values', () => {
  const ComponentWithFacetEffect = () => {
    const adaptValue = useFacetUnwrap('static string')
    return <span>{adaptValue}</span>
  }

  const dom = render(<ComponentWithFacetEffect />)
  expect(dom.container.textContent).toBe('static string')
})

it('re-renders when facet is mutated', () => {
  const mockFacetValue = {
    foo: 'foo',
  }

  const demoFacet = createFacet({ initialValue: mockFacetValue })

  const ComponentWithFacetEffect = () => {
    const adaptValue = useFacetUnwrap(demoFacet)
    return <span>{adaptValue.foo}</span>
  }

  const scenario = <ComponentWithFacetEffect />

  const { container } = render(scenario)

  expect(container.textContent).toBe('foo')

  act(() => {
    demoFacet.setWithCallback((prev) => {
      if (prev !== NO_VALUE) {
        prev.foo = 'bar'
        return prev
      }

      return {
        foo: 'banana',
      }
    })
  })

  expect(container.textContent).toBe('bar')
})

it('re-renders when facet is mutated to undefined', () => {
  const mockFacetValue = {
    foo: 'foo',
  } as {
    foo: string | undefined
  }

  const demoFacet = createFacet({ initialValue: mockFacetValue })

  const ComponentWithFacetEffect = () => {
    const adaptValue = useFacetUnwrap(demoFacet)
    return <span>{adaptValue.foo}</span>
  }

  const scenario = <ComponentWithFacetEffect />

  const { container } = render(scenario)

  expect(container.textContent).toBe('foo')

  act(() => {
    demoFacet.setWithCallback((prev) => {
      if (prev !== NO_VALUE) {
        prev.foo = undefined
        return prev
      }

      return {
        foo: 'banana',
      }
    })
  })

  expect(container.textContent).toBe('')
})

it('does not trigger a re-render when changing a facet from undefined to undefined', () => {
  const demoFacet = createFacet({ initialValue: undefined })
  const renderedMock = jest.fn()

  const ComponentWithFacetEffect = () => {
    const adaptValue = useFacetUnwrap(demoFacet)
    renderedMock()

    return <span>{adaptValue}</span>
  }

  render(<ComponentWithFacetEffect />)
  expect(renderedMock).toHaveBeenCalledTimes(1)

  renderedMock.mockClear()

  act(() => {
    demoFacet.set(undefined)
  })

  expect(renderedMock).toHaveBeenCalledTimes(0)
})

describe('suspense', () => {
  it('throws when a facet has NO_VALUE', async () => {
    const demoFacet = createFacet<string>({ initialValue: NO_VALUE })
    const renderedMock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetUnwrap(demoFacet)
      renderedMock()

      return <span>{adaptValue}</span>
    }

    render(
      <Suspense>
        <ComponentWithFacetEffect />
      </Suspense>,
    )

    expect(renderedMock).toHaveBeenCalledTimes(0)

    await act(() => {
      console.log('before setting, in act')
      demoFacet.set('updated value')
    })

    // expect(renderedMock).toHaveBeenCalledTimes(1)
  })
})
