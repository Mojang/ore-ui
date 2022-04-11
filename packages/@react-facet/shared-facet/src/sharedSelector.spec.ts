import { WritableFacet } from '@react-facet/core'
import { sharedFacet } from './sharedFacet'
import { sharedSelector } from './sharedSelector'

interface TestFacet {
  values: string[]
}

const sharedFacetDriver = jest.fn()

describe('single dependency', () => {
  it('does not fire without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const mySelector = sharedSelector((testFacet) => testFacet, [facet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('fires when set without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const writtableFacet = facet(sharedFacetDriver) as WritableFacet<TestFacet>
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
    writtableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const facet = sharedFacet<TestFacet>('my facet', defaultValue)
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')
  })
})

describe('array dependency', () => {
  it('does not fire without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const otherFacet = sharedFacet<TestFacet>('my other facet')
    const mySelector = sharedSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('does not fire without default value on at least one', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const otherFacet = sharedFacet<TestFacet>('my other facet', { values: ['default value'] })
    const mySelector = sharedSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('does fire when triggered without default value', () => {
    const facet = sharedFacet<TestFacet>('my facet')
    const writableFacet = facet(sharedFacetDriver) as WritableFacet<TestFacet>
    const otherFacet = sharedFacet<TestFacet>('other facet')
    const writableOtherFacet = otherFacet(sharedFacetDriver) as WritableFacet<TestFacet>
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
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
    const facet = sharedFacet<TestFacet>('my facet', defaultValue)
    const otherFacet = sharedFacet<TestFacet>('my other facet', otherDefaultValue)
    const mySelector = sharedSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    mySelector(sharedFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')
  })
})
