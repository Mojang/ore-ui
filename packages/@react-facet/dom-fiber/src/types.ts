import { FacetProp, Unsubscribe } from '@react-facet/core'
import { FiberRoot, Reconciler } from 'react-reconciler'
import { Key, MutableRefObject, ReactText } from 'react'

export type FacetFiberRoot = FiberRoot

export type TypeHTML =
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

export type TypeSVG =
  | 'fast-circle'
  | 'fast-ellipse'
  | 'fast-line'
  | 'fast-path'
  | 'fast-rect'
  | 'fast-svg'
  | 'fast-foreignObject'
  | 'fast-use'
  | 'fast-polyline'
  | 'fast-polygon'
  | 'fast-linearGradient'
  | 'fast-radialGradient'
  | 'fast-stop'
  | 'fast-svg-text'
  | 'fast-pattern'
  | 'circle'
  | 'ellipse'
  | 'line'
  | 'path'
  | 'rect'
  | 'svg'
  | 'defs'
  | 'g'
  | 'symbol'
  | 'use'
  | 'polyline'
  | 'polygon'
  | 'linearGradient'
  | 'radialGradient'
  | 'foreignObject'
  | 'stop'
  | 'text'
  | 'pattern'

export type Type = TypeHTML | TypeSVG

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
export type MouseCallback = (event: MouseEvent) => void

