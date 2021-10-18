import 'react'
import { defaultEqualityCheck } from '../equalityChecks'
import { NO_VALUE } from '../types'
import { createFacet } from './createFacet'

describe('equalityChecks', () => {
  describe('with defaultEqualityCheck', () => {
    it('fires for object values, since it can be mutated', () => {
      const update = jest.fn()
      const initialValue = {}
      const mock = createFacet({ initialValue, equalityCheck: defaultEqualityCheck })
      mock.observe(update)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)

      update.mockClear()
      mock.set(initialValue)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)
    })

    it('fires for array values, since it can be mutated', () => {
      const update = jest.fn()
      const initialValue: string[] = []
      const mock = createFacet({ initialValue, equalityCheck: defaultEqualityCheck })
      mock.observe(update)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)

      update.mockClear()
      mock.set(initialValue)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)
    })

    it('does not fire for string', () => {
      const update = jest.fn()
      const initialValue = 'string'
      const mock = createFacet({ initialValue, equalityCheck: defaultEqualityCheck })
      mock.observe(update)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)

      update.mockClear()
      mock.set(initialValue)
      expect(update).toHaveBeenCalledTimes(0)
    })

    it('does not fire for boolean', () => {
      const update = jest.fn()
      const initialValue = true
      const mock = createFacet({ initialValue, equalityCheck: defaultEqualityCheck })
      mock.observe(update)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)

      update.mockClear()
      mock.set(initialValue)
      expect(update).toHaveBeenCalledTimes(0)
    })

    it('does not fire for number', () => {
      const update = jest.fn()
      const initialValue = 1
      const mock = createFacet({ initialValue, equalityCheck: defaultEqualityCheck })
      mock.observe(update)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)

      update.mockClear()
      mock.set(initialValue)
      expect(update).toHaveBeenCalledTimes(0)
    })

    it('fires if the primitive value changed', () => {
      const update = jest.fn()
      const initialValue = 'initial'
      const mock = createFacet({ initialValue, equalityCheck: defaultEqualityCheck })
      mock.observe(update)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(initialValue)

      update.mockClear()
      const newValue = 'new value'
      mock.set(newValue)
      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith(newValue)
    })
  })
})

it('multiple observes, one is cleaned up', () => {
  const updateOne = jest.fn()
  const updateTwo = jest.fn()
  const initialValue = 'initial'
  const mock = createFacet({ initialValue })
  mock.observe(updateOne)
  const unsubscribe = mock.observe(updateTwo)
  expect(updateOne).toHaveBeenCalledTimes(1)
  expect(updateOne).toHaveBeenCalledWith(initialValue)
  expect(updateTwo).toHaveBeenCalledTimes(1)
  expect(updateTwo).toHaveBeenCalledWith(initialValue)

  updateOne.mockClear()
  updateTwo.mockClear()

  unsubscribe()

  const newValue = 'new value'
  mock.set(newValue)
  expect(updateOne).toHaveBeenCalledTimes(1)
  expect(updateOne).toHaveBeenCalledWith(newValue)
  expect(updateTwo).toHaveBeenCalledTimes(0)
})

it('supports unsubscribing as events are firing', () => {
  const updateOne = jest.fn()
  const mock = createFacet<string>({ startSubscription: () => () => {}, initialValue: NO_VALUE })
  const unsubscribeOne = mock.observe(updateOne)
  const updateTwo = jest.fn().mockImplementation(() => {
    unsubscribeOne()
  })
  const updateThree = jest.fn()
  mock.observe(updateTwo)
  mock.observe(updateThree)

  const newValue = 'new value'
  mock.set(newValue)
  expect(updateOne).toHaveBeenCalledTimes(1)
  expect(updateTwo).toHaveBeenCalledTimes(1)
  expect(updateThree).toHaveBeenCalledTimes(1)
})

describe('cleanup', () => {
  it('keeps the value if no startSubscription is provided (useful for local facets)', () => {
    const value = 'test-value'
    const mock = createFacet<string>({ initialValue: NO_VALUE })

    // setup our first listener and write a value to the facet
    const firstListener = jest.fn()
    const firstSubscription = mock.observe(firstListener)
    mock.set(value)

    // verify we get the value
    expect(mock.get()).toBe(value)

    // removing the only subscription, should still keep the value
    firstSubscription()
    expect(mock.get()).toBe(value)
  })

  it('calls the cleanup function and resets the value when the last listener is removed', () => {
    const value = 'test-value'
    const initialValue = 'initial-value'
    const cleanup = jest.fn()
    const startSubscription = jest.fn().mockImplementation((update) => {
      update(value)
      return cleanup
    })

    const mock = createFacet<string>({ startSubscription, initialValue })

    expect(startSubscription).not.toBeCalled()
    expect(mock.get()).toBe(initialValue)

    const firstListener = jest.fn()
    const firstSubscription = mock.observe(firstListener)

    // given it is the first listener, it requests the facet from the startSubscription
    expect(startSubscription).toBeCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()
    expect(mock.get()).toBe(value)

    const secondListener = jest.fn()
    const secondSubscription = mock.observe(secondListener)

    // on a second listener, it should not call it again
    expect(startSubscription).toBeCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()
    expect(mock.get()).toBe(value)

    // removing the first subscription, should not call the cleanup
    firstSubscription()
    expect(cleanup).not.toHaveBeenCalled()
    expect(mock.get()).toBe(value)

    // removing the second (and final) subscription, should call the cleanup
    secondSubscription()
    expect(cleanup).toBeCalledTimes(1)
    expect(mock.get()).toBe(initialValue)
  })
})

it('prevents calling listeners if a setter returns NO_VALUE', () => {
  const facet = createFacet({ initialValue: 10 })
  const cleanupMock = jest.fn()
  const listenerMock = jest.fn().mockReturnValue(cleanupMock)

  facet.observe(listenerMock)

  // after observing it, the listener is called once with the initial value (but not the cleanup)
  expect(listenerMock).toHaveBeenCalledTimes(1)
  expect(listenerMock).toHaveBeenCalledWith(10)
  expect(cleanupMock).not.toHaveBeenCalled()

  listenerMock.mockClear()
  listenerMock.mockClear()
  cleanupMock.mockClear()
  facet.set(() => NO_VALUE)

  // after using a setter callback to return NO_VALUE, the previous cleanup should be called, but not the listener again
  expect(listenerMock).not.toHaveBeenCalled()
  expect(cleanupMock).toHaveBeenCalledTimes(1)
})
