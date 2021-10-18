import Reconciler from 'react-reconciler'
import { setupHostConfig } from './setupHostConfig'
import { ReactFacetReconciler } from './types'

/**
 * @private consider using render instead
 */
export const createReconciler = (): ReactFacetReconciler => Reconciler(setupHostConfig()) as ReactFacetReconciler
