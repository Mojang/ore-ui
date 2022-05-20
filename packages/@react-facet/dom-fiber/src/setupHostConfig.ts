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
import { FacetProp, isFacet, Unsubscribe } from '@react-facet/core'

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

const setupClassUpdate = (className: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(className)) {
    return className.observe((className) => {
      element.className = className ?? ''
    })
  } else {
    element.className = className ?? ''
  }
}

const setupIdUpdate = (id: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(id)) {
    return id.observe((id) => {
      element.id = id ?? ''
    })
  } else {
    element.id = id ?? ''
  }
}

/**
 * The React prop is called autoPlay (capital P) while the DOM
 * attribute is all lowercase (i.e. autoplay), so we handle that here.
 */
const setupAutoPlayUpdate = (autoPlay: FacetProp<boolean | undefined>, element: HTMLElement) => {
  if (isFacet(autoPlay)) {
    return autoPlay.observe((autoPlay) => {
      if (autoPlay) {
        element.setAttribute('autoplay', '')
      } else {
        element.removeAttribute('autoplay')
      }
    })
  } else {
    if (autoPlay) {
      element.setAttribute('autoplay', '')
    } else {
      element.removeAttribute('autoplay')
    }
  }
}

const setupDUpdate = (d: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(d)) {
    return d.observe((d) => {
      if (d != null) {
        element.setAttribute('d', d)
      } else {
        element.removeAttribute('d')
      }
    })
  } else {
    if (d != null) {
      element.setAttribute('d', d)
    } else {
      element.removeAttribute('d')
    }
  }
}

const setupDataDroppableUpdate = (dataDroppable: FacetProp<boolean | undefined>, element: HTMLElement) => {
  if (isFacet(dataDroppable)) {
    return dataDroppable.observe((dataDroppable) => {
      if (dataDroppable) {
        element.setAttribute('data-droppable', '')
      } else {
        element.removeAttribute('data-droppable')
      }
    })
  } else {
    if (dataDroppable) {
      element.setAttribute('data-droppable', '')
    } else {
      element.removeAttribute('data-droppable')
    }
  }
}

const setupDataTestidUpdate = (dataTestid: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(dataTestid)) {
    return dataTestid.observe((dataTestid) => {
      if (dataTestid != null) {
        element.setAttribute('data-testid', dataTestid)
      } else {
        element.removeAttribute('data-testid')
      }
    })
  } else {
    if (dataTestid != null) {
      element.setAttribute('data-testid', dataTestid)
    } else {
      element.removeAttribute('data-testid')
    }
  }
}

const setupDataXRayUpdate = (dataXRay: FacetProp<boolean | undefined>, element: HTMLElement) => {
  if (isFacet(dataXRay)) {
    return dataXRay.observe((dataXRay) => {
      if (dataXRay) {
        element.setAttribute('data-x-ray', '')
      } else {
        element.removeAttribute('data-x-ray')
      }
    })
  } else {
    if (dataXRay) {
      element.setAttribute('data-x-ray', '')
    } else {
      element.removeAttribute('data-x-ray')
    }
  }
}

const setupFillUpdate = (fill: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(fill)) {
    return fill.observe((fill) => {
      if (fill != null) {
        element.setAttribute('fill', fill)
      } else {
        element.removeAttribute('fill')
      }
    })
  } else {
    if (fill != null) {
      element.setAttribute('fill', fill)
    } else {
      element.removeAttribute('fill')
    }
  }
}

const setupLoopUpdate = (loop: FacetProp<boolean | undefined>, element: HTMLElement) => {
  if (isFacet(loop)) {
    return loop.observe((loop) => {
      if (loop) {
        element.setAttribute('loop', '')
      } else {
        element.removeAttribute('loop')
      }
    })
  } else {
    if (loop) {
      element.setAttribute('loop', '')
    } else {
      element.removeAttribute('loop')
    }
  }
}

const setupHrefUpdate = (href: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(href)) {
    return href.observe((href) => {
      if (href != null) {
        element.setAttribute('href', href)
      } else {
        element.removeAttribute('href')
      }
    })
  } else {
    if (href != null) {
      element.setAttribute('href', href)
    } else {
      element.removeAttribute('href')
    }
  }
}

