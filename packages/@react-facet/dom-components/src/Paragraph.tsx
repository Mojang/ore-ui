import React, { ReactNode, RefObject, useRef } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { PointerEvents } from './types'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'

export type ParagraphProps = {
  className?: FacetProp<string | undefined>
  id?: FacetProp<string | undefined>
  style?: FacetCSSStyleDeclaration
  children?: ReactNode
  innerRef?: RefObject<HTMLParagraphElement>
} & PointerEvents<HTMLParagraphElement>

export const Paragraph = ({ style, className, children, id, innerRef, ...handlers }: ParagraphProps) => {
  const defaultRef = useRef<HTMLParagraphElement>(null)
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
    <p ref={ref} {...handlers}>
      {children}
    </p>
  )
}
