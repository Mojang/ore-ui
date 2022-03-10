import React, { RefObject, useRef } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'

interface TextBaseProps {
  className?: FacetProp<string | undefined>
  id?: FacetProp<string | undefined>
  style?: FacetCSSStyleDeclaration
  text: FacetProp<string | number>
}

export type TextDivProps = TextBaseProps & {
  innerRef?: RefObject<HTMLDivElement>
  tag: 'div'
}

export type TextSpanProps = TextBaseProps & {
  innerRef?: RefObject<HTMLSpanElement>
  tag?: 'span'
}

export type TextParagraphProps = TextBaseProps & {
  innerRef?: RefObject<HTMLParagraphElement>
  tag: 'p'
}

export type TextProps = TextDivProps | TextSpanProps | TextParagraphProps

export const Text = ({ style, className, id, text, innerRef, tag = 'span' }: TextProps) => {
  const defaultRef: typeof innerRef = useRef(null)
  const ref = innerRef ?? defaultRef

  useSetProp(className, (value) => {
    if (ref.current == null) return
    ref.current.className = value ?? ''
  })

  useSetProp(id, (value) => {
    if (ref.current == null) return
    ref.current.id = value ?? ''
  })

  useSetProp(text, (value) => {
    if (ref.current == null) return
    ref.current.textContent = (value as string) ?? ''
  })

  useSetStyle(style, ref)

  if (tag === 'span') {
    return <span ref={ref} />
  } else if (tag === 'div') {
    return <div ref={ref as RefObject<HTMLDivElement>} />
  } else {
    return <p ref={ref as RefObject<HTMLParagraphElement>} />
  }
}
