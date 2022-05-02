import React, { useRef, RefObject } from 'react'
import { FacetCSSStyleDeclaration, FacetProp } from '@react-facet/core'
import { useSetProp } from './useSetProp'
import { useSetStyle } from './useSetStyle'
import { PointerEvents, FocusEvents, KeyboardEvents, ScrollingEvents } from './types'

export type InputType = 'text' | 'button' | 'password' | 'checkbox' | 'radio' | 'number'

export type InputProps = {
  className?: FacetProp<string | undefined>
  id?: FacetProp<string | undefined>
  style?: FacetCSSStyleDeclaration
  value?: FacetProp<string | undefined>
  disabled?: FacetProp<boolean | undefined>
  maxLength?: FacetProp<number | undefined>
  type?: FacetProp<InputType | undefined>
  innerRef?: RefObject<HTMLInputElement>
} & FocusEvents<HTMLInputElement> &
  KeyboardEvents<HTMLInputElement> &
  PointerEvents<HTMLInputElement> &
  ScrollingEvents

export const Input = ({
  style,
  className,
  id,
  value,
  maxLength,
  disabled,
  innerRef,
  type,
  ...handlers
}: InputProps) => {
  const defaultRef = useRef<HTMLInputElement>(null)
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
    if (value == null || value === false) {
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

  useSetProp(type, (value) => {
    if (ref.current == null) return
    if (value != null) {
      ref.current.setAttribute('type', value)
    } else {
      ref.current.removeAttribute('type')
    }
  })

  useSetStyle(style, ref)

  return <input ref={ref} {...handlers} />
}
