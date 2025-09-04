import { ReactElement } from 'react'
import { createReconciler } from './createReconciler'
import { createFiberRoot } from './createFiberRoot'
export * from './types'
export * from './createPortal'
export * from './createFiberRoot'
export * from './createReconciler'

export type RootType = {
  render(children: ReactElement): void
  unmount(): void
}

export function createRoot(container: HTMLElement | null): RootType {
  if (container === null) throw new Error('HTML container cannot be null.')

  const reconcilerInstance = createReconciler()

  const root = createFiberRoot(reconcilerInstance)(container)

  if (process.env.NODE_ENV !== 'production') {
    reconcilerInstance.injectIntoDevTools({
      // 0: production, 1: development
      bundleType: 1,
      rendererPackageName: '@react-facet/dom-fiber',
      version: '0.4.0',
    })
  }

  return {
    render(children: ReactElement) {
      reconcilerInstance.updateContainer(children, root, null, () => {})
    },
    unmount() {
      reconcilerInstance.updateContainer(null, root, null, null)
    },
  }
}

/**
 * @deprecated use createRoot instead
 */
export function render(element: ReactElement, container: HTMLElement | null) {
  if (container === null) return () => {}

  const root = createRoot(container)
  root.render(element)

  return () => {
    root.unmount()
  }
}
