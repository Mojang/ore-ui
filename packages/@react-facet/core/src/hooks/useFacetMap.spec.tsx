import React, { useEffect, useRef } from 'react'
import { act, render } from '@react-facet/dom-fiber-testing-library'
import { useFacetMap } from './useFacetMap'
import { NO_VALUE, Facet } from '../types'
import { useFacetEffect } from './useFacetEffect'
import { createFacet } from '../facet'
import { useFacetState } from './useFacetState'

it('triggers the map once for each multiple consumers', () => {
  const mapFn = jest.fn().mockReturnValue('map-value')

  const TestComponent = () => {
    const [valueFacet] = useFacetState('test-value')
    const mappedValueFacet = useFacetMap(mapFn, [], [valueFacet])

    return (
      <div>
        <fast-text text={mappedValueFacet} />
        <fast-text text={mappedValueFacet} />
      </div>
    )
  }

  render(<TestComponent />)

  expect(mapFn).toHaveBeenCalledTimes(2)
})

describe('multiple dependencies', () => {
  it('maps values from multiple facets', () => {
    const facetA = createFacet({ initialValue: 'A' })
    const facetB = createFacet({ initialValue: 'B' })

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap((a, b) => `${a}-${b}`, [], [facetA, facetB])
      return (
        <span>
          <fast-text text={adaptValue} />
        </span>
      )
    }

    const dom = render(<ComponentWithFacetEffect />)
    expect(dom.container.textContent).toBe('A-B')

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set('Y')
    })

    expect(dom.container.textContent).toBe('Y-B')
  })

  it('supports optional default value', () => {
    const facetA = createFacet<string>({ initialValue: NO_VALUE })
    const facetB = createFacet<string>({ initialValue: NO_VALUE })

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap((a, b) => `${a}-${b}`, [], [facetA, facetB])
      return (
        <span>
          <fast-text text={adaptValue} />
        </span>
      )
    }

    const dom = render(<ComponentWithFacetEffect />)
    expect(dom.container.textContent).toBe('')

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set('Y')
    })

    expect(dom.container.textContent).toBe('')

    act(() => {
      facetB.set('X')
    })

    expect(dom.container.textContent).toBe('Y-X')
  })

  it('accepts an equality check and does not fire again if equal', () => {
    const facetA = createFacet({ initialValue: ['A'] })
    const facetB = createFacet({ initialValue: 'B' })
    const nameEqualityCheck = () => {
      let previousName: string

      return (current: { name: string }) => {
        if (current.name !== previousName) {
          previousName = current.name
          return false
        }

        return true
      }
    }

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a], b) => ({ name: `${a}-${b}` }), [], [facetA, facetB], nameEqualityCheck)

      useFacetEffect(
        (value) => {
          mock(value.name)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith('A-B')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set(['Y'])
    })

    expect(mock).toHaveBeenCalledWith('Y-B')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set(['Y'])
    })

    expect(mock).not.toHaveBeenCalled()
  })

  it('does not fire change notifications for string primitive', () => {
    const facetA = createFacet({ initialValue: ['A'] })
    const facetB = createFacet({ initialValue: 'B' })

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a], b) => `${a}-${b}`, [], [facetA, facetB])

      useFacetEffect(
        (value) => {
          mock(value)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith('A-B')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set(['Y'])
    })

    expect(mock).toHaveBeenCalledWith('Y-B')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set(['Y'])
    })

    expect(mock).not.toHaveBeenCalled()
  })

  it('does not fire change notifications for number primitive', () => {
    const facetA = createFacet({ initialValue: [1] })
    const facetB = createFacet({ initialValue: 2 })

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a], b) => a + b, [], [facetA, facetB])

      useFacetEffect(
        (value) => {
          mock(value)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith(3)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([20])
    })

    expect(mock).toHaveBeenCalledWith(22)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([20])
    })

    expect(mock).not.toHaveBeenCalled()
  })

  it('does not fire change notifications for boolean primitive', () => {
    const facetA = createFacet({ initialValue: [false] })
    const facetB = createFacet({ initialValue: true })

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a], b) => a && b, [], [facetA, facetB])

      useFacetEffect(
        (value) => {
          mock(value)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith(false)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([true])
    })

    expect(mock).toHaveBeenCalledWith(true)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([true])
    })

    expect(mock).not.toHaveBeenCalled()
  })
})

