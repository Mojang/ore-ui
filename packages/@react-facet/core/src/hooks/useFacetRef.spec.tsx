import React, { createRef } from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useFacetRef } from './useFacetRef'
import { createFacet } from '../facet'
import { NoValue, NO_VALUE } from '..'

it('passes a value into the ref', () => {
  const mockFacet = createFacet({ initialValue: 'value' })
  let ref: React.RefObject<string | NoValue> = createRef()

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

it('should default to no NO_VALUE', () => {
  const mockFacet = createFacet<string>({ initialValue: NO_VALUE })
  let ref: React.RefObject<string | NoValue> = createRef()

  const ComponentWithFacetEffect: React.FC = () => {
    ref = useFacetRef(mockFacet)
    expect(ref.current).toBe(NO_VALUE)
    return <span />
  }

  render(<ComponentWithFacetEffect />)
  expect(ref.current).toBe(NO_VALUE)
  mockFacet.set('value')
  expect(ref.current).toBe('value')
})

it('should be able to set a default value', () => {
  const mockFacet = createFacet<string>({ initialValue: NO_VALUE })
  let ref: React.RefObject<string | NoValue> = createRef()

  const ComponentWithFacetEffect: React.FC = () => {
    ref = useFacetRef(mockFacet, 'fallback')
    expect(ref.current).toBe('fallback')
    return <span />
  }

  render(<ComponentWithFacetEffect />)
  expect(ref.current).toBe('fallback')
  mockFacet.set('value')
  expect(ref.current).toBe('value')
})

it('should ignore the default state if the facet has a value', () => {
  const mockFacet = createFacet<string>({ initialValue: 'initialValue' })
  let ref: React.RefObject<string | NoValue> = createRef()

  const ComponentWithFacetEffect: React.FC = () => {
    ref = useFacetRef(mockFacet, 'fallback')
    expect(ref.current).toBe('initialValue')
    return <span />
  }

  render(<ComponentWithFacetEffect />)
  expect(ref.current).toBe('initialValue')
  mockFacet.set('value')
  expect(ref.current).toBe('value')
})