const setupTargetUpdate = (target: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(target)) {
    return target.observe((target) => {
      if (target != null) {
        element.setAttribute('target', target)
      } else {
        element.removeAttribute('target')
      }
    })
  } else {
    if (target != null) {
      element.setAttribute('target', target)
    } else {
      element.removeAttribute('target')
    }
  }
}

const setupDisabledUpdate = (disabled: FacetProp<boolean | undefined>, element: HTMLElement) => {
  if (isFacet(disabled)) {
    return disabled.observe((disabled) => {
      if (disabled) {
        element.setAttribute('disabled', '')
      } else {
        element.removeAttribute('disabled')
      }
    })
  } else {
    if (disabled) {
      element.setAttribute('disabled', '')
    } else {
      element.removeAttribute('disabled')
    }
  }
}

const setupMaxLengthUpdate = (maxLength: FacetProp<number | undefined>, element: HTMLElement) => {
  if (isFacet(maxLength)) {
    return maxLength.observe((maxLength) => {
      const textElement = element as HTMLTextAreaElement
      textElement.maxLength = maxLength ?? Number.MAX_SAFE_INTEGER
    })
  } else {
    const textElement = element as HTMLTextAreaElement
    textElement.maxLength = maxLength ?? Number.MAX_SAFE_INTEGER
  }
}

const setupRowsUpdate = (rows: FacetProp<number | undefined>, element: HTMLElement) => {
  if (isFacet(rows)) {
    return rows.observe((rows) => {
      const textElement = element as HTMLTextAreaElement
      textElement.rows = rows ?? Number.MAX_SAFE_INTEGER
    })
  } else {
    const textElement = element as HTMLTextAreaElement
    textElement.rows = rows ?? Number.MAX_SAFE_INTEGER
  }
}

const setupTypeUpdate = (type: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(type)) {
    return type.observe((type) => {
      if (type != null) {
        element.setAttribute('type', type)
      } else {
        element.removeAttribute('type')
      }
    })
  } else {
    if (type != null) {
      element.setAttribute('type', type)
    } else {
      element.removeAttribute('type')
    }
  }
}

/**
 * The value attribute seems to behave differently to other
 * attributes. When using `setAttribute`, browsers and gameface
 * don't always update the element to have what's in the value,
 * so we need to set the `value` attribute directly to solve this.
 * ref: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMInput.js
 */
const setupValueUpdate = (value: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(value)) {
    return value.observe((value) => {
      const inputElement = element as HTMLInputElement
      inputElement.value = value ?? ''

      if (value != null) {
        inputElement.setAttribute('value', value)
      } else {
        inputElement.removeAttribute('value')
      }
    })
  } else {
    const inputElement = element as HTMLInputElement
    inputElement.value = value ?? ''

    if (value != null) {
      inputElement.setAttribute('value', value)
    } else {
      inputElement.removeAttribute('value')
    }
  }
}

const setupSrcUpdate = (src: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(src)) {
    return src.observe((src) => {
      const textElement = element as HTMLImageElement
      textElement.src = src ?? ''
    })
  } else {
    const textElement = element as HTMLImageElement
    textElement.src = src ?? ''
  }
}

const setupTextUpdate = (text: FacetProp<string | number | undefined>, element: Text) => {
  if (isFacet(text)) {
    return text.observe((text) => {
      const textElement = element as Text
      textElement.nodeValue = (text ?? '') as string
    })
  } else {
    const textElement = element as Text
    textElement.nodeValue = (text ?? '') as string
  }
}

const noop = () => {}

const EMPTY = {}

const fastTypeMap: Record<Type, keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap> = {
  'fast-a': 'a',
  'fast-div': 'div',
  'fast-p': 'p',
  'fast-path': 'path',
  'fast-img': 'img',
  'fast-textarea': 'textarea',
  'fast-input': 'input',
  'fast-span': 'span',

  // TODO: fix weird map
  'fast-text': 'span',
  a: 'a',
  div: 'div',
  p: 'p',
  path: 'path',
  img: 'img',
  textarea: 'textarea',
  input: 'input',
  style: 'style',
}
