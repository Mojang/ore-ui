import { ReactNode } from 'react'
import { ReactPortal } from 'react-reconciler'

// Extracted from React's codebase
const REACT_PORTAL_TYPE = Symbol.for('react.portal')

/**
 * Creates a React Portal.
 * More info: https://reactjs.org/docs/portals.html
 */
export function createPortal(children: ReactNode, container: HTMLElement): ReactPortal {
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: null,
    implementation: null,
    children,
    containerInfo: {
      children: new Set(),
      element: container,
      styleUnsubscribers: new Map(),
      style: container.style,
    },
  }
}
