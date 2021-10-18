import React, { ReactElement } from 'react'
import { createFiberRoot } from './createFiberRoot'
import { createPortal } from './createPortal'
import { createReconciler } from './createReconciler'

document.body.innerHTML = `<div id="root"></div><div id="portal"></div>`

const reconcilerInstance = createReconciler()
const root = document.getElementById('root') as HTMLElement
const portal = document.getElementById('portal') as HTMLElement
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

it('portals content', () => {
  const TestComponent = () => {
    return <div>On the other side</div>
  }

  render(
    <>
      <div>Hello World</div>
      {createPortal(<TestComponent />, portal)}
    </>,
  )
  expect(root).toContainHTML('<div id="root"><div>Hello World</div></div>')
  expect(portal).toContainHTML('<div id="portal"><div>On the other side</div></div>')
})
