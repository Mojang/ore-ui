import { WritableFacet } from '@react-facet/core'
import { safeSharedSelector } from './safeSharedSelector'
import { safeSharedFacet } from './safeSharedFacet'

interface TestFacet {
  values: string[]
}

const sharedFacetDriver = jest.fn()

describe('single dependency', () => {
  it('does not fire without default value', () => {
    const facet = safeSharedFacet<TestFacet>('my facet')
    const mySelector = safeSharedSelector((testFacet) => testFacet, [facet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('fires when set without default value', () => {
    const facet = safeSharedFacet<TestFacet>('my facet')
    const writableFacet = facet(sharedFacetDriver) as WritableFacet<TestFacet>
    const mySelector = safeSharedSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
    writableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const facet = safeSharedFacet<TestFacet>('my facet', defaultValue)
    const mySelector = safeSharedSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')
  })
})

describe('array dependency', () => {
  it('does not fire without default value', () => {
    const facet = safeSharedFacet<TestFacet>('my facet')
    const otherFacet = safeSharedFacet<TestFacet>('my other facet')
    const mySelector = safeSharedSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('does not fire without default value on at least one', () => {
    const facet = safeSharedFacet<TestFacet>('my facet')
    const otherFacet = safeSharedFacet<TestFacet>('my other facet', { values: ['default value'] })
    const mySelector = safeSharedSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('does fire when triggered without default value', () => {
    const facet = safeSharedFacet<TestFacet>('my facet')
    const writableFacet = facet(sharedFacetDriver) as WritableFacet<TestFacet>
    const otherFacet = safeSharedFacet<TestFacet>('other facet')
    const writableOtherFacet = otherFacet(sharedFacetDriver) as WritableFacet<TestFacet>
    const mySelector = safeSharedSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    writableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(0)
    writableOtherFacet.set({ values: ['other new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const otherDefaultValue = { values: ['other default value'] }
    const facet = safeSharedFacet<TestFacet>('my facet', defaultValue)
    const otherFacet = safeSharedFacet<TestFacet>('my other facet', otherDefaultValue)
    const mySelector = safeSharedSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')
  })
})
