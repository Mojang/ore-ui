import {
  Props,
  Type,
  Container,
  ElementContainer,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  NoTimeout,
  isElementContainer,
} from './types'
import { HostConfig } from 'react-reconciler'
import { isFacet, Unsubscribe } from '@react-facet/core'
import {
  setupAutoPlayUpdate,
  setupClassUpdate,
  setupCxUpdate,
  setupCyUpdate,
  setupDataDroppableUpdate,
  setupDataTestidUpdate,
  setupDataXRayUpdate,
  setupDisabledUpdate,
  setupDUpdate,
  setupFillUpdate,
  setupHeightUpdate,
  setupHrefUpdate,
  setupXLinkHrefUpdate,
  setupIdUpdate,
  setupLoopUpdate,
  setupMaxLengthUpdate,
  setupRowsUpdate,
  setupRUpdate,
  setupRxUpdate,
  setupRyUpdate,
  setupSrcUpdate,
  setupStrokeUpdate,
  setupStrokeWidthUpdate,
  setupTargetUpdate,
  setupTextUpdate,
  setupTypeUpdate,
  setupValueUpdate,
  setupWidthUpdate,
  setupX1Update,
  setupX2Update,
  setupXUpdate,
  setupY1Update,
  setupY2Update,
  setupYUpdate,
  setupViewBoxUpdate,
  setupPointsUpdate,
  setupOffsetUpdate,
  setupStopColorUpdate,
  setupStopOpacityUpdate,
  setupFontFamilyUpdate,
  setupFontSizeUpdate,
  setupFillOpacityUpdate,
  setupStrokeOpacityUpdate,
  setupStrokeLinecapUpdate,
  setupStrokeLinejoinUpdate,
} from './setupAttributes'

/**
 * Custom React Renderer with support for Facets
 *
 * Based on https://blog.atulr.com/react-custom-renderer-1/
 * For more information check the official docs: https://github.com/facebook/react/tree/main/packages/react-reconciler
 */
export const setupHostConfig = (): HostConfig<
  Type,
  Props<HTMLElement>,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  null,
  NodeJS.Timeout,
  NoTimeout
