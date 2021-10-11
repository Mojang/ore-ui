import React from 'react'
import { render, act } from '@testing-library/react'
import { fast } from '.'
import { createFacet } from '@react-facet/core'

it('renders several fast components properly', () => {
  const classNameFacet = createFacet({ initialValue: 'some-class-name' })
  const textFacet = createFacet({ initialValue: 'lorem ipsum' })
  const imgSrcFacet = createFacet({ initialValue: 'about:blank' })
  const valueFacet = createFacet({ initialValue: 'placeholder' })
  const backgroundColorFacet = createFacet({ initialValue: 'red' })
  const numberFacet = createFacet({ initialValue: 1 })

  const Example = () => {
    return (
      <fast.div className={classNameFacet} style={{ backgroundColor: backgroundColorFacet }}>
        <fast.p className={classNameFacet} style={{ backgroundColor: backgroundColorFacet }}>
          <fast.span className={classNameFacet} style={{ backgroundColor: backgroundColorFacet }}>
            <fast.text text={textFacet} />
            <fast.text text={numberFacet} />
          </fast.span>
        </fast.p>

        <fast.input className={classNameFacet} value={valueFacet} style={{ backgroundColor: backgroundColorFacet }} />
        <fast.textarea
          className={classNameFacet}
          value={valueFacet}
          style={{ backgroundColor: backgroundColorFacet }}
        />

        <fast.img className={classNameFacet} src={imgSrcFacet} style={{ backgroundColor: backgroundColorFacet }} />
      </fast.div>
    )
  }

  const scenario = <Example />

  const { container } = render(scenario)

  expect(container.firstChild).toMatchSnapshot()
})

it('does not trigger onMouseEnter on render', () => {
  const mock = jest.fn()
  const Example = () => {
    return <fast.div onMouseEnter={mock}></fast.div>
  }
  act(() => {
    render(<Example />)
  })
  expect(mock).toHaveBeenCalledTimes(0)
})

it('does not trigger onMouseLeave on render', () => {
  const mock = jest.fn()
  const Example = () => {
    return <fast.div onMouseLeave={mock}></fast.div>
  }
  act(() => {
    render(<Example />)
  })
  expect(mock).toHaveBeenCalledTimes(0)
})
