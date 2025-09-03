import { createFacet, shallowObjectEqualityCheck } from '..'
import { mapFacetSingleCached } from './mapFacetSingleCached'
import { mapFacetSingleLightweight } from './mapFacetSingleLightweight'

describe.each([mapFacetSingleCached, mapFacetSingleLightweight])('test', (fn) => {
  it('initial value on get', () => {
    const dependency = createFacet({ initialValue: { value: 1 } })

    const result = fn(dependency, (a) => ({ value: `${a.value}` }), shallowObjectEqualityCheck)

    expect(result.get()).toEqual({ value: '1' })
  })

  it('initial value on observe', () => {
    const dependency = createFacet({ initialValue: { value: 1 } })

    const result = fn(dependency, (a) => ({ value: `${a.value}` }), shallowObjectEqualityCheck)

    const listener = jest.fn()
    result.observe(listener)

    expect(listener).toHaveBeenCalledWith({ value: '1' })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('equality checks the initial and next value and calls only once', () => {
    const dependency = createFacet({ initialValue: { value: 1 } })

    const result = fn(dependency, (a) => ({ value: `${a.value}` }), shallowObjectEqualityCheck)

    const listener = jest.fn()
    result.observe(listener)

    expect(listener).toHaveBeenCalledWith({ value: '1' })
    expect(listener).toHaveBeenCalledTimes(1)

    listener.mockClear()
    dependency.set({ value: 1 })

    expect(listener).not.toBeCalled()
  })
})
