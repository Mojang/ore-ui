import React from 'react'
import { sharedFacet } from './sharedFacet'
import { sharedDynamicSelector } from './sharedDynamicSelector'
import { render } from '../../dom-fiber-testing-library/src'
import { useSharedFacet } from './context'

it('allows composing other sharedDynamicSelector', () => {
  const rootSharedFacet = sharedFacet('root', [{ name: 'paulo' }, { name: 'fernando' }, { name: 'danila' }])

  const personSharedDynamicSelector = sharedDynamicSelector((index: number) => [
    (people) => people[index],
    [rootSharedFacet],
  ])

  const nameSharedDynamicSelector = sharedDynamicSelector((index: number) => [
    (person) => person.name,
    [personSharedDynamicSelector(index)],
  ])

  const TestComponent = () => {
    return <fast-text text={useSharedFacet(nameSharedDynamicSelector(0))} />
  }

  const { container } = render(<TestComponent />)
  expect(container).toHaveTextContent('paulo')
})
