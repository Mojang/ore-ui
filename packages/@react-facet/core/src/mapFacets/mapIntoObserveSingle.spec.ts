import { defaultEqualityCheck } from '../equalityChecks'
import { NO_VALUE } from '../types'
import { mapIntoObserveSingle } from './mapIntoObserveSingle'

it('checks equality of primitives when passing defaultEqualityCheck', () => {
  const source = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveSingle<number, number>(source, (value) => value, defaultEqualityCheck)
  const listener = jest.fn()

  observe(listener)

  expect(source.observe).toBeCalled()

  // trigger an update and check it was called
  source.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(10)

  // trigger an update (with the same value) and check it wasn't called
  listener.mockClear()
  source.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(0)

  // trigger an update (with a new value) and check it was called
  listener.mockClear()
  source.observe.mock.calls[0][0](20)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(20)
})

it('checks equality of undefined when passing defaultEqualityCheck', () => {
  const source = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveSingle<number | undefined, number | undefined>(
    source,
    (value) => value,
    defaultEqualityCheck,
  )
  const listener = jest.fn()

  observe(listener)

  expect(source.observe).toBeCalled()

  // trigger an update and check it was called
  source.observe.mock.calls[0][0](undefined)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(undefined)

  // trigger an update (with the same value) and check it wasn't called
  listener.mockClear()
  source.observe.mock.calls[0][0](undefined)
  expect(listener).toBeCalledTimes(0)

  // trigger an update (with a new value) and check it was called
  listener.mockClear()
  source.observe.mock.calls[0][0](20)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(20)
})

it('does not checks equality of primitives by default', () => {
  const source = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveSingle<number, number>(source, (value) => value)
  const listener = jest.fn()

  observe(listener)

  expect(source.observe).toBeCalled()

  // trigger an update and check it was called
  source.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(10)

  // trigger an update (with the same value) and check it was called
  listener.mockClear()
  source.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(10)
})

it('keeps equality checks per observe', () => {
  const source = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveSingle<number, number>(source, (value) => value, defaultEqualityCheck)
  const listenerC = jest.fn()
  const listenerD = jest.fn()

  observe(listenerC)
  observe(listenerD)

  // trigger an update for each listener
  source.observe.mock.calls[0][0](10)
  source.observe.mock.calls[1][0](10)

  expect(listenerC).toBeCalledTimes(1)
  expect(listenerC).toBeCalledWith(10)
  expect(listenerD).toBeCalledTimes(1)
  expect(listenerD).toBeCalledWith(10)
})

it('supports custom equality checks', () => {
  const source = { observe: jest.fn(), get: jest.fn() }

  // always equals, should prevent updates
  const customEqualityCheck = () => () => true

  const observe = mapIntoObserveSingle<number, number>(source, (value) => value, customEqualityCheck)
  const listener = jest.fn()

  observe(listener)

  expect(source.observe).toBeCalled()

  // trigger an update and check it wasn't called
  listener.mockClear()
  source.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(0)
})

describe('mapping to NO_VALUE', () => {
  it('stops propagation when no equalityCheck is provided', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingle<number, number>(source, () => NO_VALUE)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check listener was NOT called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })

  it('stops propagation when defaultEqualityCheck is provided', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingle<number, number>(source, () => NO_VALUE, defaultEqualityCheck)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check listener was NOT called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })

  it('stops propagation when a custom equalityCheck is provided', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    // is never equal
    const customEqualityCheck = () => () => false

    const observe = mapIntoObserveSingle<number, number>(source, () => NO_VALUE, customEqualityCheck)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check listener was NOT called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })
})
