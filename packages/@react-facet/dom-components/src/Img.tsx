import React, { RefObject, useRef } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { PointerEvents } from './types'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'

export interface ImgProps extends PointerEvents<HTMLImageElement> {
  className?: FacetProp<string | undefined>
  id?: FacetProp<string | undefined>
  style?: FacetCSSStyleDeclaration
  src: FacetProp<string | undefined>
  innerRef?: RefObject<HTMLImageElement>
}

export const Img = ({ style, className, id, src, innerRef, ...handlers }: ImgProps) => {
  const defaultRef = useRef<HTMLImageElement>(null)
  const ref = innerRef ?? defaultRef

  useSetProp(className, (value) => {
    if (ref.current == null) return
    ref.current.className = value ?? ''
  })

  useSetProp(id, (value) => {
    if (ref.current == null) return
    ref.current.id = value ?? ''
  })

  useSetProp(src, (value) => {
    if (ref.current == null) return
    ref.current.setAttribute('src', value ?? '')
  })

  useSetStyle(style, ref)

  return <img ref={ref} {...handlers} />
}
