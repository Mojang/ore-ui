import { NO_VALUE } from '../types'
import {
  mapIntoObserveSingle,
  mapIntoObserveSingleCustomEqualityCheck,
  mapIntoObserveSingleDefaultEqualityCheck,
} from './mapIntoObserveSingle'

describe('mapIntoObserveSingle', () => {
  it('does not check the equality of primitives', () => {
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

  it('mapping to NO_VALUE stops propagation', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingle<number, number>(source, () => NO_VALUE)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check listener was NOT called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })
})

describe('mapIntoObserveSingleDefaultEqualityCheck', () => {
  it('checks equality of primitives', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingleDefaultEqualityCheck<number, number>(source, (value) => value)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // expect the listener to be called once with the initial value
    expect(listener).toBeCalledTimes(1)

    // trigger an update and check it was called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(2)
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

  it('checks equality of undefined', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingleDefaultEqualityCheck<number | undefined, number | undefined>(
      source,
      (value) => value,
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

  it('keeps equality checks per observe', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingleDefaultEqualityCheck<number, number>(source, (value) => value)
    const listenerC = jest.fn()
    const listenerD = jest.fn()

    observe(listenerC)
    observe(listenerD)

    // expect the listeners to be called once with the initial value
    expect(listenerC).toBeCalledTimes(1)
    expect(listenerD).toBeCalledTimes(1)

    // trigger an update for each listener
    source.observe.mock.calls[0][0](10)
    source.observe.mock.calls[1][0](10)

    // expect the listeners to be called a second time with the new value
    expect(listenerC).toBeCalledTimes(2)
    expect(listenerC).toBeCalledWith(10)
    expect(listenerD).toBeCalledTimes(2)
    expect(listenerD).toBeCalledWith(10)
  })

  it('mapping to NO_VALUE stops propagation', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveSingleDefaultEqualityCheck<number, number>(source, () => NO_VALUE)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check listener was NOT called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })
})

describe('mapIntoObserveSingleCustomEqualityCheck', () => {
  it('supports custom equality checks', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    // always equals, should prevent updates
    const customEqualityCheck = () => () => true

    const observe = mapIntoObserveSingleCustomEqualityCheck<number, number>(
      source,
      (value) => value,
      customEqualityCheck,
    )
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check it wasn't called
    listener.mockClear()
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)

    // trigger an update and check it wasn't called
    listener.mockClear()
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })

  it('mapping to NO_VALUE stops propagation', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    // is never equal
    const customEqualityCheck = () => () => false

    const observe = mapIntoObserveSingleCustomEqualityCheck<number, number>(source, () => NO_VALUE, customEqualityCheck)
    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update and check listener was NOT called
    source.observe.mock.calls[0][0](10)
    expect(listener).toBeCalledTimes(0)
  })
})
