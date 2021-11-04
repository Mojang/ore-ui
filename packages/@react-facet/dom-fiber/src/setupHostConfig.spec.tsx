import { createFacet, Facet } from '@react-facet/core'
import React, { ReactElement, useEffect, useState } from 'react'
import { Fiber } from 'react-reconciler'
import { createFiberRoot } from './createFiberRoot'
import { createReconciler } from './createReconciler'
import { setupHostConfig } from './setupHostConfig'
import { InputType, ElementContainer, ElementProps, Props } from './types'

document.body.innerHTML = `<div id="root"></div>`

const reconcilerInstance = createReconciler()
const root = document.getElementById('root') as HTMLElement
const fiberRoot = createFiberRoot(reconcilerInstance)(root)

/**
 * Render function local to testing that shared the same instance of the reconciler.
 *
 * This is needed otherwise React complains that we are sharing a context across different renderers.
 */
const render = function render(ui: ReactElement) {
  reconcilerInstance.updateContainer(ui, fiberRoot, null, () => {})
}

afterEach(() => {
  reconcilerInstance.updateContainer(null, fiberRoot, null, () => {})
})

jest.useFakeTimers()

describe('mount', () => {
  describe('without facet', () => {
    it('renders text', () => {
      render(<div>Hello World</div>)
      expect(root).toContainHTML('<div id="root"><div>Hello World</div></div>')
    })

    it('sets the className', () => {
      render(<div className="testing">Hello World</div>)
      expect(root).toContainHTML('<div id="root"><div class="testing">Hello World</div></div>')
    })

    it('sets the style', () => {
      render(<div style={{ background: 'red' }}>Hello World</div>)
      expect(root).toContainHTML('<div id="root"><div style="background: red;">Hello World</div></div>')
    })

    it('sets the src', () => {
      render(<img className="image" src="bananafrita.png" />)
      const img = document.getElementsByClassName('image')[0] as HTMLImageElement | undefined
      // jsdom is adding the http://localhost
      expect(img && img.src).toEqual('http://localhost/bananafrita.png')
    })

    it('sets the value', () => {
      render(<input value="foo" />)
      expect(root?.innerHTML ?? '').toBe('<input value="foo">')
    })

    it('sets the type', () => {
      render(
        <>
          <input type="text" />
          <input type="password" />
          <input type="button" />
        </>,
      )
      expect(root?.innerHTML ?? '').toBe('<input type="text"><input type="password"><input type="button">')
    })

    it('sets disabled', () => {
      render(<input disabled />)
      expect(root?.innerHTML ?? '').toBe('<input disabled="">')
    })

    it('sets maxlength', () => {
      render(<input type="text" maxLength={10} />)
      expect(root?.innerHTML ?? '').toBe('<input maxlength="10" type="text">')
    })

    it('sets the data-droppable', () => {
      render(<div data-droppable />)
      expect(root?.innerHTML ?? '').toBe('<div data-droppable=""></div>')
    })

    it('sets the href and target', () => {
      render(<a href="url" target="__blank"></a>)
      expect(root?.innerHTML ?? '').toBe('<a href="url" target="__blank"></a>')
    })

    it('sets dangerouslySetInnerHTML', () => {
      render(<div dangerouslySetInnerHTML={{ __html: '<span/>' }} />)
      expect(root?.innerHTML ?? '').toBe('<div><span></span></div>')
    })
  })

  describe('with facets', () => {
    it('renders text', () => {
      const textFacet = createFacet({ initialValue: 'Hello World' })

      render(<fast-text text={textFacet} />)
      expect(root).toContainHTML('<div id="root">Hello World</div>')

      textFacet.set('Updated World')
      expect(root).toContainHTML('<div id="root">Updated World</div>')
    })

    it('sets the className', () => {
      const classNameFacet = createFacet({ initialValue: 'testing' })

      render(<fast-div className={classNameFacet}>Hello World</fast-div>)
      expect(root).toContainHTML('<div id="root"><div class="testing">Hello World</div></div>')

      classNameFacet.set('updated testing')
      expect(root).toContainHTML('<div id="root"><div class="updated testing">Hello World</div></div>')
    })

    it('sets the style', () => {
      const backgroundFacet = createFacet({ initialValue: 'red' })

      render(<fast-div style={{ background: backgroundFacet }}>Hello World</fast-div>)
      expect(root).toContainHTML('<div id="root"><div style="background: red;">Hello World</div></div>')

      backgroundFacet.set('yellow')
      expect(root).toContainHTML('<div id="root"><div style="background: yellow;">Hello World</div></div>')
    })

    it('sets the src', () => {
      const srcFacet = createFacet({ initialValue: 'bananafrita.png' })

      render(<fast-img className="image" src={srcFacet} />)
      const img = document.getElementsByClassName('image')[0] as HTMLImageElement | undefined
      // jsdom is adding the http://localhost
      expect(img && img.src).toEqual('http://localhost/bananafrita.png')

      srcFacet.set('updated.png')
      expect(img && img.src).toEqual('http://localhost/updated.png')
    })

    it('sets the value', () => {
      const valueFacet = createFacet({ initialValue: 'foo' })

      render(<fast-input value={valueFacet} />)
      expect(root?.innerHTML ?? '').toBe('<input value="foo">')

      valueFacet.set('updated')
      expect(root?.innerHTML ?? '').toBe('<input value="updated">')
    })

    it('sets the type', () => {
      const textFacet = createFacet<InputType>({ initialValue: 'text' })
      const passwordFacet = createFacet<InputType>({ initialValue: 'password' })
      const buttonFacet = createFacet<InputType>({ initialValue: 'button' })
      const radioFacet = createFacet<InputType>({ initialValue: 'radio' })
      const checkboxFacet = createFacet<InputType>({ initialValue: 'checkbox' })

      render(
        <>
          <fast-input type={textFacet} />
          <fast-input type={passwordFacet} />
          <fast-input type={buttonFacet} />
          <fast-input type={radioFacet} />
          <fast-input type={checkboxFacet} />
        </>,
      )

      expect(root?.innerHTML ?? '').toBe(
        '<input type="text"><input type="password"><input type="button"><input type="radio"><input type="checkbox">',
      )

      textFacet.set('checkbox')
      expect(root?.innerHTML ?? '').toBe(
        '<input type="checkbox"><input type="password"><input type="button"><input type="radio"><input type="checkbox">',
      )
    })

    it('sets disabled', () => {
      const disabledFacet = createFacet({ initialValue: true })

      render(<fast-input disabled={disabledFacet} />)
      expect(root?.innerHTML ?? '').toBe('<input disabled="">')

      disabledFacet.set(false)
      expect(root?.innerHTML ?? '').toBe('<input>')
    })

    it('sets maxlength', () => {
      const maxLengthFacet = createFacet({ initialValue: 10 })

      render(<fast-input type="text" maxLength={maxLengthFacet} />)
      expect(root?.innerHTML ?? '').toBe('<input maxlength="10" type="text">')

      maxLengthFacet.set(20)
      expect(root?.innerHTML ?? '').toBe('<input maxlength="20" type="text">')
    })

    it('sets rows', () => {
      const rowsFacet = createFacet({ initialValue: 10 })

      render(<fast-textarea type="text" rows={rowsFacet} />)
      expect(root?.innerHTML ?? '').toBe('<textarea rows="10" type="text"></textarea>')

      rowsFacet.set(20)
      expect(root?.innerHTML ?? '').toBe('<textarea rows="20" type="text"></textarea>')
    })

    it('sets the data-droppable', () => {
      const dataDroppableFacet = createFacet({ initialValue: true })

      render(<fast-div data-droppable={dataDroppableFacet} />)
      expect(root?.innerHTML ?? '').toBe('<div data-droppable=""></div>')

      dataDroppableFacet.set(false)
      expect(root?.innerHTML ?? '').toBe('<div></div>')
    })

    it('sets the data-testid', () => {
      const dataFacet = createFacet({ initialValue: 'test-id' })

      render(<fast-div data-testid={dataFacet} />)
      expect(root?.innerHTML ?? '').toBe('<div data-testid="test-id"></div>')

      dataFacet.set('updated-test-id')
      expect(root?.innerHTML ?? '').toBe('<div data-testid="updated-test-id"></div>')
    })

    it('sets the data-x-ray', () => {
      const dataFacet = createFacet({ initialValue: true })

      render(<fast-div data-x-ray={dataFacet} />)
      expect(root?.innerHTML ?? '').toBe('<div data-x-ray=""></div>')

      dataFacet.set(false)
      expect(root?.innerHTML ?? '').toBe('<div></div>')
    })

    it('sets the href and target', () => {
      const hrefFacet = createFacet({ initialValue: 'url' })
      const targetFacet = createFacet({ initialValue: '_blank' })

      render(<fast-a href={hrefFacet} target={targetFacet}></fast-a>)
      expect(root?.innerHTML ?? '').toBe('<a href="url" target="_blank"></a>')

      hrefFacet.set('updated')
      targetFacet.set('_top')
      expect(root?.innerHTML ?? '').toBe('<a href="updated" target="_top"></a>')
    })

    it('sets the autoPlay', () => {
      const dataFacet = createFacet({ initialValue: true })

      render(<fast-div autoPlay={dataFacet} />)
      expect(root?.innerHTML ?? '').toBe('<div autoplay=""></div>')

      dataFacet.set(false)
      expect(root?.innerHTML ?? '').toBe('<div></div>')
    })

    it('sets the loop', () => {
      const dataFacet = createFacet({ initialValue: true })

      render(<fast-div loop={dataFacet} />)
      expect(root?.innerHTML ?? '').toBe('<div loop=""></div>')

      dataFacet.set(false)
      expect(root?.innerHTML ?? '').toBe('<div></div>')
    })
  })

  describe('setting listeners', () => {
    let onClick: jest.Mock
    let onFocus: jest.Mock
    let onBlur: jest.Mock
    let onMouseDown: jest.Mock
    let onMouseUp: jest.Mock
    let onTouchStart: jest.Mock
    let onTouchMove: jest.Mock
    let onTouchEnd: jest.Mock
    let onMouseEnter: jest.Mock
    let onMouseLeave: jest.Mock
    let onKeyPress: jest.Mock
    let onKeyDown: jest.Mock
    let onKeyUp: jest.Mock
    let div: Element

    beforeEach(() => {
      onClick = jest.fn()
      onFocus = jest.fn()
      onBlur = jest.fn()
      onMouseDown = jest.fn()
      onMouseUp = jest.fn()
      onTouchStart = jest.fn()
      onTouchMove = jest.fn()
      onTouchEnd = jest.fn()
      onMouseEnter = jest.fn()
      onMouseLeave = jest.fn()
      onKeyPress = jest.fn()
      onKeyDown = jest.fn()
      onKeyUp = jest.fn()

      render(
        <div
          className="testing"
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        >
          Hello World
        </div>,
      )

      div = document.getElementsByClassName('testing')[0]
      if (div == null) throw new Error('Root element not found')
    })

    it('supports onClick', () => {
      div.dispatchEvent(new Event('click'))
      expect(onClick).toHaveBeenCalled()
    })

    it('supports onFocus', () => {
      div.dispatchEvent(new Event('focus'))
      expect(onFocus).toHaveBeenCalled()
    })

    it('supports onBlur', () => {
      div.dispatchEvent(new Event('blur'))
      expect(onBlur).toHaveBeenCalled()
    })

    it('supports onMouseDown', () => {
      div.dispatchEvent(new Event('mousedown'))
      expect(onMouseDown).toHaveBeenCalled()
    })

    it('supports onMouseUp', () => {
      div.dispatchEvent(new Event('mouseup'))
      expect(onMouseUp).toHaveBeenCalled()
    })

    it('supports onTouchStart', () => {
      div.dispatchEvent(new Event('touchstart'))
      expect(onTouchStart).toHaveBeenCalled()
    })

    it('supports onTouchMove', () => {
      div.dispatchEvent(new Event('touchmove'))
      expect(onTouchMove).toHaveBeenCalled()
    })

    it('supports onTouchEnd', () => {
      div.dispatchEvent(new Event('touchend'))
      expect(onTouchEnd).toHaveBeenCalled()
    })

    it('supports onMouseEnter', () => {
      div.dispatchEvent(new Event('mouseenter'))
      expect(onMouseEnter).toHaveBeenCalled()
    })

    it('supports onMouseLeave', () => {
      div.dispatchEvent(new Event('mouseleave'))
      expect(onMouseLeave).toHaveBeenCalled()
    })

    it('supports onKeyPress', () => {
      div.dispatchEvent(new Event('keypress'))
      expect(onKeyPress).toHaveBeenCalled()
    })

    it('supports onKeyDown', () => {
      div.dispatchEvent(new Event('keydown'))
      expect(onKeyDown).toHaveBeenCalled()
    })

    it('supports onKeyUp', () => {
      div.dispatchEvent(new Event('keyup'))
      expect(onKeyUp).toHaveBeenCalled()
    })
  })
})

