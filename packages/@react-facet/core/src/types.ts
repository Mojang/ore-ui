export type Immutable = boolean | number | string | undefined | null

export type ObjectWithImmutables = Record<string, Immutable>

export interface EqualityCheck<T> {
  (): (current: T) => boolean
}

/**
 * Possible values a facet can have.
 * Currently functions are not supported
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = string | number | boolean | undefined | null | [] | Record<string, any> | bigint

export type ExtractFacetValues<T extends ReadonlyArray<Facet<unknown>>> = {
  [K in keyof T]: T[K] extends Facet<infer V> ? V : never
}

export const FACET_FACTORY = Symbol('facet-factory')

export interface FacetFactory<T> {
  (): Facet<T>
  factory: typeof FACET_FACTORY
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExcludeFacetFactory<T> = T extends FacetFactory<any> ? never : T

export interface Listener<T> {
  (value: T): void
}

export type Unsubscribe = () => void

export type Observe<T> = (listener: Listener<T>) => Unsubscribe

export interface Facet<T> {
  get: () => Option<T>
  observe: Observe<T>
}

export interface WritableFacet<T> extends Facet<T> {
  set: (value: T) => void
  setWithCallback: (callback: (previousValue: Option<T>) => Option<T>) => void
}

export interface Update<V> {
  (value: V): void
}

export type Setter<V> = (callbackSetter: V | ((previousValue: Option<V>) => Option<V>)) => void

export type Cleanup = Unsubscribe

export type StartSubscription<V> = (update: Update<V>) => Cleanup

export const isFacet = <T>(value: Value | Facet<T>): value is Facet<T> => {
  return (
    value !== null &&
    value !== undefined &&
    (value as Facet<T>).observe !== undefined &&
    (value as Facet<T>).get !== undefined
  )
}

export type FacetProp<T extends Value> = Facet<T> | ExcludeFacetFactory<T>

export interface Effect<T> {
  (value: T): void | Cleanup
}

export const NO_VALUE = Symbol.for('NoValue')

export type NoValue = typeof NO_VALUE

export type Option<T> = NoValue | T

/**
 * Unit of work that can be scheduled within a batch.
 */
export type Task = {
  (): void
  scheduled?: boolean
}

/**
 * Function that when executed will have its Facet updates scheduled.
 */
export type Batch = () => void

/**
 * CSSStyleDeclaration that has FacetDefinition as values and includes Gameface's extended number based properties
 * Based on Gameface's TypeScript definition: https://github.com/Mojang/Mojang_Cohtml/blob/master/src/Scripting/scripted/typescript/ScriptedCSSStyleDeclaration.d.ts
 */
