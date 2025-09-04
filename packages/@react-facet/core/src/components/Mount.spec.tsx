import React from 'react'
import { render, act, screen } from '@react-facet/dom-fiber-testing-library'
import { Mount } from '.'
import { createFacet } from '../facet'
import { mapFacetsLightweight } from '../mapFacets'
import { NO_VALUE } from '../types'
import { asPromise } from '..'

it('renders when true', () => {
  const display = createFacet({ initialValue: true })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Hello there</div>
  }

  const Example = () => {
    return (
      <Mount when={display}>
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
  const display = createFacet({ initialValue: false })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Hello there</div>
  }

  const Example = () => {
    return (
      <Mount when={display}>
        <Content />
      </Mount>
    )
  }

  const scenario = <Example />

  render(scenario)

  expect(rendered).not.toHaveBeenCalled()
})

it('can perform conditional rendering', async () => {
  const itemsFacet = createFacet<Array<string>>({ initialValue: NO_VALUE })
  const hasItemsFacet = mapFacetsLightweight<boolean>([itemsFacet], (x) => Boolean((x as Array<string>).length))

  const componentText = 'The component passed the condition and is being rendered'
  const Component = jest.fn()
  Component.mockImplementation(() => <div>{componentText}</div>)

  const Example = () => {
    return (
      <Mount when={hasItemsFacet} condition={false}>
        <Component />
      </Mount>
    )
  }

  const scenario = <Example />
  render(scenario)

  // It should not render before the facet has produced a value.
  expect(screen.queryByText(componentText)).not.toBeInTheDocument()
  expect(Component).not.toHaveBeenCalled()

  await act(async () => {
    itemsFacet.set([])
    await asPromise(itemsFacet)
  })

  expect(screen.queryByText(componentText)).toBeInTheDocument()
  expect(Component).toHaveBeenCalledTimes(1)

  await act(async () => {
    itemsFacet.set(['Lorem ipsum'])
    await asPromise(itemsFacet)
  })

  expect(screen.queryByText(componentText)).not.toBeInTheDocument()
  expect(Component).toHaveBeenCalledTimes(1)
})
