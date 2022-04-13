import React, { useEffect } from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { createFacet } from '../facet'
import { Facet, NoValue } from '../types'
import { useFacetEffect, useFacetMap } from '../hooks'
import { Map, MapWithKey } from '.'

describe('<Map />', () => {
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
})

describe('<MapWithKey />', () => {
  it('renders all items in a Facet of array', () => {
    type Input = { key: string; data: string }
    const data = createFacet<Input[]>({
      initialValue: [
        { key: '1', data: 'a' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
      ],
    })

    const ExampleContent = ({ item, index }: { item: Facet<Input>; index: number }) => {
      return (
        <span>
          <fast-text text={useFacetMap(({ data }) => data, [], [item])} />
          <span>{index}</span>
        </span>
      )
    }

    const keySelector = ({ key }: Input) => key

    const inputEqualityCheck = () => {
      const previous: Partial<Input> = {}

      return (current: Input) => {
        if (current.key === previous.key && current.data === previous.data) {
          return true
        }

        previous.key = current.key
        previous.data = current.data

        return false
      }
    }

    const Example = () => {
      return (
        <MapWithKey array={data} equalityCheck={inputEqualityCheck} keySelector={keySelector}>
          {(item, index) => <ExampleContent item={item} index={index} />}
        </MapWithKey>
      )
    }

    const scenario = <Example />

    const { container } = render(scenario)

    expect(container).toMatchSnapshot()
  })

  it('unmounts components when the array reduces in size', () => {
    type Input = { key: string; data: string }
    const data = createFacet<Input[]>({
      initialValue: [
        { key: '1', data: 'a' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
      ],
    })

    const Item = ({ item, index }: { item: Facet<Input>; index: number }) => (
      <span>
        <fast-text text={useFacetMap(({ data }) => data, [], [item])} />
        <span>{index}</span>
      </span>
    )

    const keySelector = ({ key }: Input) => key

    const itemEqualityCheck = () => {
      const previous: Partial<Input> = {}

      return (current: Input) => {
        if (current.key === previous.key && current.data === previous.data) {
          return true
        }

        previous.key = current.key
        previous.data = current.data

        return false
      }
    }

    const Example = () => {
      return (
        <MapWithKey array={data} equalityCheck={itemEqualityCheck} keySelector={keySelector}>
          {(item, index) => <Item item={item} index={index} />}
        </MapWithKey>
      )
    }

    const scenario = <Example />

    const { container } = render(scenario)

    expect(container).toMatchSnapshot()

    data.set([
      { key: '1', data: 'a' },
      { key: '2', data: 'b' },
    ])

    expect(container).toMatchSnapshot()
  })

  it('updates only items that have changed', () => {
    type Input = { key: string; data: string }
    const data = createFacet<Input[]>({
      initialValue: [
        { key: '1', data: 'a' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
      ],
    })

    const mock = jest.fn()

    const ExampleContent = ({ item }: { item: Facet<Input> }) => {
      useFacetEffect(mock, [], [item])
      return null
    }

    const keySelector = ({ key }: Input) => key

    const inputEqualityCheck = () => {
      const previous: Partial<Input> = {}

      return (current: Input) => {
        if (current.key === previous.key && current.data === previous.data) {
          return true
        }

        previous.key = current.key
        previous.data = current.data

        return false
      }
    }

    const Example = () => {
      return (
        <MapWithKey array={data} equalityCheck={inputEqualityCheck} keySelector={keySelector}>
          {(item) => <ExampleContent item={item} />}
        </MapWithKey>
      )
    }

    const scenario = <Example />

    render(scenario)

    expect(mock).toHaveBeenCalledTimes(5)

    mock.mockClear()

    act(() => {
      data.set([
        { key: '1', data: 'z' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
      ])
    })

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith({ key: '1', data: 'z' })
  })

  it('rerenders only when key is updated or added', () => {
    type Input = { key: string; data: string }
    const data = createFacet<Input[]>({
      initialValue: [
        { key: '1', data: 'a' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
      ],
    })

    const facetUpdateMock = jest.fn()
    const onMount = jest.fn()

    const ExampleContent = ({
      item,
      index,
    }: {
      index: number
      item: Facet<Input>
      onMount: (input: Input | NoValue) => void
    }) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => onMount(index), [])
      useFacetEffect((itemValue) => facetUpdateMock(itemValue, index), [index], [item])
      const dataFacet = useFacetMap(({ data }) => `Data: ${data}`, [], [item])
      const keyFacet = useFacetMap(({ key }) => `Key: ${key}`, [], [item])

      return (
        <div>
          <p>
            <fast-text text={keyFacet} />
          </p>
          <p>
            <fast-text text={dataFacet} />
          </p>
        </div>
      )
    }

    const keySelector = ({ key }: Input) => key

    const inputEqualityCheck = () => {
      const previous: Partial<Input> = {}

      return (current: Input) => {
        if (current.key === previous.key && current.data === previous.data) {
          return true
        }

        previous.key = current.key
        previous.data = current.data

        return false
      }
    }

    const Example = () => {
      return (
        <MapWithKey array={data} equalityCheck={inputEqualityCheck} keySelector={keySelector}>
          {(item, index) => <ExampleContent item={item} index={index} onMount={facetUpdateMock} />}
        </MapWithKey>
      )
    }

    const scenario = <Example />

    const { container } = render(scenario)

    expect(facetUpdateMock).toHaveBeenCalledTimes(5)
    expect(onMount).toHaveBeenCalledTimes(5)

    expect(container).toMatchSnapshot()

    facetUpdateMock.mockClear()
    onMount.mockClear()

    act(() => {
      data.set([
        { key: '1', data: 'z' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
      ])
    })

    expect(facetUpdateMock).toHaveBeenCalledTimes(1)
    expect(facetUpdateMock).toHaveBeenCalledWith({ key: '1', data: 'z' }, 0)
    expect(onMount).not.toHaveBeenCalled()

    expect(container).toMatchSnapshot()

    facetUpdateMock.mockClear()
    onMount.mockClear()

    act(() => {
      data.set([
        { key: '1', data: 'z' },
        { key: '2', data: 'b' },
        { key: '3', data: 'c' },
        { key: '4', data: 'd' },
        { key: '5', data: 'e' },
        { key: '6', data: 'f' },
      ])
    })

    expect(facetUpdateMock).toHaveBeenCalledTimes(1)
    expect(facetUpdateMock).toHaveBeenCalledWith({ key: '6', data: 'f' }, 5)
    expect(onMount).toHaveBeenCalledWith(5)

    expect(container).toMatchSnapshot()

    facetUpdateMock.mockClear()
    onMount.mockClear()
  })
})
