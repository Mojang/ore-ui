import React, { useRef, Component } from 'react'
import { useFacetUnwrap, useFacetEffect, NO_VALUE } from '@react-facet/core'
import { render } from '@react-facet/dom-fiber-testing-library'
import { sharedDynamicSelector } from './sharedDynamicSelector'
import { sharedFacet } from './sharedFacet'
import { sharedSelector } from './sharedSelector'
import { SharedFacetDriverProvider, useSharedFacet } from './context'
import { SharedFacetDriver } from './types'

const facetDestructor = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sharedFacetDriver = jest.fn().mockImplementation((name: string, onChange: (value: any) => void) => {
  if (name !== 'foo') throw new Error(`Unexpected facet requested: ${name}`)

  onChange({ bar: 'testing 123', values: ['a', 'b', 'c'] })

  return facetDestructor
})

interface Foo {
  bar: number
  values: string[]
}

const fooFacet = sharedFacet<Foo>('foo')

const barSelector = sharedSelector((foo) => foo.bar, [fooFacet])

const valueDynamicSelector = sharedDynamicSelector((index: number) => [
  (testFacet) => testFacet.values[index],
  [fooFacet],
])

beforeEach(() => {
  sharedFacetDriver.mockClear()
  facetDestructor.mockClear()
})

describe('rendering from facet', () => {
  const RenderingFacet = () => {
    const value = useFacetUnwrap(useSharedFacet(fooFacet))
    return <div>{value !== NO_VALUE ? value.bar : null}</div>
  }

  it('constructs a facet, and destructs it on unmount', () => {
    const app = (
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingFacet />
      </SharedFacetDriverProvider>
    )

    const { getByText, rerender } = render(app)

    expect(sharedFacetDriver).toBeCalledTimes(1)
    expect(facetDestructor).toBeCalledTimes(0)

    expect(getByText('testing 123')).toBeDefined()

    sharedFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <></>
      </SharedFacetDriverProvider>,
    )

    expect(sharedFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(1)
  })

  it('constructs a facet once, even on rendering multiple times', () => {
    const app = (
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingFacet />
        <RenderingFacet />
        <RenderingFacet />
        <RenderingFacet />
      </SharedFacetDriverProvider>
    )

    const { getAllByText } = render(app)

    expect(sharedFacetDriver).toBeCalledTimes(1)
    expect(getAllByText('testing 123')).toHaveLength(4)
  })

  describe('the facet is not available or throws an error', () => {
    interface ErrorCatcherProps {
      children: React.ReactNode
      onError(error: Error): void
    }

    class ErrorCatcher extends Component<ErrorCatcherProps, { hasError: boolean }> {
      constructor(props) {
        super(props)
        this.state = { hasError: false }
      }

      componentDidCatch(error: Error) {
        this.props.onError(error)
      }

      static getDerivedStateFromError() {
        return { hasError: true }
      }

      render() {
        if (this.state.hasError) {
          console.log('HAS ERROR')
          // You can render any custom fallback UI
          return 'error'
        }

        return this.props.children
      }
    }

    it('throws an error that can be caught by an ErrorBoundary', () => {
      const failingSharedFacetDriver: SharedFacetDriver = (name, onChange, onError) => {
        onError?.('facet not available') // TODO find the right type for the error code
        return () => {}
      }

      const handleError = jest.fn()

      const app = (
        <SharedFacetDriverProvider value={failingSharedFacetDriver}>
          <ErrorCatcher onError={handleError}>
            <RenderingFacet />
          </ErrorCatcher>
        </SharedFacetDriverProvider>
      )

      const { container } = render(app)

      expect(container).toContainHTML('error')
      expect(handleError).toHaveBeenCalled()
    })
  })
})

describe('rendering from a selector', () => {
  const RenderingSelector = () => {
    const value = useFacetUnwrap(useSharedFacet(barSelector))
    return <div>{value}</div>
  }

  it('constructs the root facet, and destructs it on unmount', () => {
    const app = (
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingSelector />
      </SharedFacetDriverProvider>
    )

    const { getByText, rerender } = render(app)

    expect(sharedFacetDriver).toBeCalledTimes(1)
    expect(facetDestructor).toBeCalledTimes(0)

    expect(getByText('testing 123')).toBeDefined()

    sharedFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <></>
      </SharedFacetDriverProvider>,
    )

    expect(sharedFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(1)
  })

  it('correctly renders nested components with selectors', () => {
    const NestedExample = () => {
      const value = useFacetUnwrap(useSharedFacet(fooFacet))

      if (value === NO_VALUE) return null

      return (
        <div>
          <RenderingSelector />
        </div>
      )
    }

    const app = (
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <NestedExample />
      </SharedFacetDriverProvider>
    )

    const { getByText } = render(app)

    expect(getByText('testing 123')).toBeDefined()
  })

  it('constructs the root facet once, even on rendering multiple times', () => {
    const app = (
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingSelector />
        <RenderingSelector />
        <RenderingSelector />
        <RenderingSelector />
      </SharedFacetDriverProvider>
    )

    const { getAllByText } = render(app)

    expect(sharedFacetDriver).toBeCalledTimes(1)
    expect(getAllByText('testing 123')).toHaveLength(4)
  })
})

describe('rendering from a dynamic selector', () => {
  it('correctly renders using the selector parameter', () => {
    const RenderingSelector = ({ index }: { index: number }) => {
      const value = useFacetUnwrap(useSharedFacet(valueDynamicSelector(index)))
      return <div>Item: {value}</div>
    }

    const { getByText, rerender } = render(
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingSelector index={2} />
        <RenderingSelector index={1} />
      </SharedFacetDriverProvider>,
    )

    // request the facet only once
    expect(sharedFacetDriver).toBeCalledTimes(1)
    expect(facetDestructor).toBeCalledTimes(0)

    // renders both components (each with their parameter)
    expect(getByText('Item: c')).toBeDefined()
    expect(getByText('Item: b')).toBeDefined()

    // cleanup the call count before rendering
    sharedFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingSelector index={2} />
        <RenderingSelector index={0} />
      </SharedFacetDriverProvider>,
    )

    // confirm that the facet should not have been requested again
    expect(sharedFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(0)

    // renders both components (each with their parameter)
    expect(getByText('Item: c')).toBeDefined()
    expect(getByText('Item: a')).toBeDefined()

    // cleanup the call count before rendering
    sharedFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <></>
      </SharedFacetDriverProvider>,
    )

    // confirm that the facet was destroyed, given we are no longer rendering anything using it
    expect(sharedFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(1)
  })
})

describe('rendering with imperative calls from a selector', () => {
  const RenderingImperativeSelector = ({ callbackDependency }: { callbackDependency: string }) => {
    const ref = useRef<HTMLDivElement>(null)

    useFacetEffect(
      (value: number) => {
        const element = ref.current

        if (element) {
          element.innerHTML = `${value} ${callbackDependency}`
        }
      },
      [callbackDependency],
      [useSharedFacet(barSelector)],
    )

    return <div ref={ref} />
  }

  it('correctly renders the value', () => {
    const app = (
      <SharedFacetDriverProvider value={sharedFacetDriver}>
        <RenderingImperativeSelector callbackDependency="dependency" />
      </SharedFacetDriverProvider>
    )

    const { getByText } = render(app)

    expect(getByText('testing 123 dependency')).toBeDefined()
  })
})
