import { ReactNode } from 'react'
import { ReactNodeList } from 'react-reconciler'

// Extracted from React's codebase
const REACT_PORTAL_TYPE = Symbol.for('react.portal')

/**
 * Creates a React Portal.
 * More info: https://reactjs.org/docs/portals.html
 */
export function createPortal(children: ReactNodeList, container: HTMLElement, key?: string | null): ReactNode {
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key,
    children,
    containerInfo: {
      element: container,
      unsubscribers: new Map(),
      styleUnsubscribers: new Map(),
      style: container.style,
    },
  }
}
