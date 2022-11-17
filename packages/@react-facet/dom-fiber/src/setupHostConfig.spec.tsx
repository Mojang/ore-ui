import { createFacet, Facet } from '@react-facet/core'
import React, { useEffect, useState } from 'react'
import { Fiber } from 'react-reconciler'
import { setupHostConfig } from './setupHostConfig'
import { act, render, root } from './testSetup'
import { InputType, ElementContainer, ElementProps, Props } from './types'

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

    it('sets the id', () => {
      render(<div id="testing">Hello World</div>)
      expect(root).toContainHTML('<div id="root"><div id="testing">Hello World</div></div>')
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

    it('sets the data-narrate', () => {
      render(<div data-narrate />)
      expect(root?.innerHTML ?? '').toBe('<div data-narrate=""></div>')
    })

    it('sets the data-narrate (with value)', () => {
      render(<div data-narrate="hello world" />)
      expect(root?.innerHTML ?? '').toBe('<div data-narrate="hello world"></div>')
    })

    it('sets the data-narrate-after', () => {
      render(<div data-narrate-after="this comes after" />)
      expect(root?.innerHTML ?? '').toBe('<div data-narrate-after="this comes after"></div>')
    })

    it('sets the data-narrate-before', () => {
      render(<div data-narrate-before="and this comes before" />)
      expect(root?.innerHTML ?? '').toBe('<div data-narrate-before="and this comes before"></div>')
    })

    it('sets the data-narrate-as', () => {
      render(<div data-narrate-as="title" />)
      expect(root?.innerHTML ?? '').toBe('<div data-narrate-as="title"></div>')
    })

    it('sets the href and target', () => {
      render(<a href="url" target="__blank"></a>)
      expect(root?.innerHTML ?? '').toBe('<a href="url" target="__blank"></a>')
    })

    it('sets dangerouslySetInnerHTML', () => {
      render(<div dangerouslySetInnerHTML={{ __html: '<span/>' }} />)
      expect(root?.innerHTML ?? '').toBe('<div><span></span></div>')
    })

    describe('for svg', () => {
      it('sets the d', () => {
        render(<fast-path d="M0,0 L0,10 Z" />)
        expect(root?.innerHTML ?? '').toBe('<path d="M0,0 L0,10 Z"></path>')
      })

      it('sets the fill', () => {
        render(<fast-path fill="#ff0000" />)
        expect(root?.innerHTML ?? '').toBe('<path fill="#ff0000"></path>')
      })

      it('sets the stroke', () => {
        render(<fast-path stroke="#ff0000" />)
        expect(root?.innerHTML ?? '').toBe('<path stroke="#ff0000"></path>')
      })

      it('sets the width', () => {
        render(<fast-svg width="500" />)
        expect(root?.innerHTML ?? '').toBe('<svg width="500"></svg>')
      })

      it('sets the height', () => {
        render(<fast-svg height="500" />)
        expect(root?.innerHTML ?? '').toBe('<svg height="500"></svg>')
      })

      it('sets the x', () => {
        render(<fast-rect x="500" />)
        expect(root?.innerHTML ?? '').toBe('<rect x="500"></rect>')
      })

      it('sets the y', () => {
        render(<fast-rect y="500" />)
        expect(root?.innerHTML ?? '').toBe('<rect y="500"></rect>')
      })

      it('sets the cx', () => {
        render(<fast-circle cx="500" />)
        expect(root?.innerHTML ?? '').toBe('<circle cx="500"></circle>')
      })

      it('sets the cy', () => {
        render(<fast-circle cy="500" />)
        expect(root?.innerHTML ?? '').toBe('<circle cy="500"></circle>')
      })

      it('sets the r', () => {
        render(<fast-circle r="500" />)
        expect(root?.innerHTML ?? '').toBe('<circle r="500"></circle>')
      })

      it('sets the rx', () => {
        render(<fast-ellipse rx="500" />)
        expect(root?.innerHTML ?? '').toBe('<ellipse rx="500"></ellipse>')
      })

      it('sets the ry', () => {
        render(<fast-ellipse ry="500" />)
        expect(root?.innerHTML ?? '').toBe('<ellipse ry="500"></ellipse>')
      })

      it('sets the x1', () => {
        render(<fast-line x1="500" />)
        expect(root?.innerHTML ?? '').toBe('<line x1="500"></line>')
      })

      it('sets the x2', () => {
        render(<fast-line x2="500" />)
        expect(root?.innerHTML ?? '').toBe('<line x2="500"></line>')
      })

      it('sets the y1', () => {
        render(<fast-line y1="500" />)
        expect(root?.innerHTML ?? '').toBe('<line y1="500"></line>')
      })

      it('sets the y2', () => {
        render(<fast-line y2="500" />)
        expect(root?.innerHTML ?? '').toBe('<line y2="500"></line>')
      })

      it('sets the strokeWidth', () => {
        render(<fast-line strokeWidth="500" />)
        expect(root?.innerHTML ?? '').toBe('<line stroke-width="500"></line>')
      })

      it('sets the viewBox', () => {
        render(<fast-svg viewBox="0 0 100 100" />)
        expect(root?.innerHTML ?? '').toBe('<svg viewBox="0 0 100 100"></svg>')
      })

      it('sets the xLinkHref', () => {
        render(<fast-use xLinkHref="#test" />)
        expect(root?.innerHTML ?? '').toBe('<use xlink:href="#test"></use>')
      })

      it('sets the fillOpacity', () => {
        render(<fast-path fillOpacity="0.5" />)
        expect(root?.innerHTML ?? '').toBe('<path fill-opacity="0.5"></path>')
      })

      it('sets the strokeOpacity', () => {
        render(<fast-path strokeOpacity="0.5" />)
        expect(root?.innerHTML ?? '').toBe('<path stroke-opacity="0.5"></path>')
      })

      it('sets the strokeLinecap', () => {
        render(<fast-path strokeLinecap="round" />)
        expect(root?.innerHTML ?? '').toBe('<path stroke-linecap="round"></path>')
      })

      it('sets the strokeLinejoin', () => {
        render(<fast-path strokeLinejoin="round" />)
        expect(root?.innerHTML ?? '').toBe('<path stroke-linejoin="round"></path>')
      })

      it('sets the points', () => {
        render(<fast-polygon points="0,0 0,10 10,10" />)
        expect(root?.innerHTML ?? '').toBe('<polygon points="0,0 0,10 10,10"></polygon>')
      })

      it('sets the offset', () => {
        render(<fast-stop offset="0" />)
        expect(root?.innerHTML ?? '').toBe('<stop offset="0"></stop>')
      })

      it('sets the stopColor', () => {
        render(<fast-stop stopColor="#ff0000" />)
        expect(root?.innerHTML ?? '').toBe('<stop stop-color="#ff0000"></stop>')
      })

      it('sets the stopOpacity', () => {
        render(<fast-stop stopOpacity="0" />)
        expect(root?.innerHTML ?? '').toBe('<stop stop-opacity="0"></stop>')
      })

      it('sets the fontFamily', () => {
        render(<fast-svg-text fontFamily="verdana" />)
        expect(root?.innerHTML ?? '').toBe('<text font-family="verdana"></text>')
      })

      it('sets the fontSize', () => {
        render(<fast-svg-text fontSize="10" />)
        expect(root?.innerHTML ?? '').toBe('<text font-size="10"></text>')
      })
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

    it('sets the id', () => {
      const idFacet = createFacet({ initialValue: 'testing' })

      render(<fast-div id={idFacet}>Hello World</fast-div>)
      expect(root).toContainHTML('<div id="root"><div id="testing">Hello World</div></div>')

      idFacet.set('updated testing')
      expect(root).toContainHTML('<div id="root"><div id="updated testing">Hello World</div></div>')
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

    it('sets the data narration properties', () => {
      const dataNarrateFacet = createFacet<string | boolean>({ initialValue: true })
      const dataNarrateBeforeFacet = createFacet({ initialValue: 'this comes before' })
      const dataNarrateAsFacet = createFacet({ initialValue: 'title' })
      const dataNarrateAfterFacet = createFacet({ initialValue: 'this comes after' })

      render(
        <fast-div
          data-narrate={dataNarrateFacet}
          data-narrate-before={dataNarrateBeforeFacet}
          data-narrate-as={dataNarrateAsFacet}
          data-narrate-after={dataNarrateAfterFacet}
        />,
      )

      const fastDivNode = root?.children[0]

      expect(fastDivNode.getAttribute('data-narrate')).toBe('')
      expect(fastDivNode.getAttribute('data-narrate-before')).toBe('this comes before')
      expect(fastDivNode.getAttribute('data-narrate-as')).toBe('title')
      expect(fastDivNode.getAttribute('data-narrate-after')).toBe('this comes after')

      dataNarrateFacet.set('some content')
      dataNarrateAsFacet.set('subtitle')
      dataNarrateBeforeFacet.set('also called prefix')
      dataNarrateAfterFacet.set('also called suffix')

      expect(fastDivNode.getAttribute('data-narrate')).toBe('some content')
      expect(fastDivNode.getAttribute('data-narrate-before')).toBe('also called prefix')
      expect(fastDivNode.getAttribute('data-narrate-as')).toBe('subtitle')
      expect(fastDivNode.getAttribute('data-narrate-after')).toBe('also called suffix')

      dataNarrateFacet.set(false)
      expect(fastDivNode.getAttribute('data-narrate')).toBe(null)
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

    describe('for svg', () => {
      it('sets the d', () => {
        const dFacet = createFacet({ initialValue: 'M0,0 L0,10 Z' })

        render(<fast-path d={dFacet} />)
        expect(root?.innerHTML ?? '').toBe('<path d="M0,0 L0,10 Z"></path>')

        dFacet.set('M0,10 L0,10 Z')
        expect(root?.innerHTML ?? '').toBe('<path d="M0,10 L0,10 Z"></path>')
      })

      it('sets the fill', () => {
        const fillFacet = createFacet({ initialValue: '#ff0000' })

        render(<fast-path fill={fillFacet} />)
        expect(root?.innerHTML ?? '').toBe('<path fill="#ff0000"></path>')

        fillFacet.set('#00ff00')
        expect(root?.innerHTML ?? '').toBe('<path fill="#00ff00"></path>')
      })

      it('sets the stroke', () => {
        const strokeFacet = createFacet({ initialValue: '#ff0000' })

        render(<fast-path stroke={strokeFacet} />)
        expect(root?.innerHTML ?? '').toBe('<path stroke="#ff0000"></path>')

        strokeFacet.set('#00ff00')
        expect(root?.innerHTML ?? '').toBe('<path stroke="#00ff00"></path>')
      })

      it('sets the width', () => {
        const widthFacet = createFacet({ initialValue: '500' })

        render(<fast-svg width={widthFacet} />)
        expect(root?.innerHTML ?? '').toBe('<svg width="500"></svg>')

        widthFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<svg width="600"></svg>')
      })

      it('sets the height', () => {
        const heightFacet = createFacet({ initialValue: '500' })

        render(<fast-svg height={heightFacet} />)
        expect(root?.innerHTML ?? '').toBe('<svg height="500"></svg>')

        heightFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<svg height="600"></svg>')
      })

      it('sets the x', () => {
        const xFacet = createFacet({ initialValue: '500' })

        render(<fast-rect x={xFacet} />)
        expect(root?.innerHTML ?? '').toBe('<rect x="500"></rect>')

        xFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<rect x="600"></rect>')
      })

      it('sets the y', () => {
        const yFacet = createFacet({ initialValue: '500' })

        render(<fast-rect y={yFacet} />)
        expect(root?.innerHTML ?? '').toBe('<rect y="500"></rect>')

        yFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<rect y="600"></rect>')
      })

      it('sets the cx', () => {
        const cxFacet = createFacet({ initialValue: '500' })

        render(<fast-circle cx={cxFacet} />)
        expect(root?.innerHTML ?? '').toBe('<circle cx="500"></circle>')

        cxFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<circle cx="600"></circle>')
      })

      it('sets the cy', () => {
        const cyFacet = createFacet({ initialValue: '500' })

        render(<fast-circle cy={cyFacet} />)
        expect(root?.innerHTML ?? '').toBe('<circle cy="500"></circle>')

        cyFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<circle cy="600"></circle>')
      })

      it('sets the r', () => {
        const rFacet = createFacet({ initialValue: '500' })

        render(<fast-circle r={rFacet} />)
        expect(root?.innerHTML ?? '').toBe('<circle r="500"></circle>')

        rFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<circle r="600"></circle>')
      })

      it('sets the rx', () => {
        const rxFacet = createFacet({ initialValue: '500' })

        render(<fast-ellipse rx={rxFacet} />)
        expect(root?.innerHTML ?? '').toBe('<ellipse rx="500"></ellipse>')

        rxFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<ellipse rx="600"></ellipse>')
      })

      it('sets the ry', () => {
        const ryFacet = createFacet({ initialValue: '500' })

        render(<fast-ellipse ry={ryFacet} />)
        expect(root?.innerHTML ?? '').toBe('<ellipse ry="500"></ellipse>')

        ryFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<ellipse ry="600"></ellipse>')
      })

      it('sets the x1', () => {
        const x1Facet = createFacet({ initialValue: '500' })

        render(<fast-line x1={x1Facet} />)
        expect(root?.innerHTML ?? '').toBe('<line x1="500"></line>')

        x1Facet.set('600')
        expect(root?.innerHTML ?? '').toBe('<line x1="600"></line>')
      })

      it('sets the x2', () => {
        const x2Facet = createFacet({ initialValue: '500' })

        render(<fast-line x2={x2Facet} />)
        expect(root?.innerHTML ?? '').toBe('<line x2="500"></line>')

        x2Facet.set('600')
        expect(root?.innerHTML ?? '').toBe('<line x2="600"></line>')
      })

      it('sets the y1', () => {
        const y1Facet = createFacet({ initialValue: '500' })

        render(<fast-line y1={y1Facet} />)
        expect(root?.innerHTML ?? '').toBe('<line y1="500"></line>')

        y1Facet.set('600')
        expect(root?.innerHTML ?? '').toBe('<line y1="600"></line>')
      })

      it('sets the y2', () => {
        const y2Facet = createFacet({ initialValue: '500' })

        render(<fast-line y2={y2Facet} />)
        expect(root?.innerHTML ?? '').toBe('<line y2="500"></line>')

        y2Facet.set('600')
        expect(root?.innerHTML ?? '').toBe('<line y2="600"></line>')
      })

      it('sets the strokeWidth', () => {
        const strokeWidthFacet = createFacet({ initialValue: '500' })

        render(<fast-line strokeWidth={strokeWidthFacet} />)
        expect(root?.innerHTML ?? '').toBe('<line stroke-width="500"></line>')

        strokeWidthFacet.set('600')
        expect(root?.innerHTML ?? '').toBe('<line stroke-width="600"></line>')
      })

      it('sets the viewBox', () => {
        const viewBoxFacet = createFacet({ initialValue: '0 0 10 10' })

        render(<fast-svg viewBox={viewBoxFacet} />)
        expect(root?.innerHTML ?? '').toBe('<svg viewBox="0 0 10 10"></svg>')

        viewBoxFacet.set('0 0 20 20')
        expect(root?.innerHTML ?? '').toBe('<svg viewBox="0 0 20 20"></svg>')
      })

      it('sets the xLinkHref', () => {
        const xLinkHrefFacet = createFacet({ initialValue: '#test1' })

        render(<fast-use xLinkHref={xLinkHrefFacet} />)
        expect(root?.innerHTML ?? '').toBe('<use xlink:href="#test1"></use>')

        xLinkHrefFacet.set('#test2')
        expect(root?.innerHTML ?? '').toBe('<use xlink:href="#test2"></use>')
      })

      it('sets the fillOpacity', () => {
        const fillOpacityFacet = createFacet({ initialValue: '0.5' })

        render(<fast-rect fillOpacity={fillOpacityFacet} />)
        expect(root?.innerHTML ?? '').toBe('<rect fill-opacity="0.5"></rect>')

        fillOpacityFacet.set('0.6')
        expect(root?.innerHTML ?? '').toBe('<rect fill-opacity="0.6"></rect>')
      })

      it('sets the strokeOpacity', () => {
        const strokeOpacityFacet = createFacet({ initialValue: '0.5' })

        render(<fast-rect strokeOpacity={strokeOpacityFacet} />)
        expect(root?.innerHTML ?? '').toBe('<rect stroke-opacity="0.5"></rect>')

        strokeOpacityFacet.set('0.6')
        expect(root?.innerHTML ?? '').toBe('<rect stroke-opacity="0.6"></rect>')
      })

      it('sets the strokeLinecap', () => {
        const strokeLinecapFacet = createFacet({ initialValue: 'round' })

        render(<fast-rect strokeLinecap={strokeLinecapFacet} />)
        expect(root?.innerHTML ?? '').toBe('<rect stroke-linecap="round"></rect>')

        strokeLinecapFacet.set('square')
        expect(root?.innerHTML ?? '').toBe('<rect stroke-linecap="square"></rect>')
      })

      it('sets the strokeLinejoin', () => {
        const strokeLinejoinFacet = createFacet({ initialValue: 'round' })

        render(<fast-rect strokeLinejoin={strokeLinejoinFacet} />)
        expect(root?.innerHTML ?? '').toBe('<rect stroke-linejoin="round"></rect>')

        strokeLinejoinFacet.set('square')
        expect(root?.innerHTML ?? '').toBe('<rect stroke-linejoin="square"></rect>')
      })

      it('sets the points', () => {
        const pointsFacet = createFacet({ initialValue: '0 0 10 10' })

        render(<fast-polygon points={pointsFacet} />)
        expect(root?.innerHTML ?? '').toBe('<polygon points="0 0 10 10"></polygon>')

        pointsFacet.set('0 0 20 20')
        expect(root?.innerHTML ?? '').toBe('<polygon points="0 0 20 20"></polygon>')
      })

      it('sets the offset', () => {
        const offsetFacet = createFacet({ initialValue: '0 0' })

        render(<fast-stop offset={offsetFacet} />)
        expect(root?.innerHTML ?? '').toBe('<stop offset="0 0"></stop>')

        offsetFacet.set('1 1')
        expect(root?.innerHTML ?? '').toBe('<stop offset="1 1"></stop>')
      })

      it('sets the stopColor', () => {
        const stopColorFacet = createFacet({ initialValue: '#000' })

        render(<fast-stop stopColor={stopColorFacet} />)
        expect(root?.innerHTML ?? '').toBe('<stop stop-color="#000"></stop>')

        stopColorFacet.set('#fff')
        expect(root?.innerHTML ?? '').toBe('<stop stop-color="#fff"></stop>')
      })

      it('sets the stopOpacity', () => {
        const stopOpacityFacet = createFacet({ initialValue: '0' })

        render(<fast-stop stopOpacity={stopOpacityFacet} />)
        expect(root?.innerHTML ?? '').toBe('<stop stop-opacity="0"></stop>')

        stopOpacityFacet.set('1')
        expect(root?.innerHTML ?? '').toBe('<stop stop-opacity="1"></stop>')
      })

      it('sets the fontFamily', () => {
        const fontFamilyFacet = createFacet({ initialValue: 'Arial' })

        render(<fast-svg-text fontFamily={fontFamilyFacet} />)
        expect(root?.innerHTML ?? '').toBe('<text font-family="Arial"></text>')

        fontFamilyFacet.set('Helvetica')
        expect(root?.innerHTML ?? '').toBe('<text font-family="Helvetica"></text>')
      })

      it('sets the fontSize', () => {
        const fontSizeFacet = createFacet({ initialValue: '10' })

        render(<fast-svg-text fontSize={fontSizeFacet} />)
        expect(root?.innerHTML ?? '').toBe('<text font-size="10"></text>')

        fontSizeFacet.set('20')
        expect(root?.innerHTML ?? '').toBe('<text font-size="20"></text>')
      })
    })
  })

  describe('setting listeners', () => {
    let onClick: jest.Mock
    let onFocus: jest.Mock
    let onBlur: jest.Mock
    let onMouseDown: jest.Mock
    let onMouseMove: jest.Mock
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
      onMouseMove = jest.fn()
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
          onMouseMove={onMouseMove}
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

    it('supports onMouseMove', () => {
      div.dispatchEvent(new Event('mousemove'))
      expect(onMouseMove).toHaveBeenCalled()
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

    act(() => {
      jest.runAllTimers()
    })
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

    act(() => {
      jest.runAllTimers()
    })
    expect(root).toContainHTML('<div id="root"><div class="hello">Hello World</div></div>')
  })

  it('updates id', () => {
    function TestComponent() {
      const [hello, setHello] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setHello(true)
        }, 1000)
      }, [])

      return <div id={hello ? 'hello' : 'goodbye'}>Hello World</div>
    }

    render(<TestComponent />)
    expect(root).toContainHTML('<div id="root"><div id="goodbye">Hello World</div></div>')

    act(() => {
      jest.runAllTimers()
    })
    expect(root).toContainHTML('<div id="root"><div id="hello">Hello World</div></div>')
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

    act(() => {
      jest.runAllTimers()
    })
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

    act(() => {
      jest.runAllTimers()
    })
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

    act(() => {
      jest.runAllTimers()
    })
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

    act(() => {
      jest.runAllTimers()
    })
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
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<input value="bar">')
    act(() => {
      jest.advanceTimersByTime(1)
    })
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
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<input type="button"><input type="text"><input type="password">')
    act(() => {
      jest.advanceTimersByTime(1)
    })
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
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<input>')
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<input disabled="">')
    act(() => {
      jest.advanceTimersByTime(1)
    })
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
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<input>')
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<input maxlength="2">')
    act(() => {
      jest.advanceTimersByTime(1)
    })
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
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<div></div>')
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<div data-droppable=""></div>')
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(root?.innerHTML ?? '').toBe('<div></div>')
  })

  describe('for svg', () => {
    it('updates d', () => {
      const MockComponent = () => {
        const [d, setD] = useState<string | undefined>('M0,0 L0,10 Z')
        useEffect(() => {
          setTimeout(() => setD('M0,10 L0,10 Z'), 1)
          setTimeout(() => setD('M0,0 L0,10 Z'), 2)
          setTimeout(() => setD(undefined), 3)
        }, [])
        return <path d={d} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<path d="M0,0 L0,10 Z"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path d="M0,10 L0,10 Z"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path d="M0,0 L0,10 Z"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path></path>')
    })

    it('updates fill', () => {
      const MockComponent = () => {
        const [fill, setFill] = useState<string | undefined>('#ff0000')
        useEffect(() => {
          setTimeout(() => setFill('#00ff00'), 1)
          setTimeout(() => setFill('#ff0000'), 2)
          setTimeout(() => setFill(undefined), 3)
        }, [])
        return <path fill={fill} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<path fill="#ff0000"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path fill="#00ff00"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path fill="#ff0000"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path></path>')
    })

    it('updates stroke', () => {
      const MockComponent = () => {
        const [stroke, setStroke] = useState<string | undefined>('#ff0000')
        useEffect(() => {
          setTimeout(() => setStroke('#00ff00'), 1)
          setTimeout(() => setStroke('#ff0000'), 2)
          setTimeout(() => setStroke(undefined), 3)
        }, [])
        return <path stroke={stroke} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<path stroke="#ff0000"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path stroke="#00ff00"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path stroke="#ff0000"></path>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<path></path>')
    })

    it('updates width', () => {
      const MockComponent = () => {
        const [width, setWidth] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setWidth('600'), 1)
          setTimeout(() => setWidth('500'), 2)
          setTimeout(() => setWidth(undefined), 3)
        }, [])
        return <svg width={width} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<svg width="500"></svg>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<svg width="600"></svg>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<svg width="500"></svg>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<svg></svg>')
    })

    it('updates height', () => {
      const MockComponent = () => {
        const [height, setHeight] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setHeight('600'), 1)
          setTimeout(() => setHeight('500'), 2)
          setTimeout(() => setHeight(undefined), 3)
        }, [])
        return <svg height={height} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<svg height="500"></svg>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<svg height="600"></svg>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<svg height="500"></svg>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<svg></svg>')
    })

    it('updates x', () => {
      const MockComponent = () => {
        const [x, setX] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setX('600'), 1)
          setTimeout(() => setX('500'), 2)
          setTimeout(() => setX(undefined), 3)
        }, [])
        return <rect x={x} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<rect x="500"></rect>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<rect x="600"></rect>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<rect x="500"></rect>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<rect></rect>')
    })

    it('updates y', () => {
      const MockComponent = () => {
        const [y, setY] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setY('600'), 1)
          setTimeout(() => setY('500'), 2)
          setTimeout(() => setY(undefined), 3)
        }, [])
        return <rect y={y} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<rect y="500"></rect>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<rect y="600"></rect>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<rect y="500"></rect>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<rect></rect>')
    })

    it('updates cx', () => {
      const MockComponent = () => {
        const [cx, setCx] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setCx('600'), 1)
          setTimeout(() => setCx('500'), 2)
          setTimeout(() => setCx(undefined), 3)
        }, [])
        return <circle cx={cx} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<circle cx="500"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle cx="600"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle cx="500"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle></circle>')
    })

    it('updates cy', () => {
      const MockComponent = () => {
        const [cy, setCy] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setCy('600'), 1)
          setTimeout(() => setCy('500'), 2)
          setTimeout(() => setCy(undefined), 3)
        }, [])
        return <circle cy={cy} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<circle cy="500"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle cy="600"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle cy="500"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle></circle>')
    })

    it('updates r', () => {
      const MockComponent = () => {
        const [r, setR] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setR('600'), 1)
          setTimeout(() => setR('500'), 2)
          setTimeout(() => setR(undefined), 3)
        }, [])
        return <circle r={r} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<circle r="500"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle r="600"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle r="500"></circle>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<circle></circle>')
    })

    it('updates rx', () => {
      const MockComponent = () => {
        const [rx, setRx] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setRx('600'), 1)
          setTimeout(() => setRx('500'), 2)
          setTimeout(() => setRx(undefined), 3)
        }, [])
        return <ellipse rx={rx} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<ellipse rx="500"></ellipse>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<ellipse rx="600"></ellipse>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<ellipse rx="500"></ellipse>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<ellipse></ellipse>')
    })

    it('updates ry', () => {
      const MockComponent = () => {
        const [ry, setRy] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setRy('600'), 1)
          setTimeout(() => setRy('500'), 2)
          setTimeout(() => setRy(undefined), 3)
        }, [])
        return <ellipse ry={ry} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<ellipse ry="500"></ellipse>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<ellipse ry="600"></ellipse>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<ellipse ry="500"></ellipse>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<ellipse></ellipse>')
    })

    it('updates x1', () => {
      const MockComponent = () => {
        const [x1, setX1] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setX1('600'), 1)
          setTimeout(() => setX1('500'), 2)
          setTimeout(() => setX1(undefined), 3)
        }, [])
        return <line x1={x1} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<line x1="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line x1="600"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line x1="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line></line>')
    })

    it('updates x2', () => {
      const MockComponent = () => {
        const [x2, setX2] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setX2('600'), 1)
          setTimeout(() => setX2('500'), 2)
          setTimeout(() => setX2(undefined), 3)
        }, [])
        return <line x2={x2} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<line x2="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line x2="600"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line x2="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line></line>')
    })

    it('updates y1', () => {
      const MockComponent = () => {
        const [y1, setY1] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setY1('600'), 1)
          setTimeout(() => setY1('500'), 2)
          setTimeout(() => setY1(undefined), 3)
        }, [])
        return <line y1={y1} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<line y1="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line y1="600"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line y1="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line></line>')
    })

    it('updates y2', () => {
      const MockComponent = () => {
        const [y2, setY2] = useState<string | undefined>('500')
        useEffect(() => {
          setTimeout(() => setY2('600'), 1)
          setTimeout(() => setY2('500'), 2)
          setTimeout(() => setY2(undefined), 3)
        }, [])
        return <line y2={y2} />
      }

      render(<MockComponent />)
      expect(root?.innerHTML ?? '').toBe('<line y2="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line y2="600"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line y2="500"></line>')
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(root?.innerHTML ?? '').toBe('<line></line>')
    })
  })

  describe('setting listeners', () => {
    let firstOnClick: jest.Mock
    let firstOnFocus: jest.Mock
    let firstOnBlur: jest.Mock
    let firstOnMouseDown: jest.Mock
    let firstOnMouseMove: jest.Mock
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
    let secondOnMouseMove: jest.Mock
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
          onMouseMove={second ? secondOnMouseMove : firstOnMouseMove}
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
      firstOnMouseMove = jest.fn()
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
      secondOnMouseMove = jest.fn()
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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

      div.dispatchEvent(new Event('mousedown'))
      expect(firstOnMouseDown).not.toHaveBeenCalled()
      expect(secondOnMouseDown).toHaveBeenCalled()
    })

    it('supports onMouseMove', () => {
      div.dispatchEvent(new Event('mousemove'))
      expect(firstOnMouseMove).toHaveBeenCalled()
      expect(secondOnMouseMove).not.toHaveBeenCalled()

      firstOnMouseMove.mockClear()
      secondOnMouseMove.mockClear()
      jest.runAllTimers()

      div.dispatchEvent(new Event('mousemove'))
      expect(firstOnMouseMove).not.toHaveBeenCalled()
      expect(secondOnMouseMove).toHaveBeenCalled()
    })

    it('supports onMouseUp', () => {
      div.dispatchEvent(new Event('mouseup'))
      expect(firstOnMouseUp).toHaveBeenCalled()
      expect(secondOnMouseUp).not.toHaveBeenCalled()

      firstOnMouseUp.mockClear()
      secondOnMouseUp.mockClear()
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

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
      act(() => {
        jest.runAllTimers()
      })

      div.dispatchEvent(new Event('keyup'))
      expect(firstOnKeyUp).not.toHaveBeenCalled()
      expect(secondOnKeyUp).toHaveBeenCalled()
    })
  })
})

