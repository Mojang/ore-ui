import React, { ReactNode, RefObject, useRef } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { PointerEvents } from './types'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'

export interface ParagraphProps extends PointerEvents<HTMLParagraphElement> {
  className?: FacetProp<string | undefined>
  style?: FacetCSSStyleDeclaration
  children?: ReactNode
  innerRef?: RefObject<HTMLParagraphElement>
}

export const Paragraph = ({ style, className, children, innerRef, ...handlers }: ParagraphProps) => {
  const defaultRef = useRef<HTMLParagraphElement>(null)
  const ref = innerRef ?? defaultRef

  useSetProp(className, (value) => {
    if (ref.current == null) return
    ref.current.className = value ?? ''
  })

  useSetStyle(style, ref)

  return (
    <p ref={ref} {...handlers}>
      {children}
    </p>
  )
}
