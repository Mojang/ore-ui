import {
  Props,
  Type,
  Container,
  ElementContainer,
  Instance,
  TextInstance,
  HydratableInstance,
  SuspenseInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  NoTimeout,
  isElementContainer,
  TypeSVG,
  TypeHTML,
} from './types'
import { HostConfig } from 'react-reconciler'
import { DefaultEventPriority } from 'react-reconciler/constants'
import { isFacet, Unsubscribe } from '@react-facet/core'
import {
  setupClassUpdate,
  setupIdUpdate,
  setupMaxLengthUpdate,
  setupRowsUpdate,
  setupSrcUpdate,
  setupTextUpdate,
  setupValueUpdate,
  setupViewBoxUpdate,
  setupAttributeUpdate,
  setupStyleUpdate,
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
  SuspenseInstance,
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

  supportsMicrotask: true,
  scheduleMicrotask: (callback) =>
    Promise.resolve(null)
      .then(callback)
      .catch((error) => {
        setTimeout(() => {
          throw error
        })
      }),

  getCurrentEventPriority: () => {
    return DefaultEventPriority
  },

  getInstanceFromNode: () => {
    return null
  },

  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => {},

  clearContainer: () => false,

  /**
   * We need to support setting up the host config in an environment where window is not available globally yet
   * Ex: screenshot testing
   */
  scheduleTimeout:
    typeof window !== 'undefined'
      ? window.setTimeout
      : (handler, timeout) => window.setTimeout(handler, timeout) as unknown as NodeJS.Timeout,

  /**
   * We need to support setting up the host config in an environment where window is not available globally yet
   * Ex: screenshot testing
   */
  cancelTimeout:
    typeof window !== 'undefined' ? window.clearTimeout : (id) => window.clearTimeout(id as unknown as NodeJS.Timeout),

  noTimeout: noop,

  preparePortalMount: function () {},

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

    const typeHTML = fastTypeMapHTML[externalType as TypeHTML] ?? externalType
    const typeSVG = fastTypeMapSVG[externalType as TypeSVG]
    const element =
      typeSVG !== undefined
        ? document.createElementNS('http://www.w3.org/2000/svg', typeSVG)
        : document.createElement(typeHTML)

    let style: CSSStyleDeclaration | undefined
    let styleUnsubscribers: Map<string | number, Unsubscribe> | undefined

    if (newProps.style !== undefined) {
      style = element.style
      styleUnsubscribers = new Map()

      setupStyleUpdate(newProps.style, style as unknown as Record<string, unknown>, styleUnsubscribers)
    }

    if (newProps.dangerouslySetInnerHTML !== undefined) {
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

    if (newProps.onMouseMove) {
      element.addEventListener('mousemove', newProps.onMouseMove as EventListener)
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

      className: newProps.className !== undefined ? setupClassUpdate(newProps.className, element) : undefined,
      id: newProps.id !== undefined ? setupIdUpdate(newProps.id, element) : undefined,
      autoPlay:
        newProps.autoPlay !== undefined ? setupAttributeUpdate('autoplay', newProps.autoPlay, element) : undefined,
      loop: newProps.loop !== undefined ? setupAttributeUpdate('loop', newProps.loop, element) : undefined,
      href: newProps.href !== undefined ? setupAttributeUpdate('href', newProps.href, element) : undefined,
      target: newProps.target !== undefined ? setupAttributeUpdate('target', newProps.target, element) : undefined,
      disabled:
        newProps.disabled !== undefined ? setupAttributeUpdate('disabled', newProps.disabled, element) : undefined,
      maxLength: newProps.maxLength !== undefined ? setupMaxLengthUpdate(newProps.maxLength, element) : undefined,
      rows: newProps.rows !== undefined ? setupRowsUpdate(newProps.rows, element) : undefined,
      type: newProps.type !== undefined ? setupAttributeUpdate('type', newProps.type, element) : undefined,
      value: newProps.value !== undefined ? setupValueUpdate(newProps.value, element) : undefined,
      src: newProps.src !== undefined ? setupSrcUpdate(newProps.src, element) : undefined,

      d: newProps.d !== undefined ? setupAttributeUpdate('d', newProps.d, element) : undefined,
      fill: newProps.fill !== undefined ? setupAttributeUpdate('fill', newProps.fill, element) : undefined,
      height: newProps.height !== undefined ? setupAttributeUpdate('height', newProps.height, element) : undefined,
      stroke: newProps.stroke !== undefined ? setupAttributeUpdate('stroke', newProps.stroke, element) : undefined,
      x: newProps.x !== undefined ? setupAttributeUpdate('x', newProps.x, element) : undefined,
      width: newProps.width !== undefined ? setupAttributeUpdate('width', newProps.width, element) : undefined,
      y: newProps.y !== undefined ? setupAttributeUpdate('y', newProps.y, element) : undefined,

      cx: newProps.cx !== undefined ? setupAttributeUpdate('cx', newProps.cx, element) : undefined,
      cy: newProps.cy !== undefined ? setupAttributeUpdate('cy', newProps.cy, element) : undefined,
      r: newProps.r !== undefined ? setupAttributeUpdate('r', newProps.r, element) : undefined,
      rx: newProps.rx !== undefined ? setupAttributeUpdate('rx', newProps.rx, element) : undefined,
      ry: newProps.ry !== undefined ? setupAttributeUpdate('ry', newProps.ry, element) : undefined,

      x1: newProps.x1 !== undefined ? setupAttributeUpdate('x1', newProps.x1, element) : undefined,
      x2: newProps.x2 !== undefined ? setupAttributeUpdate('x2', newProps.x2, element) : undefined,
      y1: newProps.y1 !== undefined ? setupAttributeUpdate('y1', newProps.y1, element) : undefined,
      y2: newProps.y2 !== undefined ? setupAttributeUpdate('y2', newProps.y2, element) : undefined,
      strokeWidth:
        newProps.strokeWidth !== undefined
          ? setupAttributeUpdate('stroke-width', newProps.strokeWidth, element)
          : undefined,
      viewBox: newProps.viewBox !== undefined ? setupViewBoxUpdate(newProps.viewBox, element) : undefined,
      xLinkHref:
        newProps.xLinkHref !== undefined ? setupAttributeUpdate('xlink:href', newProps.xLinkHref, element) : undefined,
      fillOpacity:
        newProps.fillOpacity !== undefined
          ? setupAttributeUpdate('fill-opacity', newProps.fillOpacity, element)
          : undefined,
      strokeOpacity:
        newProps.strokeOpacity !== undefined
          ? setupAttributeUpdate('stroke-opacity', newProps.strokeOpacity, element)
          : undefined,
      strokeLinecap:
        newProps.strokeLinecap !== undefined
          ? setupAttributeUpdate('stroke-linecap', newProps.strokeLinecap, element)
          : undefined,
      strokeLinejoin:
        newProps.strokeLinejoin !== undefined
          ? setupAttributeUpdate('stroke-linejoin', newProps.strokeLinejoin, element)
          : undefined,
      points: newProps.points !== undefined ? setupAttributeUpdate('points', newProps.points, element) : undefined,
      offset: newProps.offset !== undefined ? setupAttributeUpdate('offset', newProps.offset, element) : undefined,
      stopColor:
        newProps.stopColor !== undefined ? setupAttributeUpdate('stop-color', newProps.stopColor, element) : undefined,
      stopOpacity:
        newProps.stopOpacity !== undefined
          ? setupAttributeUpdate('stop-opacity', newProps.stopOpacity, element)
          : undefined,
      fontFamily:
        newProps.fontFamily !== undefined
          ? setupAttributeUpdate('font-family', newProps.fontFamily, element)
          : undefined,
      fontSize:
        newProps.fontSize !== undefined ? setupAttributeUpdate('font-size', newProps.fontSize, element) : undefined,

      ['data-droppable']:
        newProps['data-droppable'] !== undefined
          ? setupAttributeUpdate('data-droppable', newProps['data-droppable'], element)
          : undefined,

      ['data-narrate']:
        newProps['data-narrate'] !== undefined
          ? setupAttributeUpdate('data-narrate', newProps['data-narrate'], element)
          : undefined,

      ['data-narrate-as']:
        newProps['data-narrate-as'] !== undefined
          ? setupAttributeUpdate('data-narrate-as', newProps['data-narrate-as'], element)
          : undefined,

      ['data-narrate-before']:
        newProps['data-narrate-before'] !== undefined
          ? setupAttributeUpdate('data-narrate-before', newProps['data-narrate-before'], element)
          : undefined,

      ['data-narrate-after']:
        newProps['data-narrate-after'] !== undefined
          ? setupAttributeUpdate('data-narrate-after', newProps['data-narrate-after'], element)
          : undefined,

      ['data-testid']:
        newProps['data-testid'] !== undefined
          ? setupAttributeUpdate('data-testid', newProps['data-testid'], element)
          : undefined,

      ['data-x-ray']:
        newProps['data-x-ray'] !== undefined
          ? setupAttributeUpdate('data-x-ray', newProps['data-x-ray'], element)
          : undefined,

      cohinline:
        newProps.cohinline !== undefined ? setupAttributeUpdate('cohinline', newProps.cohinline, element) : undefined,
    }
  },

  finalizeInitialChildren: function () {
    return false
  },

  prepareForCommit: function () {
    return null
  },

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

      if (oldStyleProp !== undefined) {
        for (const key in oldStyleProp) {
          const oldValue = oldStyleProp[key]
          const newValue = newStyleProp?.[key]

          if (oldValue !== newValue || newStyleProp === undefined) {
            if (isFacet(oldValue)) {
              styleUnsubscribers.get(key)?.()
            }
          }
        }
      }

      if (newStyleProp !== undefined) {
        for (const key in newStyleProp) {
          const oldValue = oldStyleProp?.[key]
          const newValue = newStyleProp[key]

          if (oldValue !== newValue || oldStyleProp === undefined) {
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

    if (newProps.dangerouslySetInnerHTML !== oldProps.dangerouslySetInnerHTML) {
      if (newProps.dangerouslySetInnerHTML !== undefined) {
        element.innerHTML = newProps.dangerouslySetInnerHTML.__html
      } else {
        element.innerHTML = ''
      }
    }

    if (newProps.autoPlay !== oldProps.autoPlay) {
      instance.autoPlay?.()

      if (newProps.autoPlay === undefined) {
        element.removeAttribute('autoplay')
      } else {
        instance.autoPlay = setupAttributeUpdate('autoplay', newProps.autoPlay, element)
      }
    }

    if (newProps.className !== oldProps.className) {
      instance.className?.()

      if (newProps.className === undefined) {
        element.className = ''
      } else {
        instance.className = setupClassUpdate(newProps.className, element)
      }
    }

    if (newProps.d !== oldProps.d) {
      instance.d?.()

      if (newProps.d === undefined) {
        element.removeAttribute('d')
      } else {
        instance.d = setupAttributeUpdate('d', newProps.d, element)
      }
    }

    if (newProps['data-droppable'] !== oldProps['data-droppable']) {
      instance['data-droppable']?.()

      if (newProps['data-droppable'] === undefined) {
        element.removeAttribute('data-droppable')
      } else {
        instance['data-droppable'] = setupAttributeUpdate('data-droppable', newProps['data-droppable'], element)
      }
    }

    if (newProps['data-narrate'] !== oldProps['data-narrate']) {
      instance['data-narrate']?.()

      if (newProps['data-narrate'] === undefined) {
        element.removeAttribute('data-narrate')
      } else {
        instance['data-narrate'] = setupAttributeUpdate('data-narrate', newProps['data-narrate'], element)
      }
    }

    if (newProps['data-narrate-as'] !== oldProps['data-narrate-as']) {
      instance['data-narrate-as']?.()

      if (newProps['data-narrate-as'] === undefined) {
        element.removeAttribute('data-narrate-as')
      } else {
        instance['data-narrate-as'] = setupAttributeUpdate('data-narrate-as', newProps['data-narrate-as'], element)
      }
    }

    if (newProps['data-narrate-after'] !== oldProps['data-narrate-after']) {
      instance['data-narrate-after']?.()

      if (newProps['data-narrate-after'] === undefined) {
        element.removeAttribute('data-narrate-after')
      } else {
        instance['data-narrate-after'] = setupAttributeUpdate(
          'data-narrate-after',
          newProps['data-narrate-after'],
          element,
        )
      }
    }

    if (newProps['data-narrate-before'] !== oldProps['data-narrate-before']) {
      instance['data-narrate-before']?.()

      if (newProps['data-narrate-before'] === undefined) {
        element.removeAttribute('data-narrate-before')
      } else {
        instance['data-narrate-before'] = setupAttributeUpdate(
          'data-narrate-before',
          newProps['data-narrate-before'],
          element,
        )
      }
    }

    if (newProps['data-testid'] !== oldProps['data-testid']) {
      instance['data-testid']?.()

      if (newProps['data-testid'] === undefined) {
        element.removeAttribute('data-testid')
      } else {
        instance['data-testid'] = setupAttributeUpdate('data-testid', newProps['data-testid'], element)
      }
    }

    if (newProps['data-x-ray'] !== oldProps['data-x-ray']) {
      instance['data-x-ray']?.()

      if (newProps['data-x-ray'] === undefined) {
        element.removeAttribute('data-x-ray')
      } else {
        instance['data-x-ray'] = setupAttributeUpdate('data-x-ray', newProps['data-x-ray'], element)
      }
    }

    if (newProps.fill !== oldProps.fill) {
      instance.fill?.()

      if (newProps.fill === undefined) {
        element.removeAttribute('fill')
      } else {
        instance.fill = setupAttributeUpdate('fill', newProps.fill, element)
      }
    }

    if (newProps.id !== oldProps.id) {
      instance.id?.()

      if (newProps.id === undefined) {
        element.id = ''
      } else {
        instance.id = setupIdUpdate(newProps.id, element)
      }
    }

    if (newProps.loop !== oldProps.loop) {
      instance.loop?.()

      if (newProps.loop === undefined) {
        element.removeAttribute('loop')
      } else {
        instance.loop = setupAttributeUpdate('loop', newProps.loop, element)
      }
    }

    if (newProps.href !== oldProps.href) {
      instance.href?.()

      if (newProps.href === undefined) {
        element.removeAttribute('href')
      } else {
        instance.href = setupAttributeUpdate('href', newProps.href, element)
      }
    }

    if (newProps.target !== oldProps.target) {
      instance.target?.()

      if (newProps.target === undefined) {
        element.removeAttribute('target')
      } else {
        instance.target = setupAttributeUpdate('target', newProps.target, element)
      }
    }

    if (newProps.disabled !== oldProps.disabled) {
      instance.disabled?.()

      if (newProps.disabled === undefined) {
        element.removeAttribute('disabled')
      } else {
        instance.disabled = setupAttributeUpdate('disabled', newProps.disabled, element)
      }
    }

    if (newProps.height !== oldProps.height) {
      instance.height?.()

      if (newProps.height === undefined) {
        element.removeAttribute('height')
      } else {
        instance.height = setupAttributeUpdate('height', newProps.height, element)
      }
    }

    if (newProps.maxLength !== oldProps.maxLength) {
      instance.maxLength?.()

      if (newProps.maxLength === undefined) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('maxlength')
      } else {
        instance.maxLength = setupMaxLengthUpdate(newProps.maxLength, element)
      }
    }

    if (newProps.rows !== oldProps.rows) {
      instance.rows?.()

      if (newProps.rows === undefined) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('rows')
      } else {
        instance.rows = setupRowsUpdate(newProps.rows, element)
      }
    }

    if (newProps.stroke !== oldProps.stroke) {
      instance.stroke?.()

      if (newProps.stroke === undefined) {
        element.removeAttribute('stroke')
      } else {
        instance.stroke = setupAttributeUpdate('stroke', newProps.stroke, element)
      }
    }

    if (newProps.type !== oldProps.type) {
      instance.type?.()

      if (newProps.type === undefined) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('type')
      } else {
        instance.type = setupAttributeUpdate('type', newProps.type, element)
      }
    }

    if (newProps.value !== oldProps.value) {
      instance.value?.()

      if (newProps.value === undefined) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('value')
      } else {
        instance.value = setupValueUpdate(newProps.value, element)
      }
    }

    if (newProps.x !== oldProps.x) {
      instance.x?.()

      if (newProps.x === undefined) {
        element.removeAttribute('x')
      } else {
        instance.x = setupAttributeUpdate('x', newProps.x, element)
      }
    }

    if (newProps.width !== oldProps.width) {
      instance.width?.()

      if (newProps.width === undefined) {
        element.removeAttribute('width')
      } else {
        instance.width = setupAttributeUpdate('width', newProps.width, element)
      }
    }

    if (newProps.y !== oldProps.y) {
      instance.y?.()

      if (newProps.y === undefined) {
        element.removeAttribute('y')
      } else {
        instance.y = setupAttributeUpdate('y', newProps.y, element)
      }
    }

    if (newProps.cx !== oldProps.cx) {
      instance.cx?.()

      if (newProps.cx === undefined) {
        element.removeAttribute('cx')
      } else {
        instance.cx = setupAttributeUpdate('cx', newProps.cx, element)
      }
    }

    if (newProps.r !== oldProps.r) {
      instance.r?.()

      if (newProps.r === undefined) {
        element.removeAttribute('r')
      } else {
        instance.r = setupAttributeUpdate('r', newProps.r, element)
      }
    }

    if (newProps.cy !== oldProps.cy) {
      instance.cy?.()

      if (newProps.cy === undefined) {
        element.removeAttribute('cy')
      } else {
        instance.cy = setupAttributeUpdate('cy', newProps.cy, element)
      }
    }

    if (newProps.rx !== oldProps.rx) {
      instance.rx?.()

      if (newProps.rx === undefined) {
        element.removeAttribute('rx')
      } else {
        instance.rx = setupAttributeUpdate('rx', newProps.rx, element)
      }
    }

    if (newProps.ry !== oldProps.ry) {
      instance.ry?.()

      if (newProps.ry === undefined) {
        element.removeAttribute('ry')
      } else {
        instance.ry = setupAttributeUpdate('ry', newProps.ry, element)
      }
    }

    if (newProps.x1 !== oldProps.x1) {
      instance.x1?.()

      if (newProps.x1 === undefined) {
        element.removeAttribute('x1')
      } else {
        instance.x1 = setupAttributeUpdate('x1', newProps.x1, element)
      }
    }

    if (newProps.x2 !== oldProps.x2) {
      instance.x2?.()

      if (newProps.x2 === undefined) {
        element.removeAttribute('x2')
      } else {
        instance.x2 = setupAttributeUpdate('x2', newProps.x2, element)
      }
    }

    if (newProps.y1 !== oldProps.y1) {
      instance.y1?.()

      if (newProps.y1 === undefined) {
        element.removeAttribute('y1')
      } else {
        instance.y1 = setupAttributeUpdate('y1', newProps.y1, element)
      }
    }

    if (newProps.y2 !== oldProps.y2) {
      instance.y2?.()

      if (newProps.y2 === undefined) {
        element.removeAttribute('y2')
      } else {
        instance.y2 = setupAttributeUpdate('y2', newProps.y2, element)
      }
    }

    if (newProps.strokeWidth !== oldProps.strokeWidth) {
      instance.strokeWidth?.()

      if (newProps.strokeWidth === undefined) {
        element.removeAttribute('strokeWidth')
      } else {
        instance.strokeWidth = setupAttributeUpdate('stroke-width', newProps.strokeWidth, element)
      }
    }

    if (newProps.viewBox !== oldProps.viewBox) {
      instance.viewBox?.()

      if (newProps.viewBox === undefined) {
        element.removeAttribute('viewBox')
      } else {
        instance.viewBox = setupViewBoxUpdate(newProps.viewBox, element)
      }
    }

    if (newProps.xLinkHref !== oldProps.xLinkHref) {
      instance.xLinkHref?.()

      if (newProps.xLinkHref === undefined) {
        element.removeAttribute('xlink:href')
      } else {
        instance.xLinkHref = setupAttributeUpdate('xlink:href', newProps.xLinkHref, element)
      }
    }

    if (newProps.fillOpacity !== oldProps.fillOpacity) {
      instance.fillOpacity?.()

      if (newProps.fillOpacity === undefined) {
        element.removeAttribute('fill-opacity')
      } else {
        instance.fillOpacity = setupAttributeUpdate('fill-opacity', newProps.fillOpacity, element)
      }
    }

    if (newProps.strokeOpacity !== oldProps.strokeOpacity) {
      instance.strokeOpacity?.()

      if (newProps.strokeOpacity === undefined) {
        element.removeAttribute('stroke-opacity')
      } else {
        instance.strokeOpacity = setupAttributeUpdate('stroke-opacity', newProps.strokeOpacity, element)
      }
    }

    if (newProps.strokeLinecap !== oldProps.strokeLinecap) {
      instance.strokeLinecap?.()

      if (newProps.strokeLinecap === undefined) {
        element.removeAttribute('stroke-linecap')
      } else {
        instance.strokeLinecap = setupAttributeUpdate('stroke-linecap', newProps.strokeLinecap, element)
      }
    }

    if (newProps.strokeLinejoin !== oldProps.strokeLinejoin) {
      instance.strokeLinejoin?.()

      if (newProps.strokeLinejoin === undefined) {
        element.removeAttribute('stroke-linejoin')
      } else {
        instance.strokeLinejoin = setupAttributeUpdate('stroke-linejoin', newProps.strokeLinejoin, element)
      }
    }

    if (newProps.points !== oldProps.points) {
      instance.points?.()
      if (newProps.points === undefined) {
        element.removeAttribute('points')
      } else {
        instance.points = setupAttributeUpdate('points', newProps.points, element)
      }
    }

    if (newProps.offset !== oldProps.offset) {
      instance.offset?.()
      if (newProps.offset === undefined) {
        element.removeAttribute('offset')
      } else {
        instance.offset = setupAttributeUpdate('offset', newProps.offset, element)
      }
    }

    if (newProps.stopColor !== oldProps.stopColor) {
      instance.stopColor?.()
      if (newProps.stopColor === undefined) {
        element.removeAttribute('stop-color')
      } else {
        instance.stopColor = setupAttributeUpdate('stop-color', newProps.stopColor, element)
      }
    }

    if (newProps.stopOpacity !== oldProps.stopOpacity) {
      instance.stopOpacity?.()
      if (newProps.stopOpacity === undefined) {
        element.removeAttribute('stop-opacity')
      } else {
        instance.stopOpacity = setupAttributeUpdate('stop-opacity', newProps.stopOpacity, element)
      }
    }

    if (newProps.fontFamily !== oldProps.fontFamily) {
      instance.fontFamily?.()
      if (newProps.fontFamily === undefined) {
        element.removeAttribute('font-family')
      } else {
        instance.fontFamily = setupAttributeUpdate('font-family', newProps.fontFamily, element)
      }
    }

    if (newProps.fontSize !== oldProps.fontSize) {
      instance.fontSize?.()
      if (newProps.fontSize === undefined) {
        element.removeAttribute('font-size')
      } else {
        instance.fontSize = setupAttributeUpdate('font-size', newProps.fontSize, element)
      }
    }

    if (newProps.src !== oldProps.src) {
      instance.src?.()

      if (newProps.src === undefined) {
        const textElement = element as HTMLTextAreaElement
        textElement.removeAttribute('src')
      } else {
        instance.src = setupSrcUpdate(newProps.src, element)
      }
    }

    if (newProps.cohinline !== oldProps.cohinline) {
      instance.cohinline?.()

      if (newProps.cohinline === undefined) {
        element.removeAttribute('cohinline')
      } else {
        instance.cohinline = setupAttributeUpdate('cohinline', newProps.cohinline, element)
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

    if (newProps.onMouseMove !== oldProps.onMouseMove) {
      if (oldProps.onMouseMove) element.removeEventListener('mousemove', oldProps.onMouseMove)
      if (newProps.onMouseMove) element.addEventListener('mousemove', newProps.onMouseMove)
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
      cleanupElementContainer(parentInstance, child)
    }

    parentInstance.element.removeChild(child.element)
  },

  insertInContainerBefore: function (container, child, beforeChild) {
    container.element.insertBefore(child.element, beforeChild.element)
  },

  removeChildFromContainer: function (container, child) {
    if (isElementContainer(child)) {
      cleanupElementContainer(container, child)
    }

    container.element.removeChild(child.element)
  },

  resetTextContent: function (instance) {
    instance.element.textContent = ''
  },

  getPublicInstance: function (instance) {
    return instance.element
  },
  hideInstance(instance) {
    if (isTextElement(instance.element)) {
      // Stop listening for updates
      if (instance.text) {
        instance.text()
      }

      instance.element.nodeValue = ''
      return
    }

    // Stop listening for style changes
    instance.styleUnsubscribers?.forEach((unsubscribe) => unsubscribe())
    instance.styleUnsubscribers?.clear()

    // Hide
    instance.element.style.display = 'none'
  },
  unhideInstance(instance, props) {
    if (isTextElement(instance.element)) {
      instance.text = setupTextUpdate(props.text, instance.element)
      return
    }

    if (props.style != null) {
      setupStyleUpdate(
        props.style,
        (instance.style ?? instance.element.style) as unknown as Record<string, unknown>,
        instance.styleUnsubscribers as Map<string | number, Unsubscribe>,
      )
    } else {
      instance.element.style.display = ''
    }
  },
})

