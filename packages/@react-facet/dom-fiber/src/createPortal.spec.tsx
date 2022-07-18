import React from 'react'
import { createPortal } from './createPortal'
import { render, root } from './testSetup'

it('portals content', () => {
  const TestComponent = () => {
    return <div>On the other side</div>
  }

  const portal = document.getElementById('portal') as HTMLElement

  render(
    <>
      <div>Hello World</div>
      {createPortal(<TestComponent />, portal)}
    </>,
  )
  expect(root).toContainHTML('<div id="root"><div>Hello World</div></div>')
  expect(portal).toContainHTML('<div id="portal"><div>On the other side</div></div>')
})
