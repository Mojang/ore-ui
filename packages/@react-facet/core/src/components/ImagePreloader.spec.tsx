import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { ImagePreloader } from './ImagePreloader'

let rafSpy: jest.SpyInstance
let cancelRafSpy: jest.SpyInstance

const REQUEST_ANIMATION_FRAME_TIMEOUT_MS = 10

beforeEach(() => {
  jest.useFakeTimers()
  rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(() => cb(1), REQUEST_ANIMATION_FRAME_TIMEOUT_MS) as unknown as number
  })
  cancelRafSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((timeoutId) => {
    clearTimeout(timeoutId)
  })
})

afterEach(() => {
  jest.clearAllTimers()
  const mock = Element.prototype.getBoundingClientRect as jest.Mock
  if (mock.mockRestore != null) {
    mock.mockRestore()
  }
  rafSpy.mockRestore()
  cancelRafSpy.mockRestore()
})

it('invokes the callback when all images have loaded', () => {
  const urls = createFacet<Array<string>>({ initialValue: [] })
  const callback = jest.fn()
  const getBoundingClientRectStub = jest.fn().mockReturnValue({ height: 0, width: 0 })
  window.HTMLImageElement.prototype.getBoundingClientRect = getBoundingClientRectStub

  render(<ImagePreloader imageUrls={urls} onImagesLoaded={callback} />)

  // The array of urls is empty so the ImagePreloader shouldn't have
  // scheduled any checks on the next animation frame
  expect(rafSpy).not.toHaveBeenCalled()

  // Lets update the facet with some urls. The ImagePreloader should now
  // run a facet effect that schedules a check on the next animation frame.
  urls.set(['http://test-url-1.com', 'http://test-url-2.com'])
  expect(rafSpy).toHaveBeenCalledTimes(1)
  expect(getBoundingClientRectStub).toHaveBeenCalledTimes(1)
  expect(callback).not.toHaveBeenCalled()

  // Advance the timer and make sure that we are performing a check on each animation frame
  jest.advanceTimersByTime(REQUEST_ANIMATION_FRAME_TIMEOUT_MS)
  expect(getBoundingClientRectStub).toHaveBeenCalledTimes(2)
  jest.advanceTimersByTime(REQUEST_ANIMATION_FRAME_TIMEOUT_MS * 2)
  expect(getBoundingClientRectStub).toHaveBeenCalledTimes(4)
  // So far the getBoundingClientRect() calls haven't returned a width or height.
  // Therefore, the callback shouldn't have been invoked.
  expect(callback).not.toHaveBeenCalled()

  // Now lets make getBoundingClientRect() return a width and height.
  getBoundingClientRectStub.mockReturnValue({ height: 10, width: 10 })
  jest.advanceTimersByTime(REQUEST_ANIMATION_FRAME_TIMEOUT_MS)
  // The Array.prototype.every function exits early when the predicate doesn't pass.
  // That means that we should see two more calls to the getBoundingClientRect stub this frame.
  expect(getBoundingClientRectStub).toHaveBeenCalledTimes(6)
  // All image nodes are now returning a width and height. Lets make sure that we've invoked the callback.
  expect(callback).toHaveBeenCalledTimes(1)
})
