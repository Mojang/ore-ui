import { ReactElement } from 'react'
import { useFacetUnwrap } from '../hooks/useFacetUnwrap'
import { Facet } from '../types'

export const NO_MOUNT_VALUE = Symbol('NO_MOUNT_VALUE')

export type MountProps<T> = {
  when: Facet<T | null | undefined>
  children: ReactElement | null
  is?: T | null | undefined | boolean
  not?: T | null | undefined | boolean | typeof NO_MOUNT_VALUE
}

export const Mount = <T,>({ when, children, is = true, not = NO_MOUNT_VALUE }: MountProps<T>) => {
  const whenValue = useFacetUnwrap(when)
  const shouldMountChildren = not !== NO_MOUNT_VALUE ? whenValue !== not : whenValue === is

  return shouldMountChildren ? children : null
}
