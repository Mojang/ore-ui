// Import from the index to check for sure that APIs are correctly exposed
import * as facet from '.'

describe('regression testing preventing accidental removal of APIs', () => {
  it('exposes the components', () => {
    expect(facet.Map).toBeDefined()
    expect(facet.Mount).toBeDefined()
    expect(facet.With).toBeDefined()
  })

  it('exposes the core facets', () => {
    expect(facet.createFacet).toBeDefined()
    expect(facet.createReadOnlyFacet).toBeDefined()
  })

  it('exposes the hooks', () => {
    expect(facet.useFacetCallback).toBeDefined()
    expect(facet.useFacetEffect).toBeDefined()
    expect(facet.useFacetLayoutEffect).toBeDefined()
    expect(facet.useFacetMap).toBeDefined()
    expect(facet.useFacetMemo).toBeDefined()
    expect(facet.useFacetPropSetter).toBeDefined()
    expect(facet.useFacetReducer).toBeDefined()
    expect(facet.useFacetRef).toBeDefined()
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