> => ({
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  now: Date.now,

  /**
   * We need to support setting up the host config in an environment where window is not available globally yet
   * Ex: screenshot testing
   */
  setTimeout:
    typeof window !== 'undefined'
      ? window.setTimeout
      : (handler, timeout) => window.setTimeout(handler, timeout) as unknown as NodeJS.Timeout,

  /**
   * We need to support setting up the host config in an environment where window is not available globally yet
   * Ex: screenshot testing
   */
  clearTimeout:
    typeof window !== 'undefined' ? window.clearTimeout : (id) => window.clearTimeout(id as unknown as NodeJS.Timeout),

  noTimeout: noop,

  scheduleDeferredCallback: function (callback, options) {
    return window.setTimeout(callback, options ? options.timeout : 0)
  },

  cancelDeferredCallback: function (id) {
    return window.clearTimeout(id)
  },

  getRootHostContext: function () {
    return EMPTY
  },

  getChildHostContext: function () {
    return EMPTY
  },

  shouldSetTextContent: function () {
    return false
  },

  createTextInstance: function (newText) {
    return {
      element: document.createTextNode(newText),
    }
  },

  createInstance: function (externalType, newProps) {
    if (externalType === 'fast-text') {
      const element = document.createTextNode('')

      return {
        children: new Set(),
        element,
        text: setupTextUpdate(newProps.text, element),
      }
    }

    const type = fastTypeMap[externalType] ?? externalType
    const element = document.createElement(type)

    let style: CSSStyleDeclaration | undefined
    let styleUnsubscribers: Map<string | number, Unsubscribe> | undefined

    if (newProps.style != null) {
      style = element.style
      styleUnsubscribers = new Map()

      // We know for sure here that style will never be null (we created it above)
      const notNullStyle = style as unknown as Record<string, unknown>
      const notNullStyleUnsubscribers = styleUnsubscribers as unknown as Map<string | number, Unsubscribe>

      const styleProp = newProps.style

      for (const key in styleProp) {
        const value = styleProp[key]

        if (value != null) {
          if (isFacet(value)) {
            notNullStyleUnsubscribers.set(
              key,
              value.observe((value) => {
                notNullStyle[key] = value
              }),
            )
          } else {
            notNullStyle[key] = value
          }
        }
      }
    }

    if (newProps.dangerouslySetInnerHTML != null) {
      element.innerHTML = newProps.dangerouslySetInnerHTML.__html
    }

    if (newProps.onClick) {
      element.addEventListener('click', newProps.onClick as EventListener)
    }

    if (newProps.onFocus) {
      element.addEventListener('focus', newProps.onFocus as EventListener)
    }

    if (newProps.onBlur) {
      element.addEventListener('blur', newProps.onBlur as EventListener)
    }

    if (newProps.onMouseDown) {
      element.addEventListener('mousedown', newProps.onMouseDown as EventListener)
    }

    if (newProps.onMouseUp) {
      element.addEventListener('mouseup', newProps.onMouseUp as EventListener)
    }

    if (newProps.onTouchStart) {
      element.addEventListener('touchstart', newProps.onTouchStart as EventListener)
    }

    if (newProps.onTouchMove) {
      element.addEventListener('touchmove', newProps.onTouchMove as EventListener)
    }

    if (newProps.onTouchEnd) {
      element.addEventListener('touchend', newProps.onTouchEnd as EventListener)
    }

    if (newProps.onMouseEnter) {
      element.addEventListener('mouseenter', newProps.onMouseEnter as EventListener)
    }

    if (newProps.onMouseLeave) {
      element.addEventListener('mouseleave', newProps.onMouseLeave as EventListener)
    }

    if (newProps.onKeyPress) {
      element.addEventListener('keypress', newProps.onKeyPress as EventListener)
    }

    if (newProps.onKeyDown) {
      element.addEventListener('keydown', newProps.onKeyDown as EventListener)
    }

    if (newProps.onKeyUp) {
      element.addEventListener('keyup', newProps.onKeyUp as EventListener)
    }

    return {
      element,
      styleUnsubscribers,
      style,
      children: new Set(),

      className: newProps.className != null ? setupClassUpdate(newProps.className, element) : undefined,
      id: newProps.id != null ? setupIdUpdate(newProps.id, element) : undefined,
      autoPlay: newProps.autoPlay != null ? setupAutoPlayUpdate(newProps.autoPlay, element) : undefined,
      loop: newProps.loop != null ? setupLoopUpdate(newProps.loop, element) : undefined,
      href: newProps.href != null ? setupHrefUpdate(newProps.href, element) : undefined,
      target: newProps.target != null ? setupTargetUpdate(newProps.target, element) : undefined,
      disabled: newProps.disabled != null ? setupDisabledUpdate(newProps.disabled, element) : undefined,
      maxLength: newProps.maxLength != null ? setupMaxLengthUpdate(newProps.maxLength, element) : undefined,
      rows: newProps.rows != null ? setupRowsUpdate(newProps.rows, element) : undefined,
      type: newProps.type != null ? setupTypeUpdate(newProps.type, element) : undefined,
      value: newProps.value != null ? setupValueUpdate(newProps.value, element) : undefined,
      src: newProps.src != null ? setupSrcUpdate(newProps.src, element) : undefined,

      d: newProps.d != null ? setupDUpdate(newProps.d, element) : undefined,
      fill: newProps.fill != null ? setupFillUpdate(newProps.fill, element) : undefined,
      height: newProps.height != null ? setupHeightUpdate(newProps.height, element) : undefined,
      stroke: newProps.stroke != null ? setupStrokeUpdate(newProps.stroke, element) : undefined,
      x: newProps.x != null ? setupXUpdate(newProps.x, element) : undefined,
      width: newProps.width != null ? setupWidthUpdate(newProps.width, element) : undefined,
      y: newProps.y != null ? setupYUpdate(newProps.y, element) : undefined,

      cx: newProps.cx != null ? setupCxUpdate(newProps.cx, element) : undefined,
      cy: newProps.cy != null ? setupCyUpdate(newProps.cy, element) : undefined,
      r: newProps.r != null ? setupRUpdate(newProps.r, element) : undefined,
      rx: newProps.rx != null ? setupRxUpdate(newProps.rx, element) : undefined,
      ry: newProps.ry != null ? setupRyUpdate(newProps.ry, element) : undefined,

      x1: newProps.x1 != null ? setupX1Update(newProps.x1, element) : undefined,
      x2: newProps.x2 != null ? setupX2Update(newProps.x2, element) : undefined,
      y1: newProps.y1 != null ? setupY1Update(newProps.y1, element) : undefined,
      y2: newProps.y2 != null ? setupY2Update(newProps.y2, element) : undefined,
      strokeWidth: newProps.strokeWidth != null ? setupStrokeWidthUpdate(newProps.strokeWidth, element) : undefined,
      viewBox: newProps.viewBox != null ? setupViewBoxUpdate(newProps.viewBox, element) : undefined,
      xLinkHref: newProps.xLinkHref != null ? setupXLinkHrefUpdate(newProps.xLinkHref, element) : undefined,
      fillOpacity: newProps.fillOpacity != null ? setupFillOpacityUpdate(newProps.fillOpacity, element) : undefined,
      strokeOpacity:
        newProps.strokeOpacity != null ? setupStrokeOpacityUpdate(newProps.strokeOpacity, element) : undefined,
      strokeLinecap:
        newProps.strokeLinecap != null ? setupStrokeLinecapUpdate(newProps.strokeLinecap, element) : undefined,
      strokeLinejoin:
        newProps.strokeLinejoin != null ? setupStrokeLinejoinUpdate(newProps.strokeLinejoin, element) : undefined,
      points: newProps.points != null ? setupPointsUpdate(newProps.points, element) : undefined,
      offset: newProps.offset != null ? setupOffsetUpdate(newProps.offset, element) : undefined,
      stopColor: newProps.stopColor != null ? setupStopColorUpdate(newProps.stopColor, element) : undefined,
      stopOpacity: newProps.stopOpacity != null ? setupStopOpacityUpdate(newProps.stopOpacity, element) : undefined,
      fontFamily: newProps.fontFamily != null ? setupFontFamilyUpdate(newProps.fontFamily, element) : undefined,
      fontSize: newProps.fontSize != null ? setupFontSizeUpdate(newProps.fontSize, element) : undefined,

      ['data-droppable']:
        newProps['data-droppable'] != null ? setupDataDroppableUpdate(newProps['data-droppable'], element) : undefined,

      ['data-testid']:
        newProps['data-testid'] != null ? setupDataTestidUpdate(newProps['data-testid'], element) : undefined,

      ['data-x-ray']: newProps['data-x-ray'] != null ? setupDataXRayUpdate(newProps['data-x-ray'], element) : undefined,
    }
  },

  finalizeInitialChildren: function () {
    return false
  },

  prepareForCommit: function () {},

  resetAfterCommit: function () {},

  commitMount: function () {},

  prepareUpdate: function () {
    return true
  },

  commitUpdate: function (instance, updatePayload, type, oldProps, newProps) {
    const { element: uncastElement } = instance

    if (type === 'fast-text') {
      const textElement = uncastElement as Text

      if (newProps.text !== oldProps.text) {
        instance.text?.()
        instance.text = setupTextUpdate(newProps.text, textElement)
      }

      return
    }

    const element = uncastElement as HTMLElement

    if (newProps.style !== oldProps.style) {
      const style = instance.style || element.style
      const styleUnsubscribers = instance.styleUnsubscribers || new Map()

      instance.style = style
      instance.styleUnsubscribers = styleUnsubscribers

      const notNullStyle = style as unknown as Record<string, unknown>
      const oldStyleProp = oldProps.style
      const newStyleProp = newProps.style

      if (oldStyleProp != null) {
        for (const key in oldStyleProp) {
          const oldValue = oldStyleProp[key]
          const newValue = newStyleProp?.[key]

          if (oldValue !== newValue || newStyleProp == null) {
            if (isFacet(oldValue)) {
              styleUnsubscribers.get(key)?.()
            }
          }
        }
      }

      if (newStyleProp != null) {
        for (const key in newStyleProp) {
          const oldValue = oldStyleProp?.[key]
          const newValue = newStyleProp[key]

          if (oldValue !== newValue || oldStyleProp == null) {
            if (isFacet(newValue)) {
              styleUnsubscribers.set(
                key,
                newValue.observe((value) => {
                  notNullStyle[key] = value
                }),
              )
            } else {
              notNullStyle[key] = newValue
            }
          }
        }
      }
    }

    if (newProps.dangerouslySetInnerHTML != oldProps.dangerouslySetInnerHTML) {
      if (newProps.dangerouslySetInnerHTML != null) {
        element.innerHTML = newProps.dangerouslySetInnerHTML.__html
      } else {
        element.innerHTML = ''
      }
    }

    if (newProps.autoPlay !== oldProps.autoPlay) {
      instance.autoPlay?.()

      if (newProps.autoPlay == null) {
        element.removeAttribute('autoplay')
      } else {
        instance.autoPlay = setupAutoPlayUpdate(newProps.autoPlay, element)
      }
    }

    if (newProps.className !== oldProps.className) {
      instance.className?.()

      if (newProps.className == null) {
        element.className = ''
      } else {
        instance.className = setupClassUpdate(newProps.className, element)
      }
    }

    if (newProps.d !== oldProps.d) {
      instance.d?.()

      if (newProps.d == null) {
        element.removeAttribute('d')
      } else {
        instance.d = setupDUpdate(newProps.d, element)
      }
    }

    if (newProps['data-droppable'] !== oldProps['data-droppable']) {
      instance['data-droppable']?.()

      if (newProps['data-droppable'] == null) {
        element.removeAttribute('data-droppable')
      } else {
        instance['data-droppable'] = setupDataDroppableUpdate(newProps['data-droppable'], element)
      }
    }

    if (newProps['data-testid'] !== oldProps['data-testid']) {
      instance['data-testid']?.()

      if (newProps['data-testid'] == null) {
        element.removeAttribute('data-testid')
      } else {
        instance['data-testid'] = setupDataTestidUpdate(newProps['data-testid'], element)
      }
    }

    if (newProps['data-x-ray'] !== oldProps['data-x-ray']) {
      instance['data-x-ray']?.()

      if (newProps['data-x-ray'] == null) {
        element.removeAttribute('data-x-ray')
      } else {
        instance['data-x-ray'] = setupDataXRayUpdate(newProps['data-x-ray'], element)
      }
    }

    if (newProps.fill !== oldProps.fill) {
      instance.fill?.()

      if (newProps.fill == null) {
        element.removeAttribute('fill')
      } else {
        instance.fill = setupFillUpdate(newProps.fill, element)
      }
    }

    if (newProps.id !== oldProps.id) {
      instance.id?.()

      if (newProps.id == null) {
        element.id = ''
      } else {
        instance.id = setupIdUpdate(newProps.id, element)
      }
    }

    if (newProps.loop !== oldProps.loop) {
      instance.loop?.()

      if (newProps.loop == null) {
        element.removeAttribute('loop')
      } else {
        instance.loop = setupLoopUpdate(newProps.loop, element)
      }
    }

    if (newProps.href !== oldProps.href) {
      instance.href?.()

      if (newProps.href == null) {
        element.removeAttribute('href')
      } else {
        instance.href = setupHrefUpdate(newProps.href, element)
      }
    }

    if (newProps.target !== oldProps.target) {
      instance.target?.()

      if (newProps.target == null) {
        element.removeAttribute('target')
      } else {
        instance.target = setupTargetUpdate(newProps.target, element)
      }
    }

    if (newProps.disabled !== oldProps.disabled) {
      instance.disabled?.()

      if (newProps.disabled == null) {
        element.removeAttribute('disabled')
      } else {
        instance.disabled = setupDisabledUpdate(newProps.disabled, element)
      }
    }

    if (newProps.height !== oldProps.height) {
      instance.height?.()

      if (newProps.height == null) {
        element.removeAttribute('height')
      } else {
        instance.height = setupHeightUpdate(newProps.height, element)
      }
    }

    if (newProps.maxLength !== oldProps.maxLength) {
      instance.maxLength?.()

      if (newProps.maxLength == null) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('maxlength')
      } else {
        instance.maxLength = setupMaxLengthUpdate(newProps.maxLength, element)
      }
    }

    if (newProps.rows !== oldProps.rows) {
      instance.rows?.()

      if (newProps.rows == null) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('rows')
      } else {
        instance.rows = setupRowsUpdate(newProps.rows, element)
      }
    }

    if (newProps.stroke !== oldProps.stroke) {
      instance.stroke?.()

      if (newProps.stroke == null) {
        element.removeAttribute('stroke')
      } else {
        instance.stroke = setupStrokeUpdate(newProps.stroke, element)
      }
    }

    if (newProps.type !== oldProps.type) {
      instance.type?.()

      if (newProps.type == null) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('type')
      } else {
        instance.type = setupTypeUpdate(newProps.type, element)
      }
    }

    if (newProps.value !== oldProps.value) {
      instance.value?.()

      if (newProps.value == null) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('value')
      } else {
        instance.value = setupValueUpdate(newProps.value, element)
      }
    }

    if (newProps.x !== oldProps.x) {
      instance.x?.()

      if (newProps.x == null) {
        element.removeAttribute('x')
      } else {
        instance.x = setupXUpdate(newProps.x, element)
      }
    }

    if (newProps.width !== oldProps.width) {
      instance.width?.()

      if (newProps.width == null) {
        element.removeAttribute('width')
      } else {
        instance.width = setupWidthUpdate(newProps.width, element)
      }
    }

    if (newProps.y !== oldProps.y) {
      instance.y?.()

      if (newProps.y == null) {
        element.removeAttribute('y')
      } else {
        instance.y = setupYUpdate(newProps.y, element)
      }
    }

    if (newProps.cx !== oldProps.cx) {
      instance.cx?.()

      if (newProps.cx == null) {
        element.removeAttribute('cx')
      } else {
        instance.cx = setupCxUpdate(newProps.cx, element)
      }
    }

    if (newProps.r !== oldProps.r) {
      instance.r?.()

      if (newProps.r == null) {
        element.removeAttribute('r')
      } else {
        instance.r = setupRUpdate(newProps.r, element)
      }
    }

    if (newProps.cy !== oldProps.cy) {
      instance.cy?.()

      if (newProps.cy == null) {
        element.removeAttribute('cy')
      } else {
        instance.cy = setupCyUpdate(newProps.cy, element)
      }
    }

    if (newProps.rx !== oldProps.rx) {
      instance.rx?.()

      if (newProps.rx == null) {
        element.removeAttribute('rx')
      } else {
        instance.rx = setupRxUpdate(newProps.rx, element)
      }
    }

    if (newProps.ry !== oldProps.ry) {
      instance.ry?.()

      if (newProps.ry == null) {
        element.removeAttribute('ry')
      } else {
        instance.ry = setupRyUpdate(newProps.ry, element)
      }
    }

    if (newProps.x1 !== oldProps.x1) {
      instance.x1?.()

      if (newProps.x1 == null) {
        element.removeAttribute('x1')
      } else {
        instance.x1 = setupX1Update(newProps.x1, element)
      }
    }

    if (newProps.x2 !== oldProps.x2) {
      instance.x2?.()

      if (newProps.x2 == null) {
        element.removeAttribute('x2')
      } else {
        instance.x2 = setupX2Update(newProps.x2, element)
      }
    }

    if (newProps.y1 !== oldProps.y1) {
      instance.y1?.()

      if (newProps.y1 == null) {
        element.removeAttribute('y1')
      } else {
        instance.y1 = setupY1Update(newProps.y1, element)
      }
    }

    if (newProps.y2 !== oldProps.y2) {
      instance.y2?.()

      if (newProps.y2 == null) {
        element.removeAttribute('y2')
      } else {
        instance.y2 = setupY2Update(newProps.y2, element)
      }
    }

    if (newProps.strokeWidth !== oldProps.strokeWidth) {
      instance.strokeWidth?.()

      if (newProps.strokeWidth == null) {
        element.removeAttribute('strokeWidth')
      } else {
        instance.strokeWidth = setupStrokeWidthUpdate(newProps.strokeWidth, element)
      }
    }

    if (newProps.viewBox !== oldProps.viewBox) {
      instance.viewBox?.()

      if (newProps.viewBox == null) {
        element.removeAttribute('viewBox')
      } else {
        instance.viewBox = setupViewBoxUpdate(newProps.viewBox, element)
      }
    }

    if (newProps.xLinkHref !== oldProps.xLinkHref) {
      instance.xLinkHref?.()

      if (newProps.xLinkHref == null) {
        element.removeAttribute('xlink:href')
      } else {
        instance.xLinkHref = setupXLinkHrefUpdate(newProps.xLinkHref, element)
      }
    }

    if (newProps.fillOpacity !== oldProps.fillOpacity) {
      instance.fillOpacity?.()

      if (newProps.fillOpacity == null) {
        element.removeAttribute('fill-opacity')
      } else {
        instance.fillOpacity = setupFillOpacityUpdate(newProps.fillOpacity, element)
      }
    }

    if (newProps.strokeOpacity !== oldProps.strokeOpacity) {
      instance.strokeOpacity?.()

      if (newProps.strokeOpacity == null) {
        element.removeAttribute('stroke-opacity')
      } else {
        instance.strokeOpacity = setupStrokeOpacityUpdate(newProps.strokeOpacity, element)
      }
    }

    if (newProps.strokeLinecap !== oldProps.strokeLinecap) {
      instance.strokeLinecap?.()

      if (newProps.strokeLinecap == null) {
        element.removeAttribute('stroke-linecap')
      } else {
        instance.strokeLinecap = setupStrokeLinecapUpdate(newProps.strokeLinecap, element)
      }
    }

    if (newProps.strokeLinejoin !== oldProps.strokeLinejoin) {
      instance.strokeLinejoin?.()

      if (newProps.strokeLinejoin == null) {
        element.removeAttribute('stroke-linejoin')
      } else {
        instance.strokeLinejoin = setupStrokeLinejoinUpdate(newProps.strokeLinejoin, element)
      }
    }

    if (newProps.points !== oldProps.points) {
      instance.points?.()
      if (newProps.points == null) {
        element.removeAttribute('points')
      } else {
        instance.points = setupPointsUpdate(newProps.points, element)
      }
    }

    if (newProps.offset !== oldProps.offset) {
      instance.offset?.()
      if (newProps.offset == null) {
        element.removeAttribute('offset')
      } else {
        instance.offset = setupOffsetUpdate(newProps.offset, element)
      }
    }

    if (newProps.stopColor !== oldProps.stopColor) {
      instance.stopColor?.()
      if (newProps.stopColor == null) {
        element.removeAttribute('stop-color')
      } else {
        instance.stopColor = setupStopColorUpdate(newProps.stopColor, element)
      }
    }

    if (newProps.stopOpacity !== oldProps.stopOpacity) {
      instance.stopOpacity?.()
      if (newProps.stopOpacity == null) {
        element.removeAttribute('stop-opacity')
      } else {
        instance.stopOpacity = setupStopOpacityUpdate(newProps.stopOpacity, element)
      }
    }

    if (newProps.fontFamily !== oldProps.fontFamily) {
      instance.fontFamily?.()
      if (newProps.fontFamily == null) {
        element.removeAttribute('font-family')
      } else {
        instance.fontFamily = setupFontFamilyUpdate(newProps.fontFamily, element)
      }
    }

    if (newProps.fontSize !== oldProps.fontSize) {
      instance.fontSize?.()
      if (newProps.fontSize == null) {
        element.removeAttribute('font-size')
      } else {
        instance.fontSize = setupFontSizeUpdate(newProps.fontSize, element)
      }
    }

    if (newProps.src !== oldProps.src) {
      instance.src?.()

      if (newProps.src == null) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('src')
      } else {
        instance.src = setupSrcUpdate(newProps.src, element)
      }
    }

    if (newProps.onClick !== oldProps.onClick) {
      if (oldProps.onClick) element.removeEventListener('click', oldProps.onClick)
      if (newProps.onClick) element.addEventListener('click', newProps.onClick)
    }

    if (newProps.onFocus !== oldProps.onFocus) {
      if (oldProps.onFocus) element.removeEventListener('focus', oldProps.onFocus)
      if (newProps.onFocus) element.addEventListener('focus', newProps.onFocus)
    }

    if (newProps.onBlur !== oldProps.onBlur) {
      if (oldProps.onBlur) element.removeEventListener('blur', oldProps.onBlur)
      if (newProps.onBlur) element.addEventListener('blur', newProps.onBlur)
    }

    if (newProps.onMouseDown !== oldProps.onMouseDown) {
      if (oldProps.onMouseDown) element.removeEventListener('mousedown', oldProps.onMouseDown)
      if (newProps.onMouseDown) element.addEventListener('mousedown', newProps.onMouseDown)
    }

    if (newProps.onMouseEnter !== oldProps.onMouseEnter) {
      if (oldProps.onMouseEnter) element.removeEventListener('mouseenter', oldProps.onMouseEnter)
      if (newProps.onMouseEnter) element.addEventListener('mouseenter', newProps.onMouseEnter)
    }

    if (newProps.onMouseLeave !== oldProps.onMouseLeave) {
      if (oldProps.onMouseLeave) element.removeEventListener('mouseleave', oldProps.onMouseLeave)
      if (newProps.onMouseLeave) element.addEventListener('mouseleave', newProps.onMouseLeave)
    }

    if (newProps.onMouseUp !== oldProps.onMouseUp) {
      if (oldProps.onMouseUp) element.removeEventListener('mouseup', oldProps.onMouseUp)
      if (newProps.onMouseUp) element.addEventListener('mouseup', newProps.onMouseUp)
    }

    if (newProps.onTouchStart !== oldProps.onTouchStart) {
      if (oldProps.onTouchStart) element.removeEventListener('touchstart', oldProps.onTouchStart)
      if (newProps.onTouchStart) element.addEventListener('touchstart', newProps.onTouchStart)
    }

    if (newProps.onTouchMove !== oldProps.onTouchMove) {
      if (oldProps.onTouchMove) element.removeEventListener('touchmove', oldProps.onTouchMove)
      if (newProps.onTouchMove) element.addEventListener('touchmove', newProps.onTouchMove)
    }

    if (newProps.onTouchEnd !== oldProps.onTouchEnd) {
      if (oldProps.onTouchEnd) element.removeEventListener('touchend', oldProps.onTouchEnd)
      if (newProps.onTouchEnd) element.addEventListener('touchend', newProps.onTouchEnd)
    }

    if (newProps.onTouchMove !== oldProps.onTouchMove) {
      if (oldProps.onTouchMove) element.removeEventListener('touchmove', oldProps.onTouchMove)
      if (newProps.onTouchMove) element.addEventListener('touchmove', newProps.onTouchMove)
    }

    if (newProps.onTouchEnd !== oldProps.onTouchEnd) {
      if (oldProps.onTouchEnd) element.removeEventListener('touchend', oldProps.onTouchEnd)
      if (newProps.onTouchEnd) element.addEventListener('touchend', newProps.onTouchEnd)
    }

    if (newProps.onKeyPress !== oldProps.onKeyPress) {
      if (oldProps.onKeyPress) element.removeEventListener('keypress', oldProps.onKeyPress)
      if (newProps.onKeyPress) element.addEventListener('keypress', newProps.onKeyPress)
    }

    if (newProps.onKeyDown !== oldProps.onKeyDown) {
      if (oldProps.onKeyDown) element.removeEventListener('keydown', oldProps.onKeyDown)
      if (newProps.onKeyDown) element.addEventListener('keydown', newProps.onKeyDown)
    }

    if (newProps.onKeyUp !== oldProps.onKeyUp) {
      if (oldProps.onKeyUp) element.removeEventListener('keyup', oldProps.onKeyUp)
      if (newProps.onKeyUp) element.addEventListener('keyup', newProps.onKeyUp)
    }
  },

  commitTextUpdate: function (textInstance, oldText, newText) {
    textInstance.element.nodeValue = newText
  },

  appendInitialChild: function (parent, child) {
    if (isElementContainer(child)) {
      parent.children.add(child)
    }

    parent.element.appendChild(child.element)
  },

  appendChildToContainer: function (parent, child) {
    if (isElementContainer(child)) {
      parent.children.add(child)
    }

    parent.element.appendChild(child.element)
  },

  appendChild: function (parentInstance, child) {
    if (isElementContainer(child)) {
      parentInstance.children.add(child)
    }

    parentInstance.element.appendChild(child.element)
  },

  insertBefore: function (parentInstance, child, beforeChild) {
    parentInstance.element.insertBefore(child.element, beforeChild.element)
  },

  removeChild: function (parentInstance, child) {
    if (isElementContainer(child)) {
      cleanupElementContainer(child)
    }

    parentInstance.element.removeChild(child.element)
  },

  insertInContainerBefore: function (container, child, beforeChild) {
    container.element.insertBefore(child.element, beforeChild.element)
  },

  removeChildFromContainer: function (container, child) {
    if (isElementContainer(child)) {
      cleanupElementContainer(child)
    }

    container.element.removeChild(child.element)
  },

  resetTextContent: function (instance) {
    instance.element.textContent = ''
  },

  shouldDeprioritizeSubtree: function () {
    return false
  },

  getPublicInstance: function (instance) {
    return instance.element
  },
})

