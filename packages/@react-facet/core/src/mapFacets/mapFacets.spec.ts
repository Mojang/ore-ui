import { createFacet } from '../facet'
import { NO_VALUE } from '../types'
import { mapFacetsCached, mapFacetsLightweight } from './mapFacets'

describe('mapFacetsCached', () => {
  it('caches calls to the mapFunction', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction)

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

    // observe twice
    mapFacet.observe(() => {})
    mapFacet.observe(() => {})

    // check that the map was called just once
    expect(mapFunction).toHaveBeenCalledTimes(1)
  })

  it('gets NO_VALUE as a value from a single source if it also has NO_VALUE', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe(NO_VALUE)
  })

  it('gets NO_VALUE as a value from multiple sources if they also have NO_VALUE', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet({ initialValue: 'initial value' })
    const sourceBFacet = createFacet({ initialValue: NO_VALUE })
    const mapFacet = mapFacetsCached([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe(NO_VALUE)
  })

  it('can get the mapped value from a single source before any subscription', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
  })

  it('can get the mapped value from multiple sources before any subscription', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet({ initialValue: 'initial value' })
    const sourceBFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
  })

  it('caches calls to the mapFunction though a get call before any subscription, given a single source', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
    expect(mapFunction).toHaveBeenCalledTimes(1)

    mapFunction.mockClear()
    expect(mapFacet.get()).toBe('dummy')
    expect(mapFunction).not.toHaveBeenCalled()
  })

  it('caches calls to the mapFunction though a get call before any subscription, given multiple sources', () => {
    const mapFunction = jest.fn().mockReturnValue('dummy')
    const sourceAFacet = createFacet({ initialValue: 'initial value' })
    const sourceBFacet = createFacet({ initialValue: 'initial value' })
    const mapFacet = mapFacetsCached([sourceAFacet, sourceBFacet], mapFunction, () => () => false)

    expect(mapFacet.get()).toBe('dummy')
    expect(mapFunction).toHaveBeenCalledTimes(1)

    mapFunction.mockClear()
    expect(mapFacet.get()).toBe('dummy')
    expect(mapFunction).not.toHaveBeenCalled()
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
