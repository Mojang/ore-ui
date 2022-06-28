import { createFacet, NO_VALUE } from '..'
import { multiObserve } from './multiObserve'

it('fires immediately when facets are initialized', () => {
  const facetA = createFacet({
    initialValue: 1,
  })
  const facetB = createFacet({
    initialValue: 2,
  })

  let toBeUpdated: number[] = []

  multiObserve(
    (a, b) => {
      toBeUpdated = [a, b]
    },
    [facetA, facetB],
  )

  expect(toBeUpdated).toEqual([1, 2])
})

it('does not fire if at least one of the facets does not yet have a value', () => {
  const facetA = createFacet({
    initialValue: 1,
  })
  const facetB = createFacet<number>({ initialValue: NO_VALUE })

  let toBeUpdated: number[] = []

  multiObserve(
    (a, b) => {
      toBeUpdated = [a, b]
    },
    [facetA, facetB],
  )

  expect(toBeUpdated).toEqual([])
})

it('fires again when any of the dependency facets are updated', () => {
  const facetA = createFacet({
    initialValue: 1,
  })
  const facetB = createFacet({
    initialValue: 2,
  })

  let toBeUpdated: number[] = []

  multiObserve(
    (a, b) => {
      toBeUpdated = [a, b]
    },
    [facetA, facetB],
  )

  facetA.set(3)

  expect(toBeUpdated).toEqual([3, 2])

  facetB.set(4)

  expect(toBeUpdated).toEqual([3, 4])
})

it('calling the return unsubscriber stops the observe from working', () => {
  const facetA = createFacet({
    initialValue: 1,
  })
  const facetB = createFacet({
    initialValue: 2,
  })

  let toBeUpdated: number[] = []

  const unObserve = multiObserve(
    (a, b) => {
      toBeUpdated = [a, b]
    },
    [facetA, facetB],
  )

  facetA.set(3)

  expect(toBeUpdated).toEqual([3, 2])

  facetB.set(4)

  expect(toBeUpdated).toEqual([3, 4])

  unObserve()

  facetA.set(6)

  expect(toBeUpdated).toEqual([3, 4])

  facetB.set(5)

  expect(toBeUpdated).toEqual([3, 4])
})
