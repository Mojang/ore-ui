import React from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { Facet } from '../types'
import { useFacetEffect, useFacetMap } from '../hooks'
import { Map } from '.'

it('renders all items in a Facet of array', () => {
  type Input = { a: string }
  const data = createFacet({
    initialValue: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }],
  })

  const ExampleContent = ({ item }: { item: Facet<Input> }) => {
    return (
      <span>
        <fast-text text={useFacetMap(({ a }) => a, [], [item])} />
      </span>
    )
  }

  const inputEqualityCheck = () => {
    const previous: Partial<Input> = {}

    return (current: Input) => {
      if (current.a === previous.a) {
        return true
      }
      previous.a = current.a
      return false
    }
  }
  const Example = () => {
    return (
      <Map array={data} equalityCheck={inputEqualityCheck}>
        {(item) => <ExampleContent item={item} />}
      </Map>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(container).toMatchSnapshot()
})

it('unmounts components when the array reduces in size', () => {
  interface Item {
    value: string
  }

  const data = createFacet<Item[]>({
    initialValue: [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }],
  })

  const Item = ({ item }: { item: Facet<Item> }) => (
    <span>
      <fast-text text={useFacetMap(({ value }) => value, [], [item])} />
    </span>
  )

  const itemEqualityCheck = () => {
    const previous: Partial<Item> = {}

    return (current: Item) => {
      if (current.value === previous.value) {
        return true
      }

      previous.value = current.value

      return false
    }
  }

  const Example = () => {
    return (
      <Map array={data} equalityCheck={itemEqualityCheck}>
        {(item) => <Item item={item} />}
      </Map>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(container).toMatchSnapshot()

  data.set([{ value: '1' }, { value: '2' }])

  expect(container).toMatchSnapshot()
})

it('updates only items that have changed', () => {
  type Input = { a: string }
  const data = createFacet({
    initialValue: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }],
  })

  const mock = jest.fn()

  const ExampleContent = ({ item }: { item: Facet<Input> }) => {
    useFacetEffect(mock, [], [item])
    return null
  }

  const inputEqualityCheck = () => {
    const previous: Partial<Input> = {}

    return (current: Input) => {
      if (current.a === previous.a) {
        return true
      }

      previous.a = current.a

      return false
    }
  }

  const Example = () => {
    return (
      <Map array={data} equalityCheck={inputEqualityCheck}>
        {(item) => <ExampleContent item={item} />}
      </Map>
    )
  }

  const scenario = <Example />

  render(scenario)

  expect(mock).toHaveBeenCalledTimes(5)

  mock.mockClear()

  act(() => {
    data.set([{ a: '6' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }])
  })

  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith({ a: '6' })
})