describe('update', () => {
  it('updates text', () => {
    function TestComponent() {
      const [hello, setHello] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setHello(true)
        }, 1000)
      }, [])

      return <div>{hello ? 'Hello' : 'Goodbye'} World</div>
    }

    render(<TestComponent />)
    expect(root).toContainHTML('<div id="root"><div>Goodbye World</div></div>')

    jest.runAllTimers()
    expect(root).toContainHTML('<div id="root"><div>Hello World</div></div>')
  })

  it('updates className', () => {
    function TestComponent() {
      const [hello, setHello] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setHello(true)
        }, 1000)
      }, [])

      return <div className={hello ? 'hello' : 'goodbye'}>Hello World</div>
    }

    render(<TestComponent />)
    expect(root).toContainHTML('<div id="root"><div class="goodbye">Hello World</div></div>')

    jest.runAllTimers()
    expect(root).toContainHTML('<div id="root"><div class="hello">Hello World</div></div>')
  })

  it('updates style', () => {
    function TestComponent() {
      const [hello, setHello] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setHello(true)
        }, 1000)
      }, [])

      return <div style={hello ? { background: 'red' } : { background: 'yellow' }}>Hello World</div>
    }

    render(<TestComponent />)
    expect(root).toContainHTML('<div id="root"><div style="background: yellow;">Hello World</div></div>')

    jest.runAllTimers()
    expect(root).toContainHTML('<div id="root"><div style="background: red;">Hello World</div></div>')
  })

  it('updates src', () => {
    function TestComponent() {
      const [src, setSrc] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setSrc(true)
        }, 1000)
      }, [])

      return <img className="image" src={src ? 'banana.png' : 'frita.png'} />
    }

    render(<TestComponent />)
    let img = document.getElementsByClassName('image')[0] as HTMLImageElement | undefined
    // jsdom is adding the http://localhost
    expect(img && img.src).toEqual('http://localhost/frita.png')

    jest.runAllTimers()
    img = document.getElementsByClassName('image')[0] as HTMLImageElement | undefined
    // jsdom is adding the http://localhost
    expect(img && img.src).toEqual('http://localhost/banana.png')
  })

  it('updates href', () => {
    function TestComponent() {
      const [href, setHref] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setHref(true)
        }, 1000)
      }, [])

      return <a href={href ? 'new' : 'old'} />
    }

    render(<TestComponent />)
    expect(root?.innerHTML ?? '').toBe('<a href="old"></a>')

    jest.runAllTimers()
    expect(root?.innerHTML ?? '').toBe('<a href="new"></a>')
  })

  it('updates target', () => {
    function TestComponent() {
      const [target, setTarget] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setTarget(true)
        }, 1000)
      }, [])

      return <a target={target ? 'new' : 'old'} />
    }

    render(<TestComponent />)
    expect(root?.innerHTML ?? '').toBe('<a target="old"></a>')

    jest.runAllTimers()
    expect(root?.innerHTML ?? '').toBe('<a target="new"></a>')
  })

  it('updates the value', () => {
    const MockComponent = () => {
      const [data, setData] = useState<string | undefined>('foo')
      useEffect(() => {
        setTimeout(() => setData('bar'), 1)
        setTimeout(() => setData(undefined), 2)
      }, [])
      return <input value={data} />
    }

    render(<MockComponent />)
    expect(root?.innerHTML ?? '').toBe('<input value="foo">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input value="bar">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input>')
  })

  it('updates the type', () => {
    const MockComponent = () => {
      const [types, setTypes] = useState<(InputType | undefined)[]>(['text', 'password', 'button'])

      useEffect(() => {
        setTimeout(() => setTypes(['button', 'text', 'password']), 1)
        setTimeout(() => setTypes([undefined, undefined, undefined]), 2)
      }, [])

      return (
        <>
          <input type={types[0]} />
          <input type={types[1]} />
          <input type={types[2]} />
        </>
      )
    }
    render(<MockComponent />)
    expect(root?.innerHTML ?? '').toBe('<input type="text"><input type="password"><input type="button">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input type="button"><input type="text"><input type="password">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input><input><input>')
  })

  it('updates disabled', () => {
    const MockComponent = () => {
      const [disabled, setDisabled] = useState<boolean | undefined>(true)
      useEffect(() => {
        setTimeout(() => setDisabled(false), 1)
        setTimeout(() => setDisabled(true), 2)
        setTimeout(() => setDisabled(undefined), 3)
      }, [])
      return <input disabled={disabled} />
    }

    render(<MockComponent />)
    expect(root?.innerHTML ?? '').toBe('<input disabled="">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input>')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input disabled="">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input>')
  })

  it('updates maxLength', () => {
    const MockComponent = () => {
      const [maxLength, setMaxLength] = useState<number | undefined>(1)
      useEffect(() => {
        setTimeout(() => setMaxLength(undefined), 1)
        setTimeout(() => setMaxLength(2), 2)
        setTimeout(() => setMaxLength(undefined), 3)
      }, [])
      return <input maxLength={maxLength} />
    }

    render(<MockComponent />)
    expect(root?.innerHTML ?? '').toBe('<input maxlength="1">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input>')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input maxlength="2">')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<input>')
  })

  it('updates data-droppable', () => {
    const MockComponent = () => {
      const [droppable, setDroppable] = useState<true | undefined>(true)
      useEffect(() => {
        setTimeout(() => setDroppable(undefined), 1)
        setTimeout(() => setDroppable(true), 2)
        setTimeout(() => setDroppable(undefined), 3)
      }, [])
      return <div data-droppable={droppable} />
    }

    render(<MockComponent />)
    expect(root?.innerHTML ?? '').toBe('<div data-droppable=""></div>')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<div></div>')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<div data-droppable=""></div>')
    jest.advanceTimersByTime(1)
    expect(root?.innerHTML ?? '').toBe('<div></div>')
  })

  describe('setting listeners', () => {
    let firstOnClick: jest.Mock
    let firstOnFocus: jest.Mock
    let firstOnBlur: jest.Mock
    let firstOnMouseDown: jest.Mock
    let firstOnMouseUp: jest.Mock
    let firstOnTouchStart: jest.Mock
    let firstOnTouchMove: jest.Mock
    let firstOnTouchEnd: jest.Mock
    let firstOnMouseEnter: jest.Mock
    let firstOnMouseLeave: jest.Mock
    let firstOnKeyPress: jest.Mock
    let firstOnKeyDown: jest.Mock
    let firstOnKeyUp: jest.Mock

    let secondOnClick: jest.Mock
    let secondOnFocus: jest.Mock
    let secondOnBlur: jest.Mock
    let secondOnMouseDown: jest.Mock
    let secondOnMouseUp: jest.Mock
    let secondOnTouchStart: jest.Mock
    let secondOnTouchMove: jest.Mock
    let secondOnTouchEnd: jest.Mock
    let secondOnMouseEnter: jest.Mock
    let secondOnMouseLeave: jest.Mock
    let secondOnKeyPress: jest.Mock
    let secondOnKeyDown: jest.Mock
    let secondOnKeyUp: jest.Mock

    let div: Element

    function TestComponent() {
      const [second, setSecond] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setSecond(true)
        }, 1000)
      }, [])

      return (
        <div
          className="testing"
          onClick={second ? secondOnClick : firstOnClick}
          onFocus={second ? secondOnFocus : firstOnFocus}
          onBlur={second ? secondOnBlur : firstOnBlur}
          onMouseDown={second ? secondOnMouseDown : firstOnMouseDown}
          onMouseUp={second ? secondOnMouseUp : firstOnMouseUp}
          onTouchStart={second ? secondOnTouchStart : firstOnTouchStart}
          onTouchMove={second ? secondOnTouchMove : firstOnTouchMove}
          onTouchEnd={second ? secondOnTouchEnd : firstOnTouchEnd}
          onMouseEnter={second ? secondOnMouseEnter : firstOnMouseEnter}
          onMouseLeave={second ? secondOnMouseLeave : firstOnMouseLeave}
          onKeyPress={second ? secondOnKeyPress : firstOnKeyPress}
          onKeyDown={second ? secondOnKeyDown : firstOnKeyDown}
          onKeyUp={second ? secondOnKeyUp : firstOnKeyUp}
        >
          Hello World
        </div>
      )
    }

    beforeEach(() => {
      firstOnClick = jest.fn()
      firstOnFocus = jest.fn()
      firstOnBlur = jest.fn()
      firstOnMouseDown = jest.fn()
      firstOnMouseUp = jest.fn()
      firstOnTouchStart = jest.fn()
      firstOnTouchMove = jest.fn()
      firstOnTouchEnd = jest.fn()
      firstOnMouseEnter = jest.fn()
      firstOnMouseLeave = jest.fn()
      firstOnKeyPress = jest.fn()
      firstOnKeyDown = jest.fn()
      firstOnKeyUp = jest.fn()

      secondOnClick = jest.fn()
      secondOnFocus = jest.fn()
      secondOnBlur = jest.fn()
      secondOnMouseDown = jest.fn()
      secondOnMouseUp = jest.fn()
      secondOnTouchStart = jest.fn()
      secondOnTouchMove = jest.fn()
      secondOnTouchEnd = jest.fn()
      secondOnMouseEnter = jest.fn()
      secondOnMouseLeave = jest.fn()
      secondOnKeyPress = jest.fn()
      secondOnKeyDown = jest.fn()
      secondOnKeyUp = jest.fn()

      render(<TestComponent />)

      div = document.getElementsByClassName('testing')[0]
      if (div == null) throw new Error('Root element not found')
    })

    it('supports onClick', () => {
      div.dispatchEvent(new Event('click'))
      expect(firstOnClick).toHaveBeenCalled()
      expect(secondOnClick).not.toHaveBeenCalled()

      firstOnClick.mockClear()
      secondOnClick.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('click'))
      expect(firstOnClick).not.toHaveBeenCalled()
      expect(secondOnClick).toHaveBeenCalled()
    })

    it('supports onFocus', () => {
      div.dispatchEvent(new Event('focus'))
      expect(firstOnFocus).toHaveBeenCalled()
      expect(secondOnFocus).not.toHaveBeenCalled()

      firstOnFocus.mockClear()
      secondOnFocus.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('focus'))
      expect(firstOnFocus).not.toHaveBeenCalled()
      expect(secondOnFocus).toHaveBeenCalled()
    })

    it('supports onBlur', () => {
      div.dispatchEvent(new Event('blur'))
      expect(firstOnBlur).toHaveBeenCalled()
      expect(secondOnBlur).not.toHaveBeenCalled()

      firstOnBlur.mockClear()
      secondOnBlur.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('blur'))
      expect(firstOnBlur).not.toHaveBeenCalled()
      expect(secondOnBlur).toHaveBeenCalled()
    })

    it('supports onMouseDown', () => {
      div.dispatchEvent(new Event('mousedown'))
      expect(firstOnMouseDown).toHaveBeenCalled()
      expect(secondOnMouseDown).not.toHaveBeenCalled()

      firstOnMouseDown.mockClear()
      secondOnMouseDown.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('mousedown'))
      expect(firstOnMouseDown).not.toHaveBeenCalled()
      expect(secondOnMouseDown).toHaveBeenCalled()
    })

    it('supports onMouseUp', () => {
      div.dispatchEvent(new Event('mouseup'))
      expect(firstOnMouseUp).toHaveBeenCalled()
      expect(secondOnMouseUp).not.toHaveBeenCalled()

      firstOnMouseUp.mockClear()
      secondOnMouseUp.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('mouseup'))
      expect(firstOnMouseUp).not.toHaveBeenCalled()
      expect(secondOnMouseUp).toHaveBeenCalled()
    })

    it('supports onTouchStart', () => {
      div.dispatchEvent(new Event('touchstart'))
      expect(firstOnTouchStart).toHaveBeenCalled()
      expect(secondOnTouchStart).not.toHaveBeenCalled()

      firstOnTouchStart.mockClear()
      secondOnTouchStart.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('touchstart'))
      expect(firstOnTouchStart).not.toHaveBeenCalled()
      expect(secondOnTouchStart).toHaveBeenCalled()
    })

    it('supports onTouchMove', () => {
      div.dispatchEvent(new Event('touchmove'))
      expect(firstOnTouchMove).toHaveBeenCalled()
      expect(secondOnTouchMove).not.toHaveBeenCalled()

      firstOnTouchMove.mockClear()
      secondOnTouchMove.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('touchmove'))
      expect(firstOnTouchMove).not.toHaveBeenCalled()
      expect(secondOnTouchMove).toHaveBeenCalled()
    })

    it('supports onTouchEnd', () => {
      div.dispatchEvent(new Event('touchend'))
      expect(firstOnTouchEnd).toHaveBeenCalled()
      expect(secondOnTouchEnd).not.toHaveBeenCalled()

      firstOnTouchEnd.mockClear()
      secondOnTouchEnd.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('touchend'))
      expect(firstOnTouchEnd).not.toHaveBeenCalled()
      expect(secondOnTouchEnd).toHaveBeenCalled()
    })

    it('supports onMouseEnter', () => {
      div.dispatchEvent(new Event('mouseenter'))
      expect(firstOnMouseEnter).toHaveBeenCalled()
      expect(secondOnMouseEnter).not.toHaveBeenCalled()

      firstOnMouseEnter.mockClear()
      secondOnMouseEnter.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('mouseenter'))
      expect(firstOnMouseEnter).not.toHaveBeenCalled()
      expect(secondOnMouseEnter).toHaveBeenCalled()
    })

    it('supports onMouseLeave', () => {
      div.dispatchEvent(new Event('mouseleave'))
      expect(firstOnMouseLeave).toHaveBeenCalled()
      expect(secondOnMouseLeave).not.toHaveBeenCalled()

      firstOnMouseLeave.mockClear()
      secondOnMouseLeave.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('mouseleave'))
      expect(firstOnMouseLeave).not.toHaveBeenCalled()
      expect(secondOnMouseLeave).toHaveBeenCalled()
    })

    it('supports onKeyPress', () => {
      div.dispatchEvent(new Event('keypress'))
      expect(firstOnKeyPress).toHaveBeenCalled()
      expect(secondOnKeyPress).not.toHaveBeenCalled()

      firstOnKeyPress.mockClear()
      secondOnKeyPress.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('keypress'))
      expect(firstOnKeyPress).not.toHaveBeenCalled()
      expect(secondOnKeyPress).toHaveBeenCalled()
    })

    it('supports onKeyDown', () => {
      div.dispatchEvent(new Event('keydown'))
      expect(firstOnKeyDown).toHaveBeenCalled()
      expect(secondOnKeyDown).not.toHaveBeenCalled()

      firstOnKeyDown.mockClear()
      secondOnKeyDown.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('keydown'))
      expect(firstOnKeyDown).not.toHaveBeenCalled()
      expect(secondOnKeyDown).toHaveBeenCalled()
    })

    it('supports onKeyUp', () => {
      div.dispatchEvent(new Event('keyup'))
      expect(firstOnKeyUp).toHaveBeenCalled()
      expect(secondOnKeyUp).not.toHaveBeenCalled()

      firstOnKeyUp.mockClear()
      secondOnKeyUp.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('keyup'))
      expect(firstOnKeyUp).not.toHaveBeenCalled()
      expect(secondOnKeyUp).toHaveBeenCalled()
    })
  })
})

