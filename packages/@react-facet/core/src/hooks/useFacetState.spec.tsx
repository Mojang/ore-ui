import React from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { Setter, NO_VALUE } from '../types'
import { useFacetState } from './useFacetState'
import { useFacetEffect } from './useFacetEffect'
import { createFacet } from '../facet'

it('first value is the facet, second is the setter', () => {
  let setAdaptValue: Setter<string>

  const ComponentWithFacetEffect = () => {
    const [facet, setFacet] = useFacetState('initial value')
    setAdaptValue = setFacet

    return (
      <span>
        <fast-text text={facet} />
      </span>
    )
  }

  const scenario = <ComponentWithFacetEffect />

  const { container } = render(scenario)
  expect(container.textContent).toBe('initial value')

  act(() => {
    setAdaptValue((previousValue) => (previousValue !== NO_VALUE ? `${previousValue} ${previousValue}` : ''))
  })

  expect(container.textContent).toBe('initial value initial value')
})

it('should be possible to have value undefined as the first value', () => {
  const effect = jest.fn()

  const ComponentWithFacetEffect = () => {
    const [facet] = useFacetState(undefined)

    useFacetEffect(effect, [], [facet])

    return null
  }

  render(<ComponentWithFacetEffect />)

  expect(effect).toHaveBeenCalledWith(undefined)
})

it('memoizes the setter', () => {
  let setter: Setter<string> = () => {}

  const ComponentWithFacetEffect = () => {
    const [facet, setFacet] = useFacetState('initial value')
    setter = setFacet

    return (
      <span>
        <fast-text text={facet} />
      </span>
    )
  }

  const rerender = render(<ComponentWithFacetEffect />).rerender
  const savedSetter = setter
  rerender(<ComponentWithFacetEffect />)

  expect(setter).toBe(savedSetter)
})

it('supports initialization from another facet', () => {
  const anotherFacet = createFacet({ initialValue: 'initial value' })

  const ComponentWithFacetEffect = () => {
    const [facet] = useFacetState(anotherFacet)

    return (
      <span>
        <fast-text text={facet} />
      </span>
    )
  }

  const scenario = <ComponentWithFacetEffect />

  const { container } = render(scenario)
  expect(container.textContent).toBe('initial value')

  act(() => {
    anotherFacet.set('changed')
  })

  // The other facet's value should only be used for initialization
  expect(container.textContent).toBe('initial value')
})

it('supports initialization from another facet that has a startSubscription', () => {
  const subscribed = jest.fn()

  const anotherFacet = createFacet<string>({
    startSubscription: (update) => {
      subscribed()
      update('initial value')
      return () => {}
    },
    initialValue: NO_VALUE,
  })

  const ComponentWithFacetEffect = ({ showText }: { showText?: boolean }) => {
    const [facet] = useFacetState(anotherFacet)
    return <span>{showText ? <fast-text text={facet} /> : null}</span>
  }

  // Initially, the state is not used, so the dependency should not be subscribed
  // and no text should be shown
  const { container, rerender } = render(<ComponentWithFacetEffect />)
  expect(container.textContent).toBe('')
  expect(subscribed).not.toHaveBeenCalled()

  // But, once we depend on the state that should be initialized by the depending facet
  // then the subscription is started, and the initial value is shown
  rerender(<ComponentWithFacetEffect showText />)
  expect(container.textContent).toBe('initial value')
  expect(subscribed).toHaveBeenCalled()
})