export interface PointerEvents {
  onClick?: MouseCallback
  onMouseDown?: MouseCallback
  onMouseMove?: MouseCallback
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
  KeyboardEvents & {
    key?: string | number

    /**
     * More strict children that doesn't support passing facets
     */
    children?: StrictReactNode

    style?: Style
    ref?: React.Ref<T>

    dangerouslySetInnerHTML?: { __html: string }

    className?: FacetProp<string | undefined>
    cx?: FacetProp<string | undefined>
    cy?: FacetProp<string | undefined>
    d?: FacetProp<string | undefined>
    ['data-narrate']?: FacetProp<string | boolean | undefined>
    ['data-narrate-as']?: FacetProp<string>
    ['data-narrate-before']?: FacetProp<string>
    ['data-narrate-after']?: FacetProp<string>
    ['data-droppable']?: FacetProp<boolean | undefined>
    ['data-testid']?: FacetProp<string | undefined>
    ['data-x-ray']?: FacetProp<boolean | undefined>
    fill?: FacetProp<string | undefined>
    id?: FacetProp<string | undefined>
    src?: FacetProp<string | undefined>
    height?: FacetProp<string | undefined>
    href?: FacetProp<string | undefined>
    target?: FacetProp<string | undefined>
    autoPlay?: FacetProp<boolean | undefined>
    loop?: FacetProp<boolean | undefined>
    disabled?: FacetProp<boolean | undefined>
    maxLength?: FacetProp<number | undefined>
    r?: FacetProp<string | undefined>
    rx?: FacetProp<string | undefined>
    ry?: FacetProp<string | undefined>
    rows?: FacetProp<number | undefined>
    stroke?: FacetProp<string | undefined>
    strokeWidth?: FacetProp<string | undefined>
    type?: FacetProp<InputType | undefined>
    value?: FacetProp<string | undefined>
    x?: FacetProp<string | undefined>
    x1?: FacetProp<string | undefined>
    x2?: FacetProp<string | undefined>
    width?: FacetProp<string | undefined>
    y?: FacetProp<string | undefined>
    y1?: FacetProp<string | undefined>
    y2?: FacetProp<string | undefined>
    viewBox?: FacetProp<string | undefined>
    xLinkHref?: FacetProp<string | undefined>
    fillOpacity?: FacetProp<string | undefined>
    strokeOpacity?: FacetProp<string | undefined>
    strokeLinecap?: FacetProp<string | undefined>
    strokeLinejoin?: FacetProp<string | undefined>
    points?: FacetProp<string | undefined>
    offset?: FacetProp<string | undefined>
    stopColor?: FacetProp<string | undefined>
    stopOpacity?: FacetProp<string | undefined>
    fontFamily?: FacetProp<string | undefined>
    fontSize?: FacetProp<string | undefined>

    /**
     * Support for Gameface's Experimental inline layout for paragraph elements
     * More info: https://docs.coherent-labs.com/cpp-gameface/what_is_gfp/htmlfeaturesupport/#experimental-inline-layout-for-paragraph-elements
     */
    cohinline?: FacetProp<boolean | undefined>
  }

export type TextProps = {
  text: FacetProp<string | number>
}

export type Props<T> = ElementProps<T> & TextProps

export type ValidPropsNames = keyof Props<unknown>

export type ElementContainer = {
  children: Set<ElementContainer>

  element: HTMLElement | SVGElement | Text

  style?: CSSStyleDeclaration
  styleUnsubscribers?: Map<string | number, Unsubscribe>

  className?: Unsubscribe
  cx?: Unsubscribe
  cy?: Unsubscribe
  d?: Unsubscribe
  ['data-droppable']?: Unsubscribe
  ['data-narrate']?: Unsubscribe
  ['data-narrate-as']?: Unsubscribe
  ['data-narrate-after']?: Unsubscribe
  ['data-narrate-before']?: Unsubscribe
  ['data-testid']?: Unsubscribe
  ['data-x-ray']?: Unsubscribe
  fill?: Unsubscribe
  id?: Unsubscribe
  src?: Unsubscribe
  height?: Unsubscribe
  href?: Unsubscribe
  target?: Unsubscribe
  autoPlay?: Unsubscribe
  loop?: Unsubscribe
  disabled?: Unsubscribe
  maxLength?: Unsubscribe
  r?: Unsubscribe
  rx?: Unsubscribe
  ry?: Unsubscribe
  rows?: Unsubscribe
  stroke?: Unsubscribe
  strokeWidth?: Unsubscribe
  type?: Unsubscribe
  text?: Unsubscribe
  value?: Unsubscribe
  x?: Unsubscribe
  x1?: Unsubscribe
  x2?: Unsubscribe
  width?: Unsubscribe
  y?: Unsubscribe
  y1?: Unsubscribe
  y2?: Unsubscribe
  viewBox?: Unsubscribe
  xLinkHref?: Unsubscribe
  fillOpacity?: Unsubscribe
  strokeOpacity?: Unsubscribe
  strokeLinecap?: Unsubscribe
  strokeLinejoin?: Unsubscribe
  points?: Unsubscribe
  offset?: Unsubscribe
  stopColor?: Unsubscribe
  stopOpacity?: Unsubscribe
  fontFamily?: Unsubscribe
  fontSize?: Unsubscribe
  cohinline?: Unsubscribe
}

export const isElementContainer = (value: ElementContainer | TextContainer): value is ElementContainer => {
  return 'children' in value
}

export type TextContainer = {
  element: Text
}

export type Instance = ElementContainer
export type Container = Instance
export type TextInstance = TextContainer
export type HydratableInstance = Instance
export type PublicInstance = HTMLElement | SVGElement | Text

export type ReactFacetReconciler = Reconciler<Instance, TextInstance, Container, PublicInstance> & {
  flushPassiveEffects: () => boolean
  IsThisRendererActing: MutableRefObject<boolean>
}

export interface HostContext {
  type?: Type
}

export type UpdatePayload = boolean

export type FastAProps = ElementProps<HTMLAnchorElement>
export type FastCircleProps = ElementProps<SVGCircleElement>
export type FastDivProps = ElementProps<HTMLDivElement>
export type FastEllipseProps = ElementProps<SVGEllipseElement>
export type FastLineProps = ElementProps<SVGLineElement>
export type FastImgProps = ElementProps<HTMLImageElement>
export type FastTextareaProps = ElementProps<HTMLTextAreaElement>
export type FastInputProps = ElementProps<HTMLInputElement>
export type FastPProps = ElementProps<HTMLParagraphElement>
export type FastPathProps = ElementProps<SVGPathElement>
export type FastRectProps = ElementProps<SVGRectElement>
export type FastSpanProps = ElementProps<HTMLSpanElement>
export type FastSvgProps = ElementProps<SVGSVGElement>
export type FastForeignOBjectProps = ElementProps<SVGForeignObjectElement>
export type FastTextProps = TextProps
export type FastUseProps = ElementProps<SVGUseElement>
export type FastPolylineProps = ElementProps<SVGPolylineElement>
export type FastPolyGonProps = ElementProps<SVGPolygonElement>
export type FastLinearGradientProps = ElementProps<SVGLinearGradientElement>
export type FastRadialGradientProps = ElementProps<SVGRadialGradientElement>
export type FastStopProps = ElementProps<SVGStopElement>
export type FastSvgTextProps = ElementProps<SVGTextElement>
export type FastPatternProps = ElementProps<SVGPatternElement>

/**
 * Extends React global namespace with the "fast" types
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'fast-a': FastAProps
      'fast-circle': FastCircleProps
      'fast-ellipse': FastEllipseProps
      'fast-line': FastLineProps
      'fast-div': FastDivProps
      'fast-img': FastImgProps
      'fast-textarea': FastTextareaProps
      'fast-input': FastInputProps
      'fast-p': FastPProps
      'fast-path': FastPathProps
      'fast-rect': FastRectProps
      'fast-span': FastSpanProps
      'fast-text': FastTextProps
      'fast-svg': FastSvgProps
      'fast-foreignObject': FastForeignOBjectProps
      'fast-use': FastUseProps
      'fast-polyline': FastPolylineProps
      'fast-polygon': FastPolyGonProps
      'fast-linearGradient': FastLinearGradientProps
      'fast-radialGradient': FastRadialGradientProps
      'fast-stop': FastStopProps
      'fast-svg-text': FastSvgTextProps
      'fast-pattern': FastPatternProps
    }
  }
}
