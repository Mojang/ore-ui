import React, { useRef, RefObject } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'
import { PointerEvents, FocusEvents, KeyboardEvents } from './types'

export type TextAreaProps = {
  className?: FacetProp<string | undefined>
  id?: FacetProp<string | undefined>
  style?: FacetCSSStyleDeclaration
  value?: FacetProp<string | undefined>
  disabled?: FacetProp<boolean | undefined>
  maxLength?: FacetProp<number | undefined>
  rows?: FacetProp<number | undefined>
  innerRef?: RefObject<HTMLTextAreaElement>
} & FocusEvents<HTMLTextAreaElement> &
  KeyboardEvents<HTMLTextAreaElement> &
  PointerEvents<HTMLTextAreaElement>

export const TextArea = ({
  style,
  className,
  id,
  value,
  maxLength,
  disabled,
  innerRef,
  rows,
  ...handlers
}: TextAreaProps) => {
  const defaultRef = useRef<HTMLTextAreaElement>(null)
  const ref = innerRef ?? defaultRef

  useSetProp(className, (value) => {
    if (ref.current == null) return
    ref.current.className = value ?? ''
  })

  useSetProp(id, (value) => {
    if (ref.current == null) return
    ref.current.id = value ?? ''
  })

  useSetProp(value, (value) => {
    if (ref.current == null) return
    const element = ref.current
    element.value = value ?? ''
    element.setAttribute('value', value ?? '')
  })

  useSetProp(disabled, (value) => {
    if (ref.current == null) return
    if (value == null && value === false) {
      ref.current.removeAttribute('disabled')
    } else {
      ref.current.setAttribute('disabled', '')
    }
  })

  useSetProp(maxLength, (value) => {
    if (ref.current == null) return

    if (value != null) {
      ref.current.maxLength = value
    } else {
      ref.current.removeAttribute('maxlength')
    }
  })

  useSetProp(rows, (value) => {
    if (ref.current == null) return
    if (value != null) {
      ref.current.rows = value
    } else {
      ref.current.removeAttribute('rows')
    }
  })

  useSetStyle(style, ref)

  return <textarea ref={ref} {...handlers} />
}
