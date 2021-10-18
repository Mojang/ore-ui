import React from 'react'
import { remoteFacet } from './remoteFacet'
import { remoteDynamicSelector } from './remoteDynamicSelector'
import { render } from '../../dom-fiber-testing-library/src'
import { useRemoteFacet } from './context'

it('allows composing other remoteDynamicSelector', () => {
  const rootRemoteFacet = remoteFacet('root', [{ name: 'paulo' }, { name: 'fernando' }, { name: 'danila' }])

  const personRemoteDynamicSelector = remoteDynamicSelector((index: number) => [
    (people) => people[index],
    [rootRemoteFacet],
  ])

  const nameRemoteDynamicSelector = remoteDynamicSelector((index: number) => [
    (person) => person.name,
    [personRemoteDynamicSelector(index)],
  ])

  const TestComponent = () => {
    return <fast-text text={useRemoteFacet(nameRemoteDynamicSelector(0))} />
  }

  const { container } = render(<TestComponent />)
  expect(container).toHaveTextContent('paulo')
})
