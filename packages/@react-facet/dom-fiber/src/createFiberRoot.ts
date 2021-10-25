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
        styleUnsubscribers: new Map(),
        style: container.style,
      },
      false,
      false,
    )
