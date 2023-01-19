import React, { useEffect } from 'react'
import {
  DeferredMountProvider,
  DeferredMount,
  useIsDeferring,
  DeferredMountWithCallback,
  useNotifyMountComplete,
} from '.'
import { render, act } from '@react-facet/dom-fiber-testing-library'
import { useFacetEffect, useFacetMap } from '@react-facet/core'

let idSeed = 1

interface Cb {
  (time: number): void
  frameId: number
}

jest.useFakeTimers()

const frames: (() => void)[] = []
const requestSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((frameRequest) => {
  const id = idSeed++
  const cb = () => {
    frameRequest(id)
  }
  frames.push(cb)
  return id
})

const runRaf = () => {
  const cb = frames.pop()
  if (cb != null) act(() => cb())
}

afterEach(() => {
  requestSpy.mockClear()
})

describe('DeferredMount', () => {
  it('renders immediately if we dont have a provider', () => {
    const { container } = render(
      <DeferredMount>
        <div>Should be rendered</div>
      </DeferredMount>,
    )
    expect(container.firstChild).toContainHTML('<div>Should be rendered</div>')
  })

  it('defers again after initial defer has completed', () => {
    const DeferConditionally: React.FC<{ mountDeferred: boolean }> = ({ mountDeferred }) => {
      const isDeferringFacet = useIsDeferring()
      return (
        <>
          <fast-text
            text={useFacetMap((isDeferring) => (isDeferring ? 'deferring' : 'done'), [], [isDeferringFacet])}
          />
          {mountDeferred && (
            <DeferredMount>
              <p>Conditionally rendered</p>
            </DeferredMount>
          )}
        </>
      )
    }

    const { container, rerender } = render(
      <DeferredMountProvider>
        <DeferConditionally mountDeferred={false} />
      </DeferredMountProvider>,
    )

    expect(container).toContainHTML('deferring')
    expect(container).not.toContainHTML('<p>Conditionally rendered</p>')

    runRaf()
    expect(container).toContainHTML('done')
    expect(container).not.toContainHTML('<p>Conditionally rendered</p>')

    rerender(
      <DeferredMountProvider>
        <DeferConditionally mountDeferred />
      </DeferredMountProvider>,
    )

    expect(container).toContainHTML('deferring')
    expect(container).not.toContainHTML('<p>Conditionally rendered</p>')

    runRaf()
    expect(container).toContainHTML('done')
    expect(container).toContainHTML('<p>Conditionally rendered</p>')
  })
})

describe('DeferredMountWithCallback', () => {
  const MOUNT_COMPLETION_DELAY = 1000

  const MockDeferredComponent = ({ index }: { index: number }) => {
    const triggerMountComplete = useNotifyMountComplete()

    useEffect(() => {
      const id = setTimeout(triggerMountComplete, MOUNT_COMPLETION_DELAY)

      return () => {
        clearTimeout(id)
      }
    }, [triggerMountComplete, index])

    return <div>Callback{index}</div>
  }

  it('renders immediately if we dont have a provider', () => {
    const { container } = render(
      <DeferredMountWithCallback>
        <div>Should be rendered</div>
      </DeferredMountWithCallback>,
    )
    expect(container.firstChild).toContainHTML('<div>Should be rendered</div>')
  })

  const SampleComponent = () => {
    const isDeferringFacet = useIsDeferring()

    return (
      <>
        <fast-text text={useFacetMap((isDeferring) => (isDeferring ? 'deferring' : 'done'), [], [isDeferringFacet])} />
        <DeferredMountWithCallback>
          <MockDeferredComponent index={0} />
        </DeferredMountWithCallback>
        <DeferredMountWithCallback>
          <MockDeferredComponent index={1} />
        </DeferredMountWithCallback>
        <DeferredMountWithCallback>
          <MockDeferredComponent index={2} />
        </DeferredMountWithCallback>
      </>
    )
  }

  it('waits until previous deferred callback finishes', async () => {
    const { container } = render(
      <DeferredMountProvider>
        <SampleComponent />
      </DeferredMountProvider>,
    )

    // Wait a frame for deferred component to render
    expect(container).toContainHTML('deferring')
    expect(container).not.toContainHTML('Callback0')
    expect(container).not.toContainHTML('Callback1')
    expect(container).not.toContainHTML('Callback2')

    // Initial run, sets renders the first component
    runRaf()
    expect(container).toContainHTML('Callback0')
    expect(container).not.toContainHTML('Callback1')
    expect(container).not.toContainHTML('Callback2')

    // Wait for component to finish rendering, then advance to the next component render
    jest.advanceTimersByTime(MOUNT_COMPLETION_DELAY)
    runRaf()
    expect(container).toContainHTML('Callback0')
    expect(container).toContainHTML('Callback1')
    expect(container).not.toContainHTML('Callback2')

    // Wait for component to finish rendering, then advance to the next component render
    jest.advanceTimersByTime(MOUNT_COMPLETION_DELAY)
    runRaf()
    expect(container).toContainHTML('Callback0')
    expect(container).toContainHTML('Callback1')
    expect(container).toContainHTML('Callback2')

    // Wait for final deferred render and expect queue to be finished
    jest.advanceTimersByTime(MOUNT_COMPLETION_DELAY)
    runRaf()
    expect(container).toContainHTML('done')
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
    useFacetEffect((isDeferring) => isDeferringValues(isDeferring), [], [isDeferringFacet])

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

    useFacetEffect((isDeferring) => isDeferringValues(isDeferring), [], [isDeferringFacet])

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