const cleanupElementContainer = (instance: ElementContainer) => {
  instance.styleUnsubscribers?.forEach((unsubscribe) => unsubscribe())
  instance.styleUnsubscribers?.clear()

  instance.children.forEach(cleanupElementContainer)
  instance.children.clear()

  instance.className?.()
  instance['data-droppable']?.()
  instance['data-testid']?.()
  instance['data-x-ray']?.()
  instance.id?.()
  instance.src?.()
  instance.href?.()
  instance.target?.()
  instance.autoPlay?.()
  instance.loop?.()
  instance.disabled?.()
  instance.maxLength?.()
  instance.rows?.()
  instance.value?.()
  instance.type?.()
  instance.text?.()
}

const noop = () => {}

const EMPTY = {}

const fastTypeMap: Record<Type, keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap> = {
  'fast-a': 'a',
  'fast-circle': 'circle',
  'fast-ellipse': 'ellipse',
  'fast-line': 'line',
  'fast-div': 'div',
  'fast-p': 'p',
  'fast-path': 'path',
  'fast-img': 'img',
  'fast-input': 'input',
  'fast-rect': 'rect',
  'fast-span': 'span',
  'fast-svg': 'svg',
  'fast-textarea': 'textarea',
  'fast-use': 'use',
  'fast-polyline': 'polyline',
  'fast-polygon': 'polygon',
  'fast-linearGradient': 'linearGradient',
  'fast-radialGradient': 'radialGradient',
  'fast-stop': 'stop',
  'fast-svg-text': 'text',
  'fast-pattern': 'pattern',

  // TODO: fix weird map
  'fast-text': 'span',
  a: 'a',
  circle: 'circle',
  ellipse: 'ellipse',
  line: 'line',
  div: 'div',
  p: 'p',
  path: 'path',
  img: 'img',
  rect: 'rect',
  textarea: 'textarea',
  input: 'input',
  style: 'style',
  svg: 'svg',
  symbol: 'symbol',
  g: 'g',
  use: 'use',
  defs: 'defs',
  polyline: 'polyline',
  polygon: 'polygon',
  linearGradient: 'linearGradient',
  radialGradient: 'radialGradient',
  stop: 'stop',
  text: 'text',
  pattern: 'pattern',
}
