import React from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { With } from '.'
import { createFacet } from '../facet'
import { Facet, NO_VALUE } from '../types'
import { useFacetEffect, useFacetMap } from '../hooks'

it('renders when not null, passing down the information', () => {
  const userFacet = createFacet({ initialValue: { user: 'Zelda' } })

  const Content = ({ data }: { data: Facet<{ user: string }> }) => {
    return (
      <div>
        Hello <fast-text text={useFacetMap(({ user }) => user, [], [data])} />
      </div>
    )
  }

  const Example = () => {
    return <With data={userFacet}>{(dataFacet) => <Content data={dataFacet} />}</With>
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(container.firstChild).toMatchSnapshot()
})

it('does not render when nullish', () => {
  const userFacet = createFacet({ initialValue: null })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Hello there</div>
  }

  const Example = () => {
    return <With data={userFacet}>{() => <Content />}</With>
  }

  const scenario = <Example />

  render(scenario)

  expect(rendered).not.toHaveBeenCalled()
})

it('does not render facet has no value', () => {
  const userFacet = createFacet<boolean>({ initialValue: NO_VALUE })
  const rendered = jest.fn()

  const Content = () => {
    rendered()
    return <div>Hello there</div>
  }

  const Example = () => {
    return <With data={userFacet}>{() => <Content />}</With>
  }
  const scenario = <Example />

  render(scenario)

  expect(rendered).not.toHaveBeenCalled()
})

it('correctly handles unmounting', () => {
  const mockFacet = createFacet<string | null>({ initialValue: 'abc' })

  const Content = ({ data }: { data: Facet<string> }) => {
    useFacetEffect(
      (data) => {
        if (data === null || data === undefined) {
          throw new Error('data should not be null')
        }
      },
      [],
      [data],
    )

    return <>mounted</>
  }

  const Example = () => {
    return <With data={mockFacet}>{(mock) => <Content data={mock} />}</With>
  }
  const scenario = <Example />

  const result = render(scenario)

  expect(result.container).toHaveTextContent('mounted')

  act(() => mockFacet.set(null))

  expect(result.container).not.toHaveTextContent('mounted')
})

it('foo', () => {
  const Foo = () => {
    return (
      <fast-div>
        <fast-text text="Hello World" />
      </fast-div>
    )
  }

  console.log(Foo)
})
