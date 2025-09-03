import { createFacet, shallowObjectEqualityCheck } from '..'
import { mapFacetArrayCached } from './mapFacetArrayCached'
import { mapFacetArrayLightweight } from './mapFacetArrayLightweight'

type TestValue = { value: string }

describe.each([mapFacetArrayCached, mapFacetArrayLightweight])('test', (fn) => {
  it('initial value on get', () => {
    const dependencies = [createFacet({ initialValue: { value: 1 } }), createFacet({ initialValue: { value: 2 } })]

    const result = fn(
      dependencies,
      (a, b) => ({ value: `${(a as TestValue).value}-${(b as TestValue).value}` }),
      shallowObjectEqualityCheck,
    )

    expect(result.get()).toEqual({ value: '1-2' })
  })

  it('initial value on observe', () => {
    const dependencies = [createFacet({ initialValue: { value: 1 } }), createFacet({ initialValue: { value: 2 } })]

    const result = fn(
      dependencies,
      (a, b) => ({ value: `${(a as TestValue).value}-${(b as TestValue).value}` }),
      shallowObjectEqualityCheck,
    )

    const listener = jest.fn()
    result.observe(listener)

    expect(listener).toHaveBeenCalledWith({ value: '1-2' })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('equality checks the initial and next value and calls only once', () => {
    const dependencies = [createFacet({ initialValue: { value: 1 } }), createFacet({ initialValue: { value: 2 } })]

    const result = fn(
      dependencies,
      (a, b) => ({ value: `${(a as TestValue).value}-${(b as TestValue).value}` }),
      shallowObjectEqualityCheck,
    )

    const listener = jest.fn()
    result.observe(listener)

    expect(listener).toHaveBeenCalledWith({ value: '1-2' })
    expect(listener).toHaveBeenCalledTimes(1)

    listener.mockClear()
    dependencies[0].set({ value: 1 })

    expect(listener).not.toBeCalled()
  })
})
