import { WritableFacet } from '@react-facet/core'
import { sharedFacet } from './sharedFacet'
import { sharedSelector } from './sharedSelector'

interface TestFacet {
  values: string[]
}

// We need to mock a fake cleanup function
const sharedFacetDriver = jest.fn().mockReturnValue(() => {})

const onError = jest.fn()
describe('single dependency', () => {
  it('does not fire without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const mySelector = sharedSelector((testFacet) => testFacet, [facet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })

  it('fires when set without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const writtableFacet = facet.initializer(sharedFacetDriver, onError) as WritableFacet<TestFacet>
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
    writtableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const facet = sharedFacet<TestFacet>('my facet', defaultValue)
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })
})

describe('array dependency', () => {
  it('does not fire without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const otherFacet = sharedFacet<TestFacet>('my other facet')
    const mySelector = sharedSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })

  it('does not fire without default value on at least one', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const otherFacet = sharedFacet<TestFacet>('my other facet', { values: ['default value'] })
    const mySelector = sharedSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })

  it('does fire when triggered without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const writableFacet = facet.initializer(sharedFacetDriver, onError) as WritableFacet<TestFacet>
    const otherFacet = sharedFacet<TestFacet>('other facet')
    const writableOtherFacet = otherFacet.initializer(sharedFacetDriver, onError) as WritableFacet<TestFacet>
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    writableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(0)
    writableOtherFacet.set({ values: ['other new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const otherDefaultValue = { values: ['other default value'] }
    const facet = sharedFacet<TestFacet>('my facet', defaultValue)
    const otherFacet = sharedFacet<TestFacet>('my other facet', otherDefaultValue)
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    const unsubscribe = mySelector.initializer(sharedFacetDriver, onError).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')

    // cleanup to bust the cache since all facets have the same name
    unsubscribe()
  })
})
