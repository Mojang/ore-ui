import { ReactElement } from 'react'
import { useFacetUnwrap } from '../hooks/useFacetUnwrap'
import { Facet } from '../types'

type MountProps = {
  when: Facet<boolean | undefined>
  children: ReactElement | null
  condition?: boolean
}

export const Mount = ({ when, children, condition = true }: MountProps) => {
  const whenValue = useFacetUnwrap(when)
  return whenValue === condition ? children : null
}