describe('umnount', () => {
  it('hostConfig.removeChild should cleanup children instances', () => {
    const hostConfig = setupHostConfig()
    const child: ElementContainer = {
      children: new Set(),
      element: document.createElement('div'),
      styleUnsubscribers: new Map(),
    }

    const parentInstance: ElementContainer = {
      children: new Set(),
      element: document.createElement('div'),
      styleUnsubscribers: new Map(),
    }

    hostConfig.appendChild?.(parentInstance, child)

    expect(parentInstance.children.size).toBe(1)

    hostConfig.removeChild?.(parentInstance, child)

    expect(parentInstance.children.size).toBe(0)
  })

  it('hostConfig.removeChildFromContainer should cleanup children instances', () => {
    const hostConfig = setupHostConfig()
    const child: ElementContainer = {
      children: new Set(),
      element: document.createElement('div'),
      styleUnsubscribers: new Map(),
    }

    const parentInstance: ElementContainer = {
      children: new Set(),
      element: document.createElement('div'),
      styleUnsubscribers: new Map(),
    }

    hostConfig.appendChild?.(parentInstance, child)

    expect(parentInstance.children.size).toBe(1)

    hostConfig.removeChildFromContainer?.(parentInstance, child)

    expect(parentInstance.children.size).toBe(0)
  })

  it('unsubscribes from all facets when a element component is unmounted', () => {
    const unsubscribe = jest.fn()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const facet: Facet<any> = {
      get: () => 'text',
      observe: jest.fn().mockReturnValue(unsubscribe),
    }

    render(
      <fast-div
        style={{ background: facet, color: facet }}
        className={facet}
        data-droppable={facet}
        data-narrate={facet}
        data-narrate-before={facet}
        data-narrate-after={facet}
        data-narrate-as={facet}
        data-testid={facet}
        data-x-ray={facet}
        src={facet}
        href={facet}
        target={facet}
        autoPlay={facet}
        loop={facet}
        disabled={facet}
        maxLength={facet}
        rows={facet}
        value={facet}
        type={facet}
      />,
    )
    // on mount, we verify that we have added 20 subscriptions (one for each prop and style above)
    expect(facet.observe).toHaveBeenCalledTimes(20)

    // on unmount, we check that unsubscribe was called once for each subscription
    render(<></>)
    expect(unsubscribe).toHaveBeenCalledTimes(20)
  })

  it('unsubscribes from the text facet when a fast-text component is unmounted', () => {
    const unsubscribe = jest.fn()

    const facet: Facet<string> = {
      get: () => 'text',
      observe: jest.fn().mockReturnValue(unsubscribe),
    }

    render(<fast-text text={facet} />)
    expect(facet.observe).toHaveBeenCalledTimes(1)

    render(<></>)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('unsubscribe from facets when the parent of a component is unmounted', () => {
    const unsubscribe = jest.fn()

    const facet: Facet<string> = {
      get: () => 'text',
      observe: jest.fn().mockReturnValue(unsubscribe),
    }

    render(
      <div>
        <fast-text text={facet} />
      </div>,
    )
    expect(facet.observe).toHaveBeenCalledTimes(1)
    expect(unsubscribe).toHaveBeenCalledTimes(0)

    render(<></>)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('keeps the subscription of facets when moving in a keyed list', () => {
    const unsubscribeA = jest.fn()

    const facetA: Facet<string> = {
      get: () => 'text',
      observe: jest.fn().mockReturnValue(unsubscribeA),
    }

    const unsubscribeB = jest.fn()

    const facetB: Facet<string> = {
      get: () => 'text',
      observe: jest.fn().mockReturnValue(unsubscribeB),
    }

    render(<div>{[<fast-div key={'A'} className={facetA} />, <fast-div key={'B'} className={facetB} />]}</div>)
    expect(facetA.observe).toHaveBeenCalledTimes(1)
    expect(facetB.observe).toHaveBeenCalledTimes(1)

    render(<div>{[<fast-div key={'B'} className={facetB} />, <fast-div key={'A'} className={facetA} />]}</div>)

    expect(facetA.observe).toHaveBeenCalledTimes(1)
    expect(facetB.observe).toHaveBeenCalledTimes(1)
    expect(unsubscribeA).not.toHaveBeenCalled()
    expect(unsubscribeB).not.toHaveBeenCalled()
  })
})

describe('commitUpdate style prop', () => {
  it('subscribes when updating from null', () => {
    const hostConfig = setupHostConfig()
    const instance: ElementContainer = {
      children: new Set(),
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
      children: new Set(),
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
      children: new Set(),
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
      children: new Set(),
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
      children: new Set(),
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
