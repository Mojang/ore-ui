import { ConcurrentRoot } from 'react-reconciler/constants'
import { FacetFiberRoot, ReactFacetReconciler } from './types'

/**
 * @private consider using render instead
 */
export const createFiberRoot =
  (reconcilerInstance: ReactFacetReconciler) =>
  (container: HTMLElement): FacetFiberRoot =>
    reconcilerInstance.createContainer(
      {
        children: new Set(),
        element: container,
        styleUnsubscribers: new Map(),
        style: container.style,
      },
      ConcurrentRoot,
      null,
      false,
      true,
      '',
      (error) => console.error('[@react-facet/dom-fiber]', error),
      null,
    )
