import { ReactElement } from 'react'
import { useFacetUnwrap } from '../hooks'
import { Facet } from '../types'

type MountProps = {
  when: Facet<boolean | undefined>
  children: ReactElement
}

export const Mount = ({ when, children }: MountProps) => {
  const whenValue = useFacetUnwrap(when)
  return whenValue === true ? children : null
}
