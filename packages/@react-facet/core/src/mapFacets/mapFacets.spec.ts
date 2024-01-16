import { createFacet } from '../facet'
import { NO_VALUE } from '../types'
import { mapFacetsCached, mapFacetsLightweight } from './mapFacets'

describe('mapFacetsCached WITHOUT an initial value', () => {
  it('caches calls to the mapFunction', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet<string>({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction)

    // observe twice
    mapFacet.observe(() => {})
    mapFacet.observe(() => {})

    sourceFacet.set('value')

    // check that the map was called just once
    expect(mapFunction).toHaveBeenCalledTimes(1)
  })

  it('caches calls to the mapFunction with equalityCheck', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet<string>({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    // observe twice
    mapFacet.observe(() => {})
    mapFacet.observe(() => {})

    sourceFacet.set('value')

    // check that the map was called just once
    expect(mapFunction).toHaveBeenCalledTimes(1)
  })

  it('gets NO_VALUE as a value from a single source before any subscription', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet<string>({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe(NO_VALUE)
  })

  it('gets NO_VALUE as a value from multiple sources before any subscription', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet<string>({ initialValue: NO_VALUE })
    const sourceBFacet = createFacet<string>({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe(NO_VALUE)
  })
})

describe('mapFacetsCached WITH an initial value', () => {
  it('calls the map function ahead of subscription to make sure we have the initial value', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    mapFacetsCached([sourceFacet], mapFunction)

    // check that the map was called just once (to map the readily available initial value)
    expect(mapFunction).toHaveBeenCalledTimes(1)
  })

  it('gets the initial value mapped as a value from a single source before any subscription', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
  })

  it('gets the initial value mapped as a value from multiple sources before any subscription', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet({ initialValue: 'initial value' })
    const sourceBFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
  })

  it('gets NO_VALUE as the initial value of the map, if any of multiple sources has NO_VALUE', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet({ initialValue: 'initial value' })
    const sourceBFacet = createFacet({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe(NO_VALUE)
  })

  it('caches calls to the mapFunction', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction)

    // ignore the initial call (not triggered by observing)
    mapFunction.mockClear()

    // observe twice
    mapFacet.observe(() => {})
    mapFacet.observe(() => {})

    // check that the map was called just once
    expect(mapFunction).toHaveBeenCalledTimes(1)
  })

  it('caches calls to the mapFunction with equalityCheck', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    // ignore the initial call (not triggered by observing)
    mapFunction.mockClear()

    // observe twice
    mapFacet.observe(() => {})
    mapFacet.observe(() => {})

    // check that the map was called just once
    expect(mapFunction).toHaveBeenCalledTimes(1)
  })
})

describe('mapFacetsLightweight', () => {
  it('calls the mapFunction on every observe', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsLightweight([sourceFacet], mapFunction)

    // observe twice
    mapFacet.observe(() => {})
    mapFacet.observe(() => {})

    // check that the map was called twice (once for each observe)
    expect(mapFunction).toHaveBeenCalledTimes(2)
  })

  it('gets the value mapped from a single source', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsLightweight([sourceFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
  })

  it('gets the value mapped from multiple sources', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet({ initialValue: 'initial value' })
    const sourceBFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsLightweight([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
  })
})
