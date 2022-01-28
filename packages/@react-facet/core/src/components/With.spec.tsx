import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { With } from '.'
import { createFacet } from '../facet'
import { Facet, NO_VALUE } from '../types'
import { useFacetMap } from '../hooks'

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
