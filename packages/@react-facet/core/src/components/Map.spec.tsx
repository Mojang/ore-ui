import React, { useEffect } from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { Facet, NoValue } from '../types'
import { useFacetEffect, useFacetMap } from '../hooks'
import { Map } from '.'

it('renders all items in a Facet of array', () => {
  type Input = { a: string }
  const data = createFacet({
    initialValue: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }],
  })

  const ExampleContent = ({ item, index }: { item: Facet<Input>; index: number }) => {
    return (
      <span>
        <fast-text text={useFacetMap(({ a }) => a, [], [item])} />
        <span>{index}</span>
      </span>
    )
  }

  const keySelector = ({ a }: Input) => a

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
      <Map array={data} equalityCheck={inputEqualityCheck} keySelector={keySelector}>
        {(item, index) => <ExampleContent item={item} index={index} />}
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

  const Item = ({ item, index }: { item: Facet<Item>; index: number }) => (
    <span>
      <fast-text text={useFacetMap(({ value }) => value, [], [item])} />
      <span>{index}</span>
    </span>
  )

  const keySelector = ({ value }: Item) => value

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
      <Map array={data} equalityCheck={itemEqualityCheck} keySelector={keySelector}>
        {(item, index) => <Item item={item} index={index} />}
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

  const keySelector = ({ a }: Input) => a

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
      <Map array={data} equalityCheck={inputEqualityCheck} keySelector={keySelector}>
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

it('mounts children only when a new item is added', () => {
  type Input = { a: string }
  const data = createFacet({
    initialValue: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }],
  })

  const facetUpdateMock = jest.fn()

  const ExampleContent = ({
    item,
    index,
  }: {
    index: number
    item: Facet<Input>
    onMount: (input: Input | NoValue) => void
  }) => {
    useFacetEffect((itemValue) => console.log(itemValue, index) || facetUpdateMock(itemValue, index), [index], [item])
    return null
  }

  const keySelector = ({ a }: Input) => a

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
      <Map array={data} equalityCheck={inputEqualityCheck} keySelector={keySelector}>
        {(item, index) => <ExampleContent item={item} index={index} onMount={facetUpdateMock} />}
      </Map>
    )
  }

  const scenario = <Example />

  console.log('Render 1')
  render(scenario)

  expect(facetUpdateMock).toHaveBeenCalledTimes(5)

  facetUpdateMock.mockClear()

  console.log('Render 2')
  act(() => {
    data.set([{ a: '0' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }])
  })

  expect(facetUpdateMock).toHaveBeenCalledTimes(1)
  expect(facetUpdateMock).toHaveBeenCalledWith({ a: '0' }, 0)

  facetUpdateMock.mockClear()

  console.log('Render 3')
  act(() => {
    data.set([{ a: '0' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }, { a: '6' }])
  })

  expect(facetUpdateMock).toHaveBeenCalledTimes(1)
  expect(facetUpdateMock).toHaveBeenCalledWith({ a: '6' }, 5)

  facetUpdateMock.mockClear()

  // act(() => {
  //   data.set([{ a: '0' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }, { a: '6' }])
  // })

  // expect(facetUpdateMock).toHaveBeenCalledTimes(1)
  // expect(facetUpdateMock).toHaveBeenCalledWith({ a: '0' }, 0)

  // facetUpdateMock.mockClear()
})
