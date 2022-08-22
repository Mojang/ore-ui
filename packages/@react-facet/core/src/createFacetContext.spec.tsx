import React, { useContext } from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { createFacetContext } from './createFacetContext'
import { useFacetState } from './hooks'
import { Setter } from './types'

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
