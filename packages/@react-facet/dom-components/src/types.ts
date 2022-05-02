import React from 'react'

export type FocusCallback<T> = (e: React.FocusEvent<T>) => void
export type TouchCallback<T> = (e: React.TouchEvent<T>) => void
export type MouseCallback<T> = (event: React.MouseEvent<T>) => void
export type ScrollCallback = (e: React.UIEvent) => void

export interface PointerEvents<T> {
  onClick?: MouseCallback<T>
  onMouseDown?: MouseCallback<T>
  onMouseUp?: MouseCallback<T>
  onTouchStart?: TouchCallback<T>
  onTouchMove?: TouchCallback<T>
  onTouchEnd?: TouchCallback<T>
  onMouseEnter?: MouseCallback<T>
  onMouseLeave?: MouseCallback<T>
}

export interface FocusEvents<T> {
  onFocus?: FocusCallback<T>
  onBlur?: FocusCallback<T>
}

export type KeyboardCallback<T> = (event: React.KeyboardEvent<T>) => void

export interface KeyboardEvents<T> {
  onKeyPress?: KeyboardCallback<T>
  onKeyDown?: KeyboardCallback<T>
  onKeyUp?: KeyboardCallback<T>
}

export interface ScrollingEvents {
  onScroll?: ScrollCallback
}
