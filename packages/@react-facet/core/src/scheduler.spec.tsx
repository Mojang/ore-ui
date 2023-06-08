import React from 'react'
import { createFacet } from './facet'
import { useFacetEffect, useFacetMap } from './hooks'
import { mapFacetsLightweight } from './mapFacets'
import { batch, scheduleTask } from './scheduler'
import { act, render } from '@react-facet/dom-fiber-testing-library'

/**
 * Integration test to demonstrate the main motivation for batching and scheduling
 */
it('batches maps and effects', () => {
  type TestData = { name: string; login: string }
  const friendsCountFacet = createFacet<number>({ initialValue: 42 })
  const userFacet = createFacet<TestData>({ initialValue: { name: 'Initial Name', login: 'Initial Login' } })

  const cleanup = jest.fn()
  const effect = jest.fn().mockReturnValue(cleanup)

  // The useFacetMaps in the component below are within a single component,
  // but more realistically you can think that they would be distributed across a React tree.
  const ComponentWithFacetEffect = () => {
    // Its not unusual to want to combine data from multiple Facet sources
    const userWithFriends = useFacetMap(
      (user, friendsCount) => ({ ...user, friendsCount }),
      [],
      [userFacet, friendsCountFacet],
    )

    // Another very common scenario with Facets is that we can map them into more specific values
    const nameFacet = useFacetMap(({ name }) => name, [], [userWithFriends])
    const loginFacet = useFacetMap(({ login }) => login, [], [userWithFriends])

    // But then we might decide again on combining both on a single effect
    useFacetEffect(effect, [], [nameFacet, loginFacet])

    return null
  }

  const scenario = <ComponentWithFacetEffect />
  render(scenario)
  effect.mockClear()
  cleanup.mockClear()

  act(() => {
    // On updating the facet, we should expect that the effect is called only once
    // Without batching, it would have been called twice
    batch(() => {
      userFacet.set({ name: 'New Name', login: 'New Login' })
    })
  })

  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(effect).toHaveBeenCalledWith('New Name', 'New Login')
  expect(effect).toHaveBeenCalledTimes(1)
})

describe('order of execution', () => {
  it('runs tasks within a batch in the correct order', () => {
    const order: string[] = []

    const taskB = jest.fn().mockImplementation(() => order.push('B'))
    const taskA = jest.fn().mockImplementation(() => order.push('A'))
    const taskC = jest.fn().mockImplementation(() => order.push('C'))

    batch(() => {
      scheduleTask(taskA)
      scheduleTask(taskB)
      batch(() => {
        scheduleTask(taskC)
      })
    })

    expect(order).toEqual(['A', 'B', 'C'])
  })

  it('runs tasks of nested batches in the correct order', () => {
    const order: string[] = []

    const taskC = jest.fn().mockImplementation(() => {
      order.push('C')
    })
    const taskB = jest.fn().mockImplementation(() => {
      order.push('B')
      batch(() => {
        scheduleTask(taskC)
      })
    })
    const taskA = jest.fn().mockImplementation(() => {
      order.push('A')
      batch(() => {
        scheduleTask(taskB)
      })
    })

    batch(() => {
      scheduleTask(taskA)
    })

    expect(order).toEqual(['A', 'B', 'C'])
  })
})

describe('mapping an array of facets', () => {
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

  it('batches side-effects of other batches', () => {
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
})

describe('effects with multiple facet dependencies', () => {
  it('batches dependencies of an effect', () => {
    const facetA = createFacet<string>({ initialValue: 'facetA' })
    const facetB = createFacet<string>({ initialValue: 'facetB' })

    const cleanup = jest.fn()
    const effect = jest.fn().mockReturnValue(cleanup)

    const ComponentWithFacetEffect = () => {
      useFacetEffect(effect, [], [facetA, facetB])

      return null
    }

    const scenario = <ComponentWithFacetEffect />

    const { rerender } = render(scenario)

    expect(cleanup).not.toHaveBeenCalled()
    expect(effect).toHaveBeenCalledWith('facetA', 'facetB')
    expect(effect).toHaveBeenCalledTimes(1)
    effect.mockClear()
    cleanup.mockClear()

    // set a value for the second facet
    act(() => {
      batch(() => {
        facetA.set('facetA-updated')
        facetB.set('facetB-updated')
      })
    })

    // Runs the previous cleanup, then runs the effect only once
    expect(cleanup).toHaveBeenCalled()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(effect).toHaveBeenCalledWith('facetA-updated', 'facetB-updated')
    expect(effect).toHaveBeenCalledTimes(1)
    effect.mockClear()
    cleanup.mockClear()

    // and finally we unmount the component
    rerender(<></>)

    // then we get a final cleanup, without the effect being fired
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(effect).not.toHaveBeenCalled()
  })
})
