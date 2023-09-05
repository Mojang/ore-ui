import React, { useRef, RefObject, ReactNode } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { FocusEvents, KeyboardEvents, PointerEvents } from './types'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'

export type DivProps = PointerEvents<HTMLDivElement> &
  KeyboardEvents<HTMLDivElement> &
  FocusEvents<HTMLSpanElement> & {
    className?: FacetProp<string | undefined>
    id?: FacetProp<string | undefined>
    style?: FacetCSSStyleDeclaration
    children?: ReactNode
    innerRef?: RefObject<HTMLDivElement>
  }

export const Div = ({ style, className, id, children, innerRef, ...handlers }: DivProps) => {
  const defaultRef = useRef<HTMLDivElement>(null)
  const ref = innerRef ?? defaultRef

  useSetProp(className, (value) => {
    if (ref.current === null) return
    ref.current.className = value ?? ''
  })

  useSetProp(id, (value) => {
    if (ref.current === null) return
    ref.current.id = value ?? ''
  })

  useSetStyle(style, ref)

  return (
    <div ref={ref} {...handlers}>
      {children}
    </div>
  )
}
