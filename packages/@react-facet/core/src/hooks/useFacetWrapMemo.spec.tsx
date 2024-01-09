import React from 'react'
import { render } from '@react-facet/dom-fiber-testing-library'
import { useFacetWrapMemo } from './useFacetWrapMemo'
import { useFacetEffect } from './useFacetEffect'
import { useFacetMap } from './useFacetMap'
import { createFacet } from '../facet'
import { FacetProp, NO_VALUE, Value } from '../types'

it('wraps a value, updating the facet when it changes', () => {
  const mock = jest.fn()

  const ComponentWithFacetEffect: React.FC<{ value: string }> = ({ value }) => {
    const facetifiedValue = useFacetWrapMemo(value)
    useFacetEffect(
      (value) => {
        mock(value)
      },
      [],
      [facetifiedValue],
    )
    return <span />
  }

  const dom = render(<ComponentWithFacetEffect value="value" />)
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith('value')
  mock.mockClear()
  dom.rerender(<ComponentWithFacetEffect value="changed" />)
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith('changed')
})

it('wraps a value, with the default equality check (preventing unnecessary updates)', () => {
  const mock = jest.fn()

  const ComponentWithFacetEffect: React.FC<{ value: string }> = ({ value }) => {
    const facetifiedValue = useFacetWrapMemo(value)
    useFacetEffect(
      (value) => {
        mock(value)
      },
      [],
      [facetifiedValue],
    )
    return <span />
  }

  const dom = render(<ComponentWithFacetEffect value="value" />)
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith('value')
  mock.mockClear()
  dom.rerender(<ComponentWithFacetEffect value="value" />)
  expect(mock).toHaveBeenCalledTimes(0)
})

it('forwards a facet', () => {
  const demoFacet = createFacet({ initialValue: 'value' })
  const mock = jest.fn()

  const ComponentWithFacetEffect: React.FC = () => {
    const facetifiedValue = useFacetWrapMemo(demoFacet)
    useFacetEffect(
      (value) => {
        mock(value)
      },
      [],
      [facetifiedValue],
    )
    return <span />
  }

  render(<ComponentWithFacetEffect />)
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith('value')
  mock.mockClear()
  demoFacet.set('changed')
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith('changed')
})

it('forwards a facet with NO_VAUE', () => {
  const demoFacet = createFacet<string>({ initialValue: NO_VALUE })
  const mock = jest.fn()

  const ComponentWithFacetEffect: React.FC = () => {
    const facetifiedValue = useFacetWrapMemo(demoFacet)
    useFacetEffect(
      (value) => {
        mock(value)
      },
      [],
      [facetifiedValue],
    )
    return <span />
  }

  // On first render, it should not call the effect, as the wrapped facet has no value
  render(<ComponentWithFacetEffect />)
  expect(mock).not.toHaveBeenCalled()

  mock.mockClear()
  demoFacet.set('changed')
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith('changed')
})

it('updates correctly if the facet instance change (ex: via a useFacetMap)', () => {
  const demoFacet = createFacet({ initialValue: 'value' })

  const TestingComponent: React.FC<{ concat: string }> = ({ concat }) => {
    // When a dependency of useFacetMap change (concat) a new facet is created
    // And when we pass that to the useFacetWrapMemo we need to make sure that it gets propagated
    return (
      <span>
        <fast-text text={useFacetWrapMemo(useFacetMap((value) => `${value} ${concat}`, [concat], [demoFacet]))} />
      </span>
    )
  }

  const { container, rerender } = render(<TestingComponent concat="123" />)
  expect(container).toHaveTextContent('value 123')

  rerender(<TestingComponent concat="456" />)
  expect(container).toHaveTextContent('value 456')
})

describe('regressions', () => {
  it('should not immediately call a function when wrapped', () => {
    const mock = jest.fn()

    const TestingComponent = () => {
      const handlerFacet = useFacetWrapMemo(mock)
      useFacetEffect(() => undefined, [], [handlerFacet])
      return null
    }

    render(<TestingComponent />)

    expect(mock).toHaveBeenCalledTimes(0)
  })
})

const testEffectUpdatesOnStaticValue = (value: FacetProp<Value>, expectUpdates: boolean) => {
  const mock = jest.fn()

  const TestingComponent = () => {
    const undefinedFacet = useFacetWrapMemo(value)
    useFacetEffect(
      () => {
        mock()
      },
      [],
      [undefinedFacet],
    )
    return null
  }
  const { rerender } = render(<TestingComponent />)
  expect(mock).toHaveBeenCalledTimes(1)

  rerender(<TestingComponent />)
  if (expectUpdates) {
    expect(mock).toHaveBeenCalledTimes(2)
  } else {
    expect(mock).toHaveBeenCalledTimes(1)
  }
  rerender(<TestingComponent />)
  if (expectUpdates) {
    expect(mock).toHaveBeenCalledTimes(3)
  } else {
    expect(mock).toHaveBeenCalledTimes(1)
  }
}

describe('does not trigger effect updates on re-renders for the same value', () => {
  it('string', () => {
    testEffectUpdatesOnStaticValue('', false)
    testEffectUpdatesOnStaticValue('test', false)
  })
  it('boolean', () => {
    testEffectUpdatesOnStaticValue(false, false)
    testEffectUpdatesOnStaticValue(true, false)
  })
  it('number', () => {
    testEffectUpdatesOnStaticValue(0, false)
    testEffectUpdatesOnStaticValue(1, false)
  })
  it('undefined', () => {
    testEffectUpdatesOnStaticValue(undefined, false)
  })
  it('null', () => {
    testEffectUpdatesOnStaticValue(null, false)
  })
  it('empty array', () => {
    testEffectUpdatesOnStaticValue([], false)
  })
  it('filled array', () => {
    testEffectUpdatesOnStaticValue(['string', 1], false)
  })
  it('empty object', () => {
    testEffectUpdatesOnStaticValue({}, false)
  })
  it('filled object', () => {
    testEffectUpdatesOnStaticValue({ key: 'value' }, false)
  })
})
