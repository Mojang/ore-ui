import { WritableFacet } from '@react-facet/core'
import { remoteFacet } from './remoteFacet'
import { remoteSelector } from './remoteSelector'

interface TestFacet {
  values: string[]
}

const remoteFacetDriver = jest.fn()

describe('single dependency', () => {
  it('does not fire without default value', () => {
    const facet = remoteFacet<TestFacet>('my facet')
    const mySelector = remoteSelector((testFacet) => testFacet, [facet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('fires when set without default value', () => {
    const facet = remoteFacet<TestFacet>('my facet')
    const writtableFacet = facet(remoteFacetDriver) as WritableFacet<TestFacet>
    const mySelector = remoteSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
    writtableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const facet = remoteFacet<TestFacet>('my facet', defaultValue)
    const mySelector = remoteSelector((testFacet) => testFacet.values[0], [facet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')
  })
})

describe('array dependency', () => {
  it('does not fire without default value', () => {
    const facet = remoteFacet<TestFacet>('my facet')
    const otherFacet = remoteFacet<TestFacet>('my other facet')
    const mySelector = remoteSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('does not fire without default value on at least one', () => {
    const facet = remoteFacet<TestFacet>('my facet')
    const otherFacet = remoteFacet<TestFacet>('my other facet', { values: ['default value'] })
    const mySelector = remoteSelector((testFacet) => testFacet, [facet, otherFacet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(0)
  })

  it('does fire when triggered without default value', () => {
    const facet = remoteFacet<TestFacet>('my facet')
    const writableFacet = facet(remoteFacetDriver) as WritableFacet<TestFacet>
    const otherFacet = remoteFacet<TestFacet>('other facet')
    const writableOtherFacet = otherFacet(remoteFacetDriver) as WritableFacet<TestFacet>
    const mySelector = remoteSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    writableFacet.set({ values: ['new value'] })
    expect(mock).toHaveBeenCalledTimes(0)
    writableOtherFacet.set({ values: ['other new value'] })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('new value')
  })

  it('fires with default value on dependency', () => {
    const defaultValue = { values: ['default value'] }
    const otherDefaultValue = { values: ['other default value'] }
    const facet = remoteFacet<TestFacet>('my facet', defaultValue)
    const otherFacet = remoteFacet<TestFacet>('my other facet', otherDefaultValue)
    const mySelector = remoteSelector((testFacet) => testFacet.values[0], [facet, otherFacet])
    const mock = jest.fn()
    mySelector(remoteFacetDriver).observe(mock)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('default value')
  })
})
