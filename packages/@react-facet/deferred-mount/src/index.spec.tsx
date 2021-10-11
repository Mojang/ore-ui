import React from 'react'
import { DeferredMountProvider, DeferredMount, useIsDeferring } from '.'
import { render, act } from '@react-facet/dom-fiber-testing-library'
import { useFacetEffect, useFacetMap } from '@react-facet/core'

let idSeed = 1

interface Cb {
  (time: number): void
  frameId: number
}

describe('DeferredMount', () => {
  it('renders immediately if we dont have a provider', () => {
    const { container } = render(
      <DeferredMount>
        <div>Should be rendered</div>
      </DeferredMount>,
    )
    expect(container.firstChild).toContainHTML('<div>Should be rendered</div>')
  })
})

describe('cost is about half of the budget (should mount two per frame)', () => {
  const COST = 5
  const BUDGET = 11

  let frames: Cb[] = []
  let requestSpy: jest.SpyInstance
  let cancelSpy: jest.SpyInstance
  let nowSpy: jest.SpyInstance
  let now: number

  beforeAll(() => {
    now = 0
    frames = []

    requestSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((frameRequest) => {
      const cb = frameRequest as Cb
      cb.frameId = idSeed++
      frames.push(cb)
      return cb.frameId
    })

    cancelSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
      frames = frames.filter((frame) => frame.frameId !== frameId)
    })

    // every time we ask about the time (to measure performance in the implementation) we advance the time by the COST
    nowSpy = jest.spyOn(performance, 'now').mockImplementation(() => {
      now = now + COST
      return now
    })
  })

  afterAll(() => {
    now = 0
    requestSpy.mockRestore()
    cancelSpy.mockRestore()
    nowSpy.mockRestore()
  })

  const isDeferringValues = jest.fn()

  const SampleComponent = () => {
    const isDeferringFacet = useIsDeferring()
    useFacetEffect((isDeferring) => isDeferringValues(isDeferring), [], isDeferringFacet)

    return (
      <>
        <fast-text text={useFacetMap((isDeferring) => (isDeferring ? 'deferring' : 'done'), [], [isDeferringFacet])} />
        <DeferredMount>
          <div>First</div>
        </DeferredMount>
        <DeferredMount>
          <div>Second</div>
        </DeferredMount>
        <DeferredMount>
          <div>Third</div>
        </DeferredMount>
        <DeferredMount>
          <div>Fourth</div>
        </DeferredMount>
        <DeferredMount>
          <div>Fifth</div>
        </DeferredMount>
      </>
    )
  }

  let container: HTMLElement

  beforeEach(() => {
    isDeferringValues.mockClear()

    container = render(
      <DeferredMountProvider frameTimeBudget={BUDGET}>
        <SampleComponent />
      </DeferredMountProvider>,
    ).container
  })

  it('renders nothing immediately', () => {
    expect(container).not.toContainHTML('First')
    expect(container).not.toContainHTML('Second')
    expect(container).not.toContainHTML('Third')
    expect(container).not.toContainHTML('Fourth')
    expect(container).not.toContainHTML('Fifth')
  })

  it('states that is deferring in the first frame', () => {
    expect(isDeferringValues).toBeCalledTimes(1)
    expect(isDeferringValues).toBeCalledWith(true)
    expect(container).toContainHTML('deferring')
  })

  describe('first frame passed', () => {
    beforeEach(() => {
      const frame = frames.pop()
      if (!frame) throw new Error('requestAnimationFrame not requested')

      act(() => {
        frame(now)
      })
    })

    it('states that is deferring', () => {
      expect(container).toContainHTML('deferring')
    })

    it('renders the first two deferred render', () => {
      expect(container).toContainHTML('First')
      expect(container).toContainHTML('Second')
      expect(container).not.toContainHTML('Third')
      expect(container).not.toContainHTML('Fourth')
      expect(container).not.toContainHTML('Fifth')
    })

    describe('second frame passed', () => {
      beforeEach(() => {
        const frame = frames.pop()
        if (!frame) throw new Error('requestAnimationFrame not requested')

        act(() => {
          frame(now)
        })
      })

      it('states that is deferring', () => {
        expect(container).toContainHTML('deferring')
      })

      it('renders the third and fourth deferred render', () => {
        expect(container).toContainHTML('First')
        expect(container).toContainHTML('Second')
        expect(container).toContainHTML('Third')
        expect(container).toContainHTML('Fourth')
        expect(container).not.toContainHTML('Fifth')
      })

      describe('thrid frame passed', () => {
        beforeEach(() => {
          const frame = frames.pop()
          if (!frame) throw new Error('requestAnimationFrame not requested')

          act(() => {
            frame(now)
          })
        })

        it('does not request a new animation frame', () => {
          expect(frames.length).toBe(0)
        })

        it('states that is done', () => {
          expect(container).toContainHTML('done')
        })

        it('renders the remaining of deferred render', () => {
          expect(container).toContainHTML('First')
          expect(container).toContainHTML('Second')
          expect(container).toContainHTML('Third')
          expect(container).toContainHTML('Fourth')
          expect(container).toContainHTML('Fifth')
        })
      })
    })
  })
})

describe('app with just the DeferredMountProvider', () => {
  const isDeferringValues = jest.fn()

  const SampleComponent = () => {
    const isDeferringFacet = useIsDeferring()

    useFacetEffect((isDeferring) => isDeferringValues(isDeferring), [], isDeferringFacet)

    return (
      <>
        <fast-text text={useFacetMap((isDeferring) => (isDeferring ? 'deferring' : 'done'), [], [isDeferringFacet])} />
      </>
    )
  }

  let container: HTMLElement

  beforeEach(() => {
    isDeferringValues.mockClear()

    container = render(
      <DeferredMountProvider frameTimeBudget={0}>
        <SampleComponent />
      </DeferredMountProvider>,
    ).container
  })

  it('states that is deferring in the first frame', () => {
    expect(isDeferringValues).toBeCalledTimes(1)
    expect(isDeferringValues).toBeCalledWith(true)
    expect(container).toContainHTML('deferring')
  })
})
