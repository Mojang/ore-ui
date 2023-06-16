// Import from the index to check for sure that APIs are correctly exposed
import React from 'react'
import * as facet from '.'
import { createFacet, useFacetEffect, useFacetMap } from '.'
import { act, render } from '@react-facet/dom-fiber-testing-library'

describe('integration testing', () => {
  it('calls effects and corresponding clean up handlers properly when depending on a useFacetMap facet', () => {
    const demoFacet = createFacet({ initialValue: { valueA: 'initialA', valueB: 'initialB' } })

    const cleanup = jest.fn()
    const effect = jest.fn((...args) => {
      return () => cleanup(...args)
    })

    const Scenario = () => {
      const valueAFacet = useFacetMap(({ valueA }) => valueA, [], [demoFacet])
      useFacetEffect(effect, [], [valueAFacet])

      return null
    }

    const { rerender } = render(<Scenario />)

    // cleanup is not called immediately
    expect(cleanup).not.toHaveBeenCalled()

    // ...but the effect is
    expect(effect).toHaveBeenCalledTimes(1)
    expect(effect).toHaveBeenCalledWith('initialA')

    effect.mockClear()

    act(() => {
      demoFacet.set({ valueA: 'initialA', valueB: 'newB' })
    })

    // nothing should be called
    expect(cleanup).not.toHaveBeenCalled()
    expect(effect).not.toHaveBeenCalled()

    act(() => {
      demoFacet.set({ valueA: 'newA', valueB: 'newB' })
    })

    // once a new value is triggered we expect that the previous cleanup was called
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledWith('initialA')

    // ...and the effect is called again with the new value
    expect(effect).toHaveBeenCalledTimes(1)
    expect(effect).toHaveBeenLastCalledWith('newA')

    cleanup.mockClear()
    effect.mockClear()

    // unmount the component to check if the cleanup is also called
    rerender(<></>)

    // when the component unmounts we expect that we cleanup the last called effect
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledWith('newA')

    // the effect shouldn't be called again on unmount
    expect(effect).not.toHaveBeenCalled()
  })
})

describe('regression testing preventing accidental removal of APIs', () => {
  it('exposes the components', () => {
    expect(facet.Map).toBeDefined()
    expect(facet.Mount).toBeDefined()
    expect(facet.With).toBeDefined()
  })

  it('exposes the core facets', () => {
    expect(facet.createFacet).toBeDefined()
    expect(facet.createStaticFacet).toBeDefined()
    expect(facet.createReadOnlyFacet).toBeDefined()
  })

  it('exposes the react facet methods', () => {
    expect(facet.createFacetContext).toBeDefined()
  })

  it('exposes the hooks', () => {
    expect(facet.useFacetCallback).toBeDefined()
    expect(facet.useFacetEffect).toBeDefined()
    expect(facet.useFacetLayoutEffect).toBeDefined()
    expect(facet.useFacetMap).toBeDefined()
    expect(facet.useFacetMemo).toBeDefined()
    expect(facet.useFacetPropSetter).toBeDefined()
    expect(facet.useFacetReducer).toBeDefined()
    expect(facet.useFacetState).toBeDefined()
    expect(facet.useFacetUnwrap).toBeDefined()
    expect(facet.useFacetWrap).toBeDefined()
  })

  it('exposes the equality checks', () => {
    expect(facet.strictEqualityCheck).toBeDefined()
    expect(facet.defaultEqualityCheck).toBeDefined()
    expect(facet.shallowArrayEqualityCheck).toBeDefined()
    expect(facet.shallowObjectArrayEqualityCheck).toBeDefined()
    expect(facet.createNullableEqualityCheck).toBeDefined()
    expect(facet.createUniformArrayEqualityCheck).toBeDefined()
    expect(facet.shallowObjectArrayEqualityCheck).toBeDefined()
    expect(facet.createOptionalValueEqualityCheck).toBeDefined()
    expect(facet.createUniformObjectEqualityCheck).toBeDefined()
    expect(facet.nullableShallowArrayEqualityCheck).toBeDefined()
    expect(facet.nullableShallowObjectEqualityCheck).toBeDefined()
    expect(facet.nullableShallowObjectArrayEqualityCheck).toBeDefined()
    expect(facet.createObjectWithKeySpecificEqualityCheck).toBeDefined()
  })

  it('exposes the mapFacets helpers', () => {
    expect(facet.mapFacetsCached).toBeDefined()
    expect(facet.mapFacetsLightweight).toBeDefined()
  })
})
