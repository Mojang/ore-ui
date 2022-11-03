import React, { useContext } from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { createFacetContext } from './createFacetContext'
import { useFacetState } from './hooks'
import { Facet, Setter } from './types'

it(`has default value`, () => {
  const defaultValue = 'defaultValue'
  const context = createFacetContext(defaultValue)
  const Component = () => {
    const stringFacet = useContext(context)
    return <fast-text text={stringFacet}></fast-text>
  }

  const result = render(<Component />)

  expect(result.baseElement).toContainHTML(defaultValue)
})

it(`allows provider to set new value`, () => {
  const defaultValue = 'defaultValue'
  const context = createFacetContext(defaultValue)
  const Component = () => {
    const stringFacet = useContext(context)
    return <fast-text text={stringFacet}></fast-text>
  }
  const newValue = 'newValue'
  const App = () => {
    const [facet] = useFacetState(newValue)

    return (
      <context.Provider value={facet}>
        <Component />
      </context.Provider>
    )
  }
  const result = render(<App />)

  expect(result.baseElement).toContainHTML(newValue)
})

it(`it updates the context value without re-conciliation`, () => {
  const defaultValue = 'defaultValue'
  const context = createFacetContext(defaultValue)
  const Component = () => {
    const stringFacet = useContext(context)
    return <fast-text text={stringFacet}></fast-text>
  }
  const newValue = 'newValue'
  let setFacet: Setter<string>
  const hasRenderedMock = jest.fn()
  const App = () => {
    const [stringFacet, setStringFacet] = useFacetState(newValue)
    setFacet = setStringFacet
    hasRenderedMock()
    return (
      <context.Provider value={stringFacet}>
        <Component />
      </context.Provider>
    )
  }
  const result = render(<App />)

  expect(hasRenderedMock).toBeCalledTimes(1)
  expect(result.baseElement).toContainHTML(newValue)
  const evenNewerValue = 'newNewValue'
  act(() => {
    setFacet(evenNewerValue)
  })

  expect(result.baseElement).toContainHTML(evenNewerValue)
  expect(hasRenderedMock).toBeCalledTimes(1)
})

// Tests that the intial value of the createFacetContext is static
describe('createFacetContext initial facet', () => {
  const env = process.env
  let staticFacet: Facet<string>
  const defaultValue = 'defaultValue'

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }

    const context = createFacetContext(defaultValue)
    const Component = () => {
      const stringFacet = useContext(context)
      staticFacet = stringFacet
      return <fast-text text={stringFacet}></fast-text>
    }

    render(<Component />)
  })

  afterEach(() => {
    process.env = env
  })

  it(`it can be read but not mutated`, () => {
    act(() => {
      expect(staticFacet.get()).toBe(defaultValue)
      expect('set' in staticFacet).toBe(false)
    })
  })

  it(`it responds with the same value if you observe it and warns you in a non-production environment`, () => {
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

    const update = jest.fn()
    process.env.NODE_ENV = 'development'

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(1)
    expect(consoleLogMock).toHaveBeenCalledWith(
      `Accessing a static facet created through createFacetContext, perhaps you're missing a Context Provider? initialValue: `,
      JSON.stringify(defaultValue),
    )

    update.mockClear()
    consoleLogMock.mockClear()

    process.env.NODE_ENV = 'production'

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(0)
    process.env.NODE_ENV = 'test' // Restore NODE_ENV back to test to not mess with subsequent tests
  })

  it(`it responds with the same value if you observe it and warns you in a non-test environment`, () => {
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

    const update = jest.fn()
    process.env.NODE_ENV = 'development'

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(1)
    expect(consoleLogMock).toHaveBeenCalledWith(
      `Accessing a static facet created through createFacetContext, perhaps you're missing a Context Provider? initialValue: `,
      JSON.stringify(defaultValue),
    )

    update.mockClear()
    consoleLogMock.mockClear()

    process.env.NODE_ENV = 'test'

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(0)
  })

  it(`it responds with the same value if you observe it and warns you in a non-production environment once per instance`, () => {
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

    const update = jest.fn()
    process.env.NODE_ENV = 'development'

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(1)
    expect(consoleLogMock).toHaveBeenCalledWith(
      `Accessing a static facet created through createFacetContext, perhaps you're missing a Context Provider? initialValue: `,
      JSON.stringify(defaultValue),
    )

    update.mockClear()
    consoleLogMock.mockClear()

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(0)

    update.mockClear()
    consoleLogMock.mockClear()

    process.env.NODE_ENV = 'test'

    staticFacet.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(defaultValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(0)
  })
})