export type FacetCSSStyleDeclaration = {
  alignContent?: FacetProp<string>
  alignItems?: FacetProp<string>
  alignSelf?: FacetProp<string>
  animation?: FacetProp<string>
  animationDelay?: FacetProp<string>
  animationDirection?: FacetProp<string>
  animationDuration?: FacetProp<string>
  animationFillMode?: FacetProp<string>
  animationIterationCount?: FacetProp<string>
  animationName?: FacetProp<string>
  animationPlayState?: FacetProp<string>
  animationTimingFunction?: FacetProp<string>
  background?: FacetProp<string>
  backgroundColor?: FacetProp<string>
  backgroundImage?: FacetProp<string>
  backgroundPosition?: FacetProp<string>
  backgroundRepeat?: FacetProp<string>
  backgroundSize?: FacetProp<string>
  border?: FacetProp<string>
  borderBottom?: FacetProp<string>
  borderBottomColor?: FacetProp<string>
  borderBottomLeftRadius?: FacetProp<string>
  borderBottomRightRadius?: FacetProp<string>
  borderBottomStyle?: FacetProp<string>
  borderBottomWidth?: FacetProp<string>
  borderColor?: FacetProp<string>
  borderImage?: FacetProp<string>
  borderImageOutset?: FacetProp<string>
  borderImageRepeat?: FacetProp<string>
  borderImageSlice?: FacetProp<string>
  borderImageSource?: FacetProp<string>
  borderImageWidth?: FacetProp<string>
  borderLeft?: FacetProp<string>
  borderLeftColor?: FacetProp<string>
  borderLeftStyle?: FacetProp<string>
  borderLeftWidth?: FacetProp<string>
  borderRadius?: FacetProp<string>
  borderRight?: FacetProp<string>
  borderRightColor?: FacetProp<string>
  borderRightStyle?: FacetProp<string>
  borderRightWidth?: FacetProp<string>
  borderStyle?: FacetProp<string>
  borderTop?: FacetProp<string>
  borderTopColor?: FacetProp<string>
  borderTopLeftRadius?: FacetProp<string>
  borderTopRightRadius?: FacetProp<string>
  borderTopStyle?: FacetProp<string>
  borderTopWidth?: FacetProp<string>
  borderWidth?: FacetProp<string>
  bottom?: FacetProp<string>
  bottomPX?: FacetProp<number>
  bottomVH?: FacetProp<number>
  bottomVW?: FacetProp<number>
  boxShadow?: FacetProp<string>
  clipPath?: FacetProp<string>
  color?: FacetProp<string>
  contain?: FacetProp<string>
  cursor?: FacetProp<string>
  display?: FacetProp<'flex' | 'none'>
  filter?: FacetProp<string>
  flex?: FacetProp<string>
  flexDirection?: FacetProp<string>
  flexWrap?: FacetProp<string>
  font?: FacetProp<string>
  fontFamily?: FacetProp<string>
  fontFitMode?: FacetProp<string>
  fontSize?: FacetProp<string>
  fontStyle?: FacetProp<string>
  fontWeight?: FacetProp<string>
  height?: FacetProp<string>
  heightPX?: FacetProp<number>
  heightVH?: FacetProp<number>
  isolation?: FacetProp<string>
  justifyContent?: FacetProp<string>
  left?: FacetProp<string>
  leftPX?: FacetProp<number>
  leftVH?: FacetProp<number>
  leftVW?: FacetProp<number>
  letterSpacing?: FacetProp<string>
  lineHeight?: FacetProp<string>
  margin?: FacetProp<string>
  marginBottom?: FacetProp<string>
  marginLeft?: FacetProp<string>
  marginRight?: FacetProp<string>
  marginTop?: FacetProp<string>
  mask?: FacetProp<string>
  maskClip?: FacetProp<string>
  maskImage?: FacetProp<string>
  maskMode?: FacetProp<string>
  maskPosition?: FacetProp<string>
  maskRepeat?: FacetProp<string>
  maskSize?: FacetProp<string>
  maxHeight?: FacetProp<string>
  maxHeightPX?: FacetProp<number>
  maxHeightVH?: FacetProp<number>
  maxWidth?: FacetProp<string>
  maxWidthPX?: FacetProp<number>
  maxWidthVW?: FacetProp<number>
  minHeight?: FacetProp<string>
  minHeightPX?: FacetProp<number>
  minHeightVH?: FacetProp<number>
  minWidth?: FacetProp<string>
  minWidthPX?: FacetProp<number>
  minWidthVW?: FacetProp<number>
  mixBlendMode?: FacetProp<string>
  opacity?: FacetProp<number>
  overflow?: FacetProp<string>
  overflowWrap?: FacetProp<string>
  overflowX?: FacetProp<string>
  overflowY?: FacetProp<string>
  padding?: FacetProp<string>
  paddingBottom?: FacetProp<string>
  paddingLeft?: FacetProp<string>
  paddingRight?: FacetProp<string>
  paddingTop?: FacetProp<string>
  perspective?: FacetProp<string>
  perspectiveOrigin?: FacetProp<string>
  pointerEvents?: FacetProp<string>
  position?: FacetProp<string>
  right?: FacetProp<string>
  rightPX?: FacetProp<number>
  rightVH?: FacetProp<number>
  rightVW?: FacetProp<number>
  textAlign?: FacetProp<string>
  textOverflow?: FacetProp<string>
  textShadow?: FacetProp<string>
  textTransform?: FacetProp<string>
  top?: FacetProp<string>
  topPX?: FacetProp<number>
  topVH?: FacetProp<number>
  topVW?: FacetProp<number>
  transform?: FacetProp<string>
  transformOrigin?: FacetProp<string>
  transition?: FacetProp<string>
  transitionDelay?: FacetProp<string>
  transitionDuration?: FacetProp<string>
  transitionProperty?: FacetProp<string>
  transitionTimingFunction?: FacetProp<string>
  userSelect?: FacetProp<string>
  visibility?: FacetProp<string>
  whiteSpace?: FacetProp<string>
  width?: FacetProp<string>
  widthPX?: FacetProp<number>
  widthVW?: FacetProp<number>
  zIndex?: FacetProp<number>
}