export const isTextElement = (value: HTMLElement | SVGElement | Text): value is Text => {
  return (value as HTMLElement).style == null
}

const cleanupElementContainer = (parent: ElementContainer, instance: ElementContainer) => {
  parent.children.delete(instance)

  instance.styleUnsubscribers?.forEach((unsubscribe) => unsubscribe())
  instance.styleUnsubscribers?.clear()

  instance.children.forEach(cleanupElementContainer)
  instance.children.clear()

  instance.className?.()
  instance['data-droppable']?.()
  instance['data-narrate']?.()
  instance['data-narrate-as']?.()
  instance['data-narrate-after']?.()
  instance['data-narrate-before']?.()
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

const fastTypeMapHTML: Record<TypeHTML, keyof HTMLElementTagNameMap> = {
  'fast-a': 'a',
  'fast-div': 'div',
  'fast-p': 'p',
  'fast-img': 'img',
  'fast-input': 'input',
  'fast-span': 'span',
  'fast-textarea': 'textarea',

  'fast-text': 'span',
  a: 'a',
  div: 'div',
  p: 'p',
  img: 'img',
  textarea: 'textarea',
  input: 'input',
  style: 'style',
}

const fastTypeMapSVG: Record<TypeSVG, keyof SVGElementTagNameMap> = {
  'fast-circle': 'circle',
  'fast-ellipse': 'ellipse',
  'fast-line': 'line',
  'fast-path': 'path',
  'fast-rect': 'rect',
  'fast-svg': 'svg',
  'fast-use': 'use',
  'fast-polyline': 'polyline',
  'fast-polygon': 'polygon',
  'fast-linearGradient': 'linearGradient',
  'fast-radialGradient': 'radialGradient',
  'fast-stop': 'stop',
  'fast-svg-text': 'text',
  'fast-pattern': 'pattern',

  circle: 'circle',
  ellipse: 'ellipse',
  line: 'line',
  path: 'path',
  rect: 'rect',
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
