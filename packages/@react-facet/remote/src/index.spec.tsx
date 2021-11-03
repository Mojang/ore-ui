import React, { useRef } from 'react'
import { useFacetUnwrap, useFacetEffect, NO_VALUE } from '@react-facet/core'
import { render } from '@react-facet/dom-fiber-testing-library'
import { remoteDynamicSelector } from './remoteDynamicSelector'
import { remoteFacet } from './remoteFacet'
import { remoteSelector } from './remoteSelector'
import { RemoteFacetDriverProvider, useRemoteFacet } from './context'

const facetDestructor = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remoteFacetDriver = jest.fn().mockImplementation((name: string, onChange: (value: any) => void) => {
  if (name !== 'foo') throw new Error(`Unexpected facet requested: ${name}`)

  onChange({ bar: 'testing 123', values: ['a', 'b', 'c'] })

  return facetDestructor
})

interface Foo {
  bar: number
  values: string[]
}

const fooFacet = remoteFacet<Foo>('foo')

const barSelector = remoteSelector((foo) => foo.bar, [fooFacet])

const valueDynamicSelector = remoteDynamicSelector((index: number) => [
  (testFacet) => testFacet.values[index],
  [fooFacet],
])

beforeEach(() => {
  remoteFacetDriver.mockClear()
  facetDestructor.mockClear()
})

describe('rendering from facet', () => {
  const RenderingFacet = () => {
    const value = useFacetUnwrap(useRemoteFacet(fooFacet))
    return <div>{value !== NO_VALUE ? value.bar : null}</div>
  }

  it('constructs a facet, and destructs it on unmount', () => {
    const app = (
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingFacet />
      </RemoteFacetDriverProvider>
    )

    const { getByText, rerender } = render(app)

    expect(remoteFacetDriver).toBeCalledTimes(1)
    expect(facetDestructor).toBeCalledTimes(0)

    expect(getByText('testing 123')).toBeDefined()

    remoteFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <></>
      </RemoteFacetDriverProvider>,
    )

    expect(remoteFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(1)
  })

  it('constructs a facet once, even on rendering multiple times', () => {
    const app = (
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingFacet />
        <RenderingFacet />
        <RenderingFacet />
        <RenderingFacet />
      </RemoteFacetDriverProvider>
    )

    const { getAllByText } = render(app)

    expect(remoteFacetDriver).toBeCalledTimes(1)
    expect(getAllByText('testing 123')).toHaveLength(4)
  })
})

describe('rendering from a selector', () => {
  const RenderingSelector = () => {
    const value = useFacetUnwrap(useRemoteFacet(barSelector))
    return <div>{value}</div>
  }

  it('constructs the root facet, and destructs it on unmount', () => {
    const app = (
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingSelector />
      </RemoteFacetDriverProvider>
    )

    const { getByText, rerender } = render(app)

    expect(remoteFacetDriver).toBeCalledTimes(1)
    expect(facetDestructor).toBeCalledTimes(0)

    expect(getByText('testing 123')).toBeDefined()

    remoteFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <></>
      </RemoteFacetDriverProvider>,
    )

    expect(remoteFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(1)
  })

  it('correctly renders nested components with selectors', () => {
    const NestedExample = () => {
      const value = useFacetUnwrap(useRemoteFacet(fooFacet))

      if (value == NO_VALUE) return null

      return (
        <div>
          <RenderingSelector />
        </div>
      )
    }

    const app = (
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <NestedExample />
      </RemoteFacetDriverProvider>
    )

    const { getByText } = render(app)

    expect(getByText('testing 123')).toBeDefined()
  })

  it('constructs the root facet once, even on rendering multiple times', () => {
    const app = (
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingSelector />
        <RenderingSelector />
        <RenderingSelector />
        <RenderingSelector />
      </RemoteFacetDriverProvider>
    )

    const { getAllByText } = render(app)

    expect(remoteFacetDriver).toBeCalledTimes(1)
    expect(getAllByText('testing 123')).toHaveLength(4)
  })
})

describe('rendering from a dynamic selector', () => {
  it('correctly renders using the selector parameter', () => {
    const RenderingSelector = ({ index }: { index: number }) => {
      const value = useFacetUnwrap(useRemoteFacet(valueDynamicSelector(index)))
      return <div>Item: {value}</div>
    }

    const { getByText, rerender } = render(
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingSelector index={2} />
        <RenderingSelector index={1} />
      </RemoteFacetDriverProvider>,
    )

    // request the facet only once
    expect(remoteFacetDriver).toBeCalledTimes(1)
    expect(facetDestructor).toBeCalledTimes(0)

    // renders both components (each with their parameter)
    expect(getByText('Item: c')).toBeDefined()
    expect(getByText('Item: b')).toBeDefined()

    // cleanup the call count before rendering
    remoteFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingSelector index={2} />
        <RenderingSelector index={0} />
      </RemoteFacetDriverProvider>,
    )

    // confirm that the facet should not have been requested again
    expect(remoteFacetDriver).toBeCalledTimes(0)
    expect(facetDestructor).toBeCalledTimes(0)

    // renders both components (each with their parameter)
    expect(getByText('Item: c')).toBeDefined()
    expect(getByText('Item: a')).toBeDefined()

    // cleanup the call count before rendering
    remoteFacetDriver.mockClear()
    facetDestructor.mockClear()

    rerender(
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <></>
      </RemoteFacetDriverProvider>,
    )

    // confirm that the facet was destroyed, given we are no longer rendering anything using it
    expect(remoteFacetDriver).toBeCalledTimes(0)
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
      useRemoteFacet(barSelector),
    )

    return <div ref={ref} />
  }

  it('correctly renders the value', () => {
    const app = (
      <RemoteFacetDriverProvider value={remoteFacetDriver}>
        <RenderingImperativeSelector callbackDependency="dependency" />
      </RemoteFacetDriverProvider>
    )

    const { getByText } = render(app)

    expect(getByText('testing 123 dependency')).toBeDefined()
  })
})
