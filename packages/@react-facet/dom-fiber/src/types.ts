import { FacetProp, Unsubscribe } from '@react-facet/core'
import { FiberRoot, Reconciler } from 'react-reconciler'
import { Key, MutableRefObject, ReactText } from 'react'

export type FacetFiberRoot = FiberRoot

export type Type =
  | 'fast-a'
  | 'fast-div'
  | 'fast-span'
  | 'fast-p'
  | 'fast-img'
  | 'fast-textarea'
  | 'fast-input'
  | 'fast-text'
  | 'a'
  | 'div'
  | 'p'
  | 'img'
  | 'textarea'
  | 'input'
  | 'style'

export type InputType = 'text' | 'button' | 'password' | 'checkbox' | 'radio' | 'number'

export interface Style {
  [key: string]: FacetProp<string | number | undefined>
}

export interface Callback {
  (): void
}

export interface NoTimeout {
  (): void
}

export type FocusCallback = (e: FocusEvent) => void
export type TouchCallback = (e: TouchEvent) => void
export type MouseCallback = (e: MouseEvent) => void
export type ScrollCallback = (e: UIEvent) => void

export interface PointerEvents {
  onClick?: MouseCallback
  onMouseDown?: MouseCallback
  onMouseUp?: MouseCallback
  onTouchStart?: TouchCallback
  onTouchMove?: TouchCallback
  onTouchEnd?: TouchCallback
  onMouseEnter?: MouseCallback
  onMouseLeave?: MouseCallback
}

export interface FocusEvents {
  onFocus?: FocusCallback
  onBlur?: FocusCallback
}

export type KeyboardCallback = (event: KeyboardEvent) => void

export interface KeyboardEvents {
  onKeyPress?: KeyboardCallback
  onKeyDown?: KeyboardCallback
  onKeyUp?: KeyboardCallback
}

export interface ScrollingEvents {
  onScroll?: ScrollCallback
}

interface StrictReactElement<P = unknown, T extends string = string> {
  type: T
  props: P
  key: Key | null
}

/**
 * More strict type than default React.ReactNode
 *
 * It prevents passing a function as a Node. This allow us to catch accidental passing of facets as children.
 */
export type StrictReactNode = StrictReactElement | ReactText | Array<StrictReactNode> | boolean | null | undefined

export type ElementProps<T> = PointerEvents &
  FocusEvents &
  KeyboardEvents &
  ScrollingEvents & {
    key?: string | number

    /**
     * More strict children that doesn't support passing facets
     */
    children?: StrictReactNode

    style?: Style
    ref?: React.Ref<T>

    dangerouslySetInnerHTML?: { __html: string }

    className?: FacetProp<string | undefined>
    ['data-droppable']?: FacetProp<boolean | undefined>
    ['data-testid']?: FacetProp<string | undefined>
    ['data-x-ray']?: FacetProp<boolean | undefined>
    id?: FacetProp<string | undefined>
    src?: FacetProp<string | undefined>
    href?: FacetProp<string | undefined>
    target?: FacetProp<string | undefined>
    autoPlay?: FacetProp<boolean | undefined>
    loop?: FacetProp<boolean | undefined>
    disabled?: FacetProp<boolean | undefined>
    maxLength?: FacetProp<number | undefined>
    rows?: FacetProp<number | undefined>
    value?: FacetProp<string | undefined>
    type?: FacetProp<InputType | undefined>
  }

export type TextProps = {
  text: FacetProp<string | number>
}

export type Props<T> = ElementProps<T> & TextProps

export type ValidPropsNames = keyof Props<unknown>

export type ElementContainer = {
  children: Set<ElementContainer>

  element: HTMLElement | Text

  style?: CSSStyleDeclaration
  styleUnsubscribers?: Map<string | number, Unsubscribe>

  className?: Unsubscribe
  ['data-droppable']?: Unsubscribe
  ['data-testid']?: Unsubscribe
  ['data-x-ray']?: Unsubscribe
  id?: Unsubscribe
  src?: Unsubscribe
  href?: Unsubscribe
  target?: Unsubscribe
  autoPlay?: Unsubscribe
  loop?: Unsubscribe
  disabled?: Unsubscribe
  maxLength?: Unsubscribe
  rows?: Unsubscribe
  value?: Unsubscribe
  type?: Unsubscribe
  text?: Unsubscribe
}

export const isElementContainer = (value: ElementContainer | TextContainer): value is ElementContainer => {
  return value != null && 'children' in value
}

export type TextContainer = {
  element: Text
}

export type Instance = ElementContainer
export type Container = Instance
export type TextInstance = TextContainer
export type HydratableInstance = Instance
export type PublicInstance = HTMLElement | Text

export type ReactFacetReconciler = Reconciler<Instance, TextInstance, Container, PublicInstance> & {
  flushPassiveEffects: () => boolean
  IsThisRendererActing: MutableRefObject<boolean>
}

export interface HostContext {
  type?: Type
}

export type UpdatePayload = boolean

export type FastAProps = ElementProps<HTMLAnchorElement>
export type FastDivProps = ElementProps<HTMLDivElement>
export type FastImgProps = ElementProps<HTMLImageElement>
export type FastTextareaProps = ElementProps<HTMLTextAreaElement>
export type FastInputProps = ElementProps<HTMLInputElement>
export type FastPProps = ElementProps<HTMLParagraphElement>
export type FastSpanProps = ElementProps<HTMLSpanElement>
export type FastTextProps = TextProps

/**
 * Extends React global namespace with the "fast" types
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'fast-a': FastAProps
      'fast-div': FastDivProps
      'fast-img': FastImgProps
      'fast-textarea': FastTextareaProps
      'fast-input': FastInputProps
      'fast-p': FastPProps
      'fast-span': FastSpanProps
      'fast-text': FastTextProps
    }
  }
}
