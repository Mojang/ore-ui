import { defaultEqualityCheck } from '../equalityChecks'
import { NO_VALUE } from '../types'
import { mapIntoObserveArray, batch } from './mapIntoObserveArray'
import { createFacet } from '../facet'
import { mapFacetSingleLightweight } from './mapFacetSingleLightweight'

it('checks equality of primitives when passing defaultEqualityCheck', () => {
  const sourceA = { observe: jest.fn(), get: jest.fn() }
  const sourceB = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveArray<number>(
    [sourceA, sourceB],
    (valueA: number, valueB: number) => {
      return valueA + valueB
    },
    defaultEqualityCheck,
  )
  const listener = jest.fn()

  observe(listener)

  expect(sourceA.observe).toBeCalled()
  expect(sourceB.observe).toBeCalled()

  // trigger an update on one dependency and check it wasn't called
  sourceA.observe.mock.calls[0][0](10)
  expect(listener).not.toBeCalled()

  // trigger an update on the other dependency and check it was called
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(20)

  // trigger an update (with the same value) and check it wasn't called
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).not.toBeCalled()

  // trigger an update (with a new value) and check it was called
  listener.mockClear()
  sourceA.observe.mock.calls[0][0](20)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(30)
})

it('checks equality of undefined when passing defaultEqualityCheck', () => {
  const sourceA = { observe: jest.fn(), get: jest.fn() }
  const sourceB = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveArray<number | undefined>(
    [sourceA, sourceB],
    (valueA: number | undefined, valueB: number | undefined) => {
      if (valueA === undefined || valueB === undefined) return undefined
      return valueA + valueB
    },
    defaultEqualityCheck,
  )
  const listener = jest.fn()

  observe(listener)

  expect(sourceA.observe).toBeCalled()
  expect(sourceB.observe).toBeCalled()

  // trigger an update on one dependency WITH UNDEFINED and check it wasn't called
  sourceA.observe.mock.calls[0][0](undefined)
  expect(listener).not.toBeCalled()

  // trigger an update on the other dependency and check it was called with the result
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(undefined)

  // trigger an update (with the same value) and check it wasn't called
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).not.toBeCalled()

  // trigger an update (with a new value) and check it was called
  listener.mockClear()
  sourceA.observe.mock.calls[0][0](20)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(30)
})

it('does not checks equality of primitives when disabled', () => {
  const sourceA = { observe: jest.fn(), get: jest.fn() }
  const sourceB = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveArray<number>([sourceA, sourceB], (valueA: number, valueB: number) => {
    return valueA + valueB
  })
  const listener = jest.fn()

  observe(listener)

  expect(sourceA.observe).toBeCalled()
  expect(sourceB.observe).toBeCalled()

  // trigger an update on one dependency and check it wasn't called
  sourceA.observe.mock.calls[0][0](10)
  expect(listener).not.toBeCalled()

  // trigger an update on the other dependency and check it was called
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(20)

  // trigger an update (with the same value) and check it was called
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith(20)
})

it('keeps equality checks per observe', () => {
  const sourceA = { observe: jest.fn(), get: jest.fn() }
  const sourceB = { observe: jest.fn(), get: jest.fn() }

  const observe = mapIntoObserveArray<number>(
    [sourceA, sourceB],
    (valueA: number, valueB: number) => {
      return valueA + valueB
    },
    defaultEqualityCheck,
  )
  const listenerC = jest.fn()
  const listenerD = jest.fn()

  observe(listenerC)
  observe(listenerD)

  // trigger an update for each listener
  sourceA.observe.mock.calls[0][0](10)
  sourceB.observe.mock.calls[0][0](10)
  sourceA.observe.mock.calls[1][0](10)
  sourceB.observe.mock.calls[1][0](10)

  expect(listenerC).toBeCalledTimes(1)
  expect(listenerC).toBeCalledWith(20)
  expect(listenerD).toBeCalledTimes(1)
  expect(listenerD).toBeCalledWith(20)
})

