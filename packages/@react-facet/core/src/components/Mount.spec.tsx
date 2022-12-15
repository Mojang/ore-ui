import React from 'react'
import { render, act, screen } from '@react-facet/dom-fiber-testing-library'
import { Mount } from '.'
import { createFacet } from '../facet'
import { mapFacetsLightweight } from '../mapFacets'
import { NO_VALUE } from '../types'

it('renders when true', () => {
  const displayFacet = createFacet({ initialValue: true })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Hello there</div>
  }

  const Example = () => {
    return (
      <Mount when={displayFacet}>
        <Content />
      </Mount>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(rendered).toHaveBeenCalled()
  expect(container.firstChild).toMatchSnapshot()
})

it('does not render when false', () => {
  const displayFacet = createFacet({ initialValue: false })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Hello there</div>
  }

  const Example = () => {
    return (
      <Mount when={displayFacet}>
        <Content />
      </Mount>
    )
  }

  const scenario = <Example />

  render(scenario)

  expect(rendered).not.toHaveBeenCalled()
})

it('can perform conditional rendering', () => {
  const stringArrayFacet = createFacet<Array<string>>({ initialValue: NO_VALUE })
  const doesStringArrayHaveItemsFacet = mapFacetsLightweight<boolean>([stringArrayFacet], (item) =>
    Boolean((item as Array<string>).length),
  )
  const numberFacet = createFacet<number>({ initialValue: NO_VALUE })
  const stringFacet = createFacet<string>({ initialValue: NO_VALUE })

  const booleanComponentText = 'The component passed the boolean condition and is being rendered'
  const BooleanComponent = jest.fn()
  BooleanComponent.mockImplementation(() => <div>{booleanComponentText}</div>)

  const numberComponentText = 'The component passed the numeric condition and is being rendered'
  const NumberComponent = jest.fn()
  NumberComponent.mockImplementation(() => <div>{numberComponentText}</div>)

  const stringComponentText = 'The component passed the string condition and is being rendered'
  const StringComponent = jest.fn()
  StringComponent.mockImplementation(() => <div>{stringComponentText}</div>)

  const Example = () => {
    return (
      <>
        <Mount when={doesStringArrayHaveItemsFacet} is={false}>
          <BooleanComponent />
        </Mount>
        <Mount when={numberFacet} is={0}>
          <NumberComponent />
        </Mount>
        <Mount when={stringFacet} is={'example'}>
          <StringComponent />
        </Mount>
      </>
    )
  }

  const scenario = <Example />
  render(scenario)

  // It should not render before the facet has produced a value.
  expect(screen.queryByText(booleanComponentText)).not.toBeInTheDocument()
  expect(BooleanComponent).not.toHaveBeenCalled()
  expect(screen.queryByText(numberComponentText)).not.toBeInTheDocument()
  expect(NumberComponent).not.toHaveBeenCalled()
  expect(screen.queryByText(stringComponentText)).not.toBeInTheDocument()
  expect(StringComponent).not.toHaveBeenCalled()

  act(() => {
    stringArrayFacet.set([])
    numberFacet.set(0)
    stringFacet.set('example')
  })

  expect(screen.queryByText(booleanComponentText)).toBeInTheDocument()
  expect(BooleanComponent).toHaveBeenCalledTimes(1)
  expect(screen.queryByText(numberComponentText)).toBeInTheDocument()
  expect(NumberComponent).toHaveBeenCalledTimes(1)
  expect(screen.queryByText(stringComponentText)).toBeInTheDocument()
  expect(StringComponent).toHaveBeenCalledTimes(1)

  act(() => {
    stringArrayFacet.set(['Lorem ipsum'])
    numberFacet.set(1)
    stringFacet.set('example 1')
  })

  expect(screen.queryByText(booleanComponentText)).not.toBeInTheDocument()
  expect(BooleanComponent).toHaveBeenCalledTimes(1)
  expect(screen.queryByText(numberComponentText)).not.toBeInTheDocument()
  expect(NumberComponent).toHaveBeenCalledTimes(1)
  expect(screen.queryByText(stringComponentText)).not.toBeInTheDocument()
  expect(StringComponent).toHaveBeenCalledTimes(1)
})

it('can perform conditional rendering with the not prop', () => {
  const stringFacet = createFacet<string | null>({ initialValue: '' })

  const stringComponentText = 'The component passed the string condition and is being rendered'
  const StringComponent = jest.fn()
  StringComponent.mockImplementation(() => <div>{stringComponentText}</div>)

  const Example = () => {
    return (
      <Mount when={stringFacet} not={''}>
        <StringComponent />
      </Mount>
    )
  }

  const scenario = <Example />
  render(scenario)

  expect(screen.queryByText(stringComponentText)).not.toBeInTheDocument()
  expect(StringComponent).not.toHaveBeenCalled()

  act(() => {
    stringFacet.set(' ')
  })

  expect(screen.queryByText(stringComponentText)).toBeInTheDocument()
  expect(StringComponent).toHaveBeenCalledTimes(1)

  act(() => {
    stringFacet.set(null)
  })

  expect(screen.queryByText(stringComponentText)).toBeInTheDocument()
  expect(StringComponent).toHaveBeenCalledTimes(1)
})

it('will ignore the is prop if the not prop exists', () => {
  const stringFacet = createFacet<string | null>({ initialValue: '' })

  const stringComponentText = 'The component passed the string condition and is being rendered'
  const StringComponent = jest.fn()
  StringComponent.mockImplementation(() => <div>{stringComponentText}</div>)

  const Example = () => {
    return (
      <Mount when={stringFacet} is={''} not={''}>
        <StringComponent />
      </Mount>
    )
  }

  const scenario = <Example />
  render(scenario)

  expect(screen.queryByText(stringComponentText)).not.toBeInTheDocument()
  expect(StringComponent).not.toHaveBeenCalled()

  act(() => {
    stringFacet.set('text')
  })

  expect(screen.queryByText(stringComponentText)).toBeInTheDocument()
  expect(StringComponent).toHaveBeenCalledTimes(1)
})
