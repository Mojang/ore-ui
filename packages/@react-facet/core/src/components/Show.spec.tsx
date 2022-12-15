import React from 'react'
import { render, act } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { Show } from './Show'

it('shows children when true', () => {
  const displayFacet = createFacet({ initialValue: true })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Lorem ipsum</div>
  }

  const Example = () => {
    return (
      <Show when={displayFacet}>
        <Content />
      </Show>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(rendered).toHaveBeenCalled()
  expect(container.firstChild).toHaveStyle('display: unset')
})

it('renders hidden children when false', () => {
  const displayFacet = createFacet({ initialValue: false })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Lorem ipsum</div>
  }

  const Example = () => {
    return (
      <Show when={displayFacet}>
        <Content />
      </Show>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(rendered).toHaveBeenCalled()
  expect(container.firstChild).toHaveStyle('display: none')
})

it('can perform conditional rendering', () => {
  const numberFacet = createFacet<number>({ initialValue: 1 })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Lorem ipsum</div>
  }

  const Example = () => {
    return (
      <Show when={numberFacet} not={0}>
        <Content />
      </Show>
    )
  }

  const scenario = <Example />
  const { container } = render(scenario)

  expect(rendered).toHaveBeenCalled()
  expect(container.firstChild).toHaveStyle('display: unset')

  act(() => {
    numberFacet.set(0)
  })

  expect(container.firstChild).toHaveStyle('display: none')
})

it('can use FastDivProps other than style', () => {
  const stringFacet = createFacet<string | null>({ initialValue: 'text' })
  const classNameFacet = createFacet({ initialValue: 'some-class-name' })

  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Lorem ipsum</div>
  }

  const Example = () => {
    return (
      <Show when={stringFacet} not={''} className={classNameFacet}>
        <Content />
      </Show>
    )
  }

  const scenario = <Example />
  const { container } = render(scenario)

  expect(rendered).toHaveBeenCalled()
  expect(container.firstChild).toMatchSnapshot()
  expect(container.firstChild).toHaveStyle('display: unset')
  expect(container.firstChild).toHaveClass('some-class-name')
})

it('accepts a display prop', () => {
  const stringFacet = createFacet<string>({ initialValue: 'text' })

  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Lorem ipsum</div>
  }

  const Example = () => {
    return (
      <Show when={stringFacet} is={'text'} display={'flex'}>
        <Content />
      </Show>
    )
  }

  const scenario = <Example />
  const { container } = render(scenario)

  expect(rendered).toHaveBeenCalled()
  expect(container.firstChild).toHaveStyle('display: flex')
})
