import { FacetFiberRoot, ReactFacetReconciler } from './types'

/**
 * @private consider using render instead
 */
export const createFiberRoot =
  (reconciler: ReactFacetReconciler) =>
  (container: HTMLElement): FacetFiberRoot =>
    reconciler.createContainer(
      {
        children: new Set(),
        element: container,
        styleUnsubscribers: new Map(),
        style: container.style,
      },
      0,
      false,
      null,
    )
