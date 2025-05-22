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

  const ExampleContent = ({ item, index }: { item: Facet<Input>; index: number }) => {
    return (
      <span>
        <fast-text text={useFacetMap(({ a }) => a, [], [item])} />
        <span>{index}</span>
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
        {(item, index) => <Item item={item} index={index} />}
      </Map>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(container).toMatchSnapshot()

  act(() => {
    data.set([{ value: '1' }, { value: '2' }])
  })

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

  // This would ideally only be called 5 times.
  // There is a future fix planned: https://github.com/Mojang/ore-ui/commit/66bc36336322970c16f663eea0259dd53970621b
  expect(mock).toHaveBeenCalledTimes(5)

  mock.mockClear()

  act(() => {
    data.set([{ a: '6' }, { a: '2' }, { a: '3' }, { a: '4' }, { a: '5' }])
  })

  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith({ a: '6' })
})

it('provides the length of the array', () => {
  const data = createFacet({
    initialValue: [{ a: '1' }, { a: '2' }, { a: '3' }],
  })

  const ExampleContent = ({ index, length }: { index: number; length: number }) => {
    return <>{length === index + 1 && <div data-testid={'length'}>{length}</div>}</>
  }

  const Example = () => {
    return <Map array={data}>{(_, index, length) => <ExampleContent index={index} length={length} />}</Map>
  }

  const { getByTestId } = render(<Example />)

  expect(getByTestId('length')).toHaveTextContent('3')
})