describe('single dependency', () => {
  it('triggers when there is a change in the facet', () => {
    const demoFacet = createFacet({ initialValue: 'initial value' })

    const callback = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap((value) => value + value, [], [demoFacet])

      useEffect(() => {
        adaptValue.observe((value) => {
          callback(value)
        })
      }, [adaptValue])

      return null
    }

    const scenario = <ComponentWithFacetEffect />

    render(scenario)

    expect(callback).toHaveBeenCalledWith('initial valueinitial value')
  })

  it('properly memoizes the returned facet', () => {
    const demoFacet = createFacet({ initialValue: 'initial value' })

    const TestComponent = () => {
      const previousMappedFacetRef = useRef<Facet<string>>()
      const mappedFacet = useFacetMap((value) => value, [], [demoFacet])

      // Check if it is a second render
      if (previousMappedFacetRef.current) {
        // check if previous and current mappedFacet are the same instance
        if (previousMappedFacetRef.current !== mappedFacet) {
          throw new Error('Facet instance has change')
        }
      }

      previousMappedFacetRef.current = mappedFacet

      return null
    }

    const { rerender } = render(<TestComponent />)

    // Render a second time to check (inside the component)
    // if the instance is the same
    rerender(<TestComponent />)
  })

  it('properly memoizes the returned facet for multiple dependencies', () => {
    const demoFacet = createFacet({ initialValue: 'initial value' })
    const secondFacet = createFacet({ initialValue: 'initial value' })

    const TestComponent = () => {
      const previousMappedFacetRef = useRef<Facet<string>>()
      const mappedFacet = useFacetMap((value) => value, [], [demoFacet, secondFacet])

      // Check if it is a second render
      if (previousMappedFacetRef.current) {
        // check if previous and current mappedFacet are the same instance
        if (previousMappedFacetRef.current !== mappedFacet) {
          throw new Error('Facet instance has change')
        }
      }

      previousMappedFacetRef.current = mappedFacet

      return null
    }

    const { rerender } = render(<TestComponent />)

    // Render a second time to check (inside the component)
    // if the instance is the same
    rerender(<TestComponent />)
  })

  it('supports optional default value for single dependency', () => {
    const facetA = createFacet<string>({ initialValue: NO_VALUE })

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap((a) => a, [], [facetA])
      return (
        <span>
          <fast-text text={adaptValue} />
        </span>
      )
    }

    const dom = render(<ComponentWithFacetEffect />)
    expect(dom.container.textContent).toBe('')

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set('Y')
    })

    expect(dom.container.textContent).toBe('Y')
  })

  it('accepts an equality check and does not fire again if equal', () => {
    const facetA = createFacet({ initialValue: [{ name: 'A' }] })
    const nameEqualityCheck = () => {
      let previousName: string

      return (current: { name: string }) => {
        if (current.name !== previousName) {
          previousName = current.name
          return false
        }

        return true
      }
    }

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a]) => a, [], [facetA], nameEqualityCheck)

      useFacetEffect(
        (value) => {
          mock(value.name)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith('A')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: 'Y' }])
    })

    expect(mock).toHaveBeenCalledWith('Y')

    mock.mockClear()

    // We verify that if a facet updates with the same value, it should not re-render
    act(() => {
      facetA.set([{ name: 'Y' }])
    })

    expect(mock).not.toHaveBeenCalled()
  })

  it('does not fire change notifications for string primitive', () => {
    const facetA = createFacet({ initialValue: [{ name: 'A' }] })

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a]) => a.name, [], [facetA])

      useFacetEffect(
        (value) => {
          mock(value)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith('A')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: 'Y' }])
    })

    expect(mock).toHaveBeenCalledWith('Y')

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: 'Y' }])
    })

    expect(mock).not.toHaveBeenCalled()
  })

  it('does not fire change notifications for number primitive', () => {
    const facetA = createFacet({ initialValue: [{ name: 1 }] })

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a]) => a.name, [], [facetA])

      useFacetEffect(
        (value) => {
          mock(value)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith(1)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: 2 }])
    })

    expect(mock).toHaveBeenCalledWith(2)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: 2 }])
    })

    expect(mock).not.toHaveBeenCalled()
  })

  it('does not fire change notifications for boolean primitive', () => {
    const facetA = createFacet({ initialValue: [{ name: true }] })

    const mock = jest.fn()

    const ComponentWithFacetEffect = () => {
      const adaptValue = useFacetMap(([a]) => a.name, [], [facetA])

      useFacetEffect(
        (value) => {
          mock(value)
        },
        [],
        [adaptValue],
      )

      return null
    }

    render(<ComponentWithFacetEffect />)
    expect(mock).toHaveBeenCalledWith(true)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: false }])
    })

    expect(mock).toHaveBeenCalledWith(false)

    mock.mockClear()

    // We verify that if a facet updates, it re-renders
    act(() => {
      facetA.set([{ name: false }])
    })

    expect(mock).not.toHaveBeenCalled()
  })
})
