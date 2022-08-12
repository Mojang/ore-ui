import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { createFacet, NO_VALUE } from '@react-facet/core'
import { useFacetLog } from './useFacetLog'

it('logs the current value of the facet, as it changes', () => {
  const demoFacet = createFacet<string>({ initialValue: NO_VALUE })

  const logSpy = jest.spyOn(console, 'log')

  const ComponentWithLog = () => {
    useFacetLog(demoFacet)

    return null
  }

  render(<ComponentWithLog />)

  expect(logSpy).not.toHaveBeenCalled()

  demoFacet.set('test')

  expect(logSpy).toHaveBeenCalledWith('test')

  demoFacet.set('other test')

  expect(logSpy).toHaveBeenCalledWith('other test')

  logSpy.mockReset()
})
