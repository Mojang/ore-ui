import { createFacet } from './facet'
import { mapFacetsLightweight } from './mapFacets'
import { batch } from './batch'

it('supports batching', () => {
  const facetA = createFacet<string>({ initialValue: 'a1' })
  const facetB = createFacet<string>({ initialValue: 'b1' })
  const facetAB = mapFacetsLightweight([facetA, facetB], (a, b) => `${a} ${b}`)

  const observer = jest.fn()
  facetAB.observe(observer)

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('a1 b1')

  jest.clearAllMocks()
  batch(() => {
    facetA.set('a2')
    facetB.set('b2')
  })

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('a2 b2')
})

it('supports batching, but nested', () => {
  const facetA = createFacet<string>({ initialValue: 'a1' })
  const facetB = createFacet<string>({ initialValue: 'b1' })
  const facetAB = mapFacetsLightweight([facetA, facetB], (a, b) => `${a} ${b}`)

  const observer = jest.fn()
  facetAB.observe(observer)

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('a1 b1')

  jest.clearAllMocks()
  batch(() => {
    facetA.set('a2')
    batch(() => {
      facetB.set('b2')
    })
  })

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('a2 b2')
})

it('batches a single facet mapped into multiple facets and then combined again', () => {
  const facet = createFacet<string>({ initialValue: 'a' })
  const first = mapFacetsLightweight([facet], (a) => `first ${a}`)
  const second = mapFacetsLightweight([facet], (a) => `second ${a}`)
  const combinedAgain = mapFacetsLightweight([first, second], (a, b) => `${a},${b}`)

  const observer = jest.fn()
  combinedAgain.observe(observer)

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('first a,second a')

  jest.clearAllMocks()
  facet.set('b')

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('first b,second b')
})

it('batches effects of other batches', () => {
  const derivativeFacet = createFacet<string>({ initialValue: 'a' })
  const derivativeFacetFirst = mapFacetsLightweight([derivativeFacet], (a) => `first ${a}`)
  const derivativeFacetSecond = mapFacetsLightweight([derivativeFacet], (a) => `second ${a}`)
  const derivativeFacetMapped = mapFacetsLightweight(
    [derivativeFacetFirst, derivativeFacetSecond],
    (a, b) => `${a},${b}`,
  )

  const sourceFacetA = createFacet<string>({ initialValue: 'a1' })
  const sourceFacetB = createFacet<string>({ initialValue: 'b1' })
  const mappedFacetAAndFacetB = mapFacetsLightweight([sourceFacetA, sourceFacetB], (a, b) => `${a}_${b}`)

  const observer = jest.fn()
  mappedFacetAAndFacetB.observe((value) => {
    derivativeFacet.set(value)
  })

  derivativeFacetMapped.observe(observer)

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('first a1_b1,second a1_b1')

  jest.clearAllMocks()
  // this batch groups with the batch that's called as an effect of it's function call contents
  batch(() => {
    sourceFacetA.set('a2')
    sourceFacetB.set('b2')
  })

  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('first a2_b2,second a2_b2')
})
