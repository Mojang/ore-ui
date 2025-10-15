// Copyright (c) Mojang AB. All rights reserved.

import React from 'react'
import { render, screen } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { NO_VALUE } from '../types'
import { Unwrap } from './Unwrap'

it('renders the child with unwrapped data', () => {
  const mockText = 'Foo'
  const mockFacet = createFacet({ initialValue: mockText })
  render(<Unwrap data={mockFacet}>{(data) => <>{data}</>}</Unwrap>)
  expect(screen.queryByText(mockText)).toBeInTheDocument()
})

it('renders the child with unwrapped nullish data', () => {
  const mockText = 'Bar'
  const mockData = undefined
  const mockFacet = createFacet({ initialValue: mockData })
  render(<Unwrap data={mockFacet}>{(data) => <>{`${mockText}${data}`}</>}</Unwrap>)
  expect(screen.queryByText(`${mockText}${mockData}`)).toBeInTheDocument()
})

it('does not render the child with NO_VALUE', () => {
  const mockText = 'Baz'
  const mockFacet = createFacet<boolean>({ initialValue: NO_VALUE })
  render(<Unwrap data={mockFacet}>{() => <>{mockText}</>}</Unwrap>)
  expect(screen.queryByText(mockText)).not.toBeInTheDocument()
})
