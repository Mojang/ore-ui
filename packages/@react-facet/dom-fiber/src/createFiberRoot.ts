import { FacetFiberRoot, ReactFacetReconciler } from './types'

/**
 * @private consider using render instead
 */
export const createFiberRoot =
  (reconciler: ReactFacetReconciler) =>
  (container: HTMLElement): FacetFiberRoot =>
    reconciler.createContainer(
      {
        element: container,
        unsubscribers: new Map(),
        styleUnsubscribers: new Map(),
        style: container.style,
      },
      false,
      false,
    )