describe('commitUpdate style prop', () => {
  it('subscribes when updating from null', () => {
    const hostConfig = setupHostConfig()
    const instance: ElementContainer = {
      element: document.createElement('div'),
      styleUnsubscribers: new Map(),
    }

    const oldProps: ElementProps<HTMLDivElement> = {
      style: {
        color: undefined,
      },
    }

    const newColorFacet: Facet<string> = {
      get: () => 'blue',
      observe: jest.fn(),
    }

    const newProps: ElementProps<HTMLDivElement> = {
      style: {
        color: newColorFacet,
      },
    }

    hostConfig.commitUpdate?.(
      instance,
      true,
      'fast-div',
      oldProps as Props<HTMLDivElement>,
      newProps as Props<HTMLDivElement>,
      null as unknown as Fiber,
    )

    // Adds a new subscription to the new Facet
    expect(newColorFacet.observe).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes when updating to null', () => {
    const colorUnsubscriber = jest.fn()

    const hostConfig = setupHostConfig()
    const instance: ElementContainer = {
      element: document.createElement('div'),
      styleUnsubscribers: new Map([['color', colorUnsubscriber]]),
    }

    const oldColorFacet: Facet<string> = {
      get: () => 'blue',
      observe: jest.fn(),
    }

    const oldProps: ElementProps<HTMLDivElement> = {
      style: {
        color: oldColorFacet,
      },
    }

    const newProps: ElementProps<HTMLDivElement> = {
      style: {
        color: undefined,
      },
    }

    hostConfig.commitUpdate?.(
      instance,
      true,
      'fast-div',
      oldProps as Props<HTMLDivElement>,
      newProps as Props<HTMLDivElement>,
      null as unknown as Fiber,
    )

    expect(colorUnsubscriber).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes from previous facet when changing to a primitive value', () => {
    const colorUnsubscriber = jest.fn()

    const hostConfig = setupHostConfig()
    const instance: ElementContainer = {
      element: document.createElement('div'),
      styleUnsubscribers: new Map([['color', colorUnsubscriber]]),
    }

    const oldProps: ElementProps<HTMLDivElement> = {
      style: {
        color: createFacet({ initialValue: 'blue' }),
      },
    }

    const newProps: ElementProps<HTMLDivElement> = {
      style: {
        color: 'yellow',
      },
    }

    hostConfig.commitUpdate?.(
      instance,
      true,
      'fast-div',
      oldProps as Props<HTMLDivElement>,
      newProps as Props<HTMLDivElement>,
      null as unknown as Fiber,
    )

    expect(colorUnsubscriber).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes from previous facet when changing to a new facet', () => {
    const colorUnsubscriber = jest.fn()

    const hostConfig = setupHostConfig()
    const instance: ElementContainer = {
      element: document.createElement('div'),
      styleUnsubscribers: new Map([['color', colorUnsubscriber]]),
    }

    const oldColorFacet: Facet<string> = {
      get: () => 'blue',
      observe: jest.fn(),
    }

    const oldProps: ElementProps<HTMLDivElement> = {
      style: {
        color: oldColorFacet,
      },
    }

    const newColorFacet: Facet<string> = {
      get: () => 'blue',
      observe: jest.fn(),
    }

    const newProps: ElementProps<HTMLDivElement> = {
      style: {
        color: newColorFacet,
      },
    }

    hostConfig.commitUpdate?.(
      instance,
      true,
      'fast-div',
      oldProps as Props<HTMLDivElement>,
      newProps as Props<HTMLDivElement>,
      null as unknown as Fiber,
    )

    // Unsubscribes from the old subscription, since it is a new Facet
    expect(colorUnsubscriber).toHaveBeenCalledTimes(1)

    // Adds a new subscription to the new Facet
    expect(newColorFacet.observe).toHaveBeenCalledTimes(1)
  })

  it('keeps the same subscription when updating with the same facet', () => {
    const colorUnsubscriber = jest.fn()

    const hostConfig = setupHostConfig()
    const instance: ElementContainer = {
      element: document.createElement('div'),
      styleUnsubscribers: new Map([['color', colorUnsubscriber]]),
    }

    const colorFacet: Facet<string> = {
      get: () => 'blue',
      observe: jest.fn(),
    }

    const oldProps: ElementProps<HTMLDivElement> = {
      style: {
        color: colorFacet,
      },
    }

    const newProps: ElementProps<HTMLDivElement> = {
      style: {
        color: colorFacet,
      },
    }

    hostConfig.commitUpdate?.(
      instance,
      true,
      'fast-div',
      oldProps as Props<HTMLDivElement>,
      newProps as Props<HTMLDivElement>,
      null as unknown as Fiber,
    )

    // I shouldn't unsubscribe, since it is the same Facet
    expect(colorUnsubscriber).not.toHaveBeenCalled()

    // So I must not also observe again, since I should stick with the previous subscription
    expect(colorFacet.observe).toHaveBeenCalledTimes(0)
  })
})
