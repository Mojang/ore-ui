import { render } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import React from 'react'
import { Times } from './Times'

it('renders the child n times, passing the index', () => {
  const mockFacet = createFacet({ initialValue: 3 })
  const result = render(<Times count={mockFacet}>{(index) => <>{index}</>}</Times>)

  // Has all the indexes, proving it looped and rendered all the children
  expect(result.container).toHaveTextContent('012')
})
