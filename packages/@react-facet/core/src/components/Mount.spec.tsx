import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { Mount } from '.'
import { createFacet } from '../facet'
import { NO_VALUE } from '../types'

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

it('does not render facet has no value', () => {
  const display = createFacet<boolean>({ initialValue: NO_VALUE })
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
