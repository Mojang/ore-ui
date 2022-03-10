import React, { ReactNode, RefObject, useRef } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { FocusEvents, KeyboardEvents, PointerEvents } from './types'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'

export type SpanProps = PointerEvents<HTMLSpanElement> &
  KeyboardEvents<HTMLSpanElement> &
  FocusEvents<HTMLSpanElement> & {
    className?: FacetProp<string | undefined>
    id?: FacetProp<string | undefined>
    style?: FacetCSSStyleDeclaration
    children?: ReactNode
    innerRef?: RefObject<HTMLSpanElement>
  }

export const Span = ({ style, className, children, id, innerRef, ...handlers }: SpanProps) => {
  const defaultRef = useRef<HTMLSpanElement>(null)
  const ref = innerRef ?? defaultRef

  useSetProp(className, (value) => {
    if (ref.current == null) return
    ref.current.className = value ?? ''
  })

  useSetProp(id, (value) => {
    if (ref.current == null) return
    ref.current.id = value ?? ''
  })

  useSetStyle(style, ref)

  return (
    <span ref={ref} {...handlers}>
      {children}
    </span>
  )
}
