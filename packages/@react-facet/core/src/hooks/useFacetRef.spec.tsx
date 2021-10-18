import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useFacetRef } from './useFacetRef'
import { createFacet } from '../facet'
import { NoValue } from '..'

it('passes a value into the ref', () => {
  const mockFacet = createFacet({ initialValue: 'value' })
  let ref: React.RefObject<string | NoValue> = React.createRef()

  const ComponentWithFacetEffect: React.FC = () => {
    ref = useFacetRef(mockFacet)
    expect(ref.current).toBe('value')
    return <span />
  }

  render(<ComponentWithFacetEffect />)
  expect(ref.current).toBe('value')
  mockFacet.set('changed')
  expect(ref.current).toBe('changed')
})