it('supports custom equality checks', () => {
  const sourceA = { observe: jest.fn(), get: jest.fn() }
  const sourceB = { observe: jest.fn(), get: jest.fn() }

  // always equals, should prevent updates
  const customEqualityCheck = () => () => true

  const observe = mapIntoObserveArray<number>(
    [sourceA, sourceB],
    (valueA: number, valueB: number) => {
      return valueA + valueB
    },
    customEqualityCheck,
  )
  const listener = jest.fn()

  observe(listener)

  expect(sourceA.observe).toBeCalled()
  expect(sourceB.observe).toBeCalled()

  // trigger an update on one dependency and check it wasn't called
  sourceA.observe.mock.calls[0][0](10)
  expect(listener).not.toBeCalled()

  // trigger an update on the other dependency and check it wasn't called
  listener.mockClear()
  sourceB.observe.mock.calls[0][0](10)
  expect(listener).not.toBeCalled()
})

describe('mapping to NO_VALUE', () => {
  it('stops propagation when no equalityCheck is provided', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveArray<number>([source], () => NO_VALUE)

    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update on one dependency and check it wasn't called
    source.observe.mock.calls[0][0](10)
    expect(listener).not.toBeCalled()
  })

  it('stops propagation when defaultEqualityCheck is provided', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    const observe = mapIntoObserveArray<number>([source], () => NO_VALUE, defaultEqualityCheck)

    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update on one dependency and check it wasn't called
    source.observe.mock.calls[0][0](10)
    expect(listener).not.toBeCalled()
  })

  it('stops propagation when a custom equalityCheck is provided', () => {
    const source = { observe: jest.fn(), get: jest.fn() }

    // is never equal
    const customEqualityCheck = () => () => false

    const observe = mapIntoObserveArray<number>([source], () => NO_VALUE, customEqualityCheck)

    const listener = jest.fn()

    observe(listener)

    expect(source.observe).toBeCalled()

    // trigger an update on one dependency and check it wasn't called
    source.observe.mock.calls[0][0](10)
    expect(listener).not.toBeCalled()
  })
})

describe('batch', () => {
  it('supports batching', () => {
    const facetA = createFacet<string>({ initialValue: 'a1' })
    const facetB = createFacet<string>({ initialValue: 'b1' })
    const observe = mapIntoObserveArray([facetA, facetB], (a, b) => `${a} ${b}`)

    const observer = jest.fn()
    observe(observer)

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith('a1 b1')

    jest.clearAllMocks()
    batch(() => {
      facetA.set('a2')
      facetB.set('b2')
    })

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith('a2 b2')
  })

  it('supports batching, but nested', () => {
    const facetA = createFacet<string>({ initialValue: 'a1' })
    const facetB = createFacet<string>({ initialValue: 'b1' })
    const observe = mapIntoObserveArray([facetA, facetB], (a, b) => `${a} ${b}`)

    const observer = jest.fn()
    observe(observer)

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith('a1 b1')

    jest.clearAllMocks()
    batch(() => {
      facetA.set('a2')
      batch(() => {
        facetB.set('b2')
      })
    })

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith('a2 b2')
  })

  it('batches a single facet mapped into multiple facets and then combined again', () => {
    const facet = createFacet<string>({ initialValue: 'a' })
    const first = mapFacetSingleLightweight(facet, (a) => `first ${a}`)
    const second = mapFacetSingleLightweight(facet, (a) => `second ${a}`)

    const observe = mapIntoObserveArray([first, second], (a, b) => `${a},${b}`)

    const observer = jest.fn()
    observe(observer)

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith('first a,second a')

    jest.clearAllMocks()
    batch(() => {
      facet.set('b')
    })

    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith('first b,second b')
  })

  // it('supports composition', () => {
  //   const facetA = createFacet<string>({ initialValue: 'A' })
  //   const facetA_A = mapFacetSingleLightweight(facetA, (a) => `${a}_A`)
  //   const facetA_B = mapFacetSingleLightweight(facetA, (a) => `${a}_B`)
  // })
})

// engine.on('start', () => {
//   batch(() => {
//     engine.on('cnw', (value) => facet.set(value))
//   })
// })
