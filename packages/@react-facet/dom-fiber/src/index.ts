import { ReactElement } from 'react'
import { createFiberRoot } from './createFiberRoot'
import { createReconciler } from './createReconciler'
export * from './types'
export * from './createPortal'
export * from './createFiberRoot'
export * from './createReconciler'

/**
 * Render the Facets as the root renderer
 */
export function render(element: ReactElement, container: HTMLElement | null) {
  if (container === null) return () => {}

  const reconcilerInstance = createReconciler()

  const fiberRoot = createFiberRoot(reconcilerInstance)(container)

  reconcilerInstance.updateContainer(element, fiberRoot, null, () => {})

  if (process.env.NODE_ENV !== 'production') {
    reconcilerInstance.injectIntoDevTools({
      // 0: production, 1: development
      bundleType: 1,
      rendererPackageName: '@react-facet/dom-fiber',
      version: '0.0.4',
    })
  }

  return () => {
    reconcilerInstance.updateContainer(null, fiberRoot, null, () => {})
  }
}
