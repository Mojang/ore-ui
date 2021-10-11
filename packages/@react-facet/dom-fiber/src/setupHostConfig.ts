import {
  Props,
  Type,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  NoTimeout,
  ValidPropsNames,
} from './types'
import { HostConfig } from 'react-reconciler'
import { FacetProp, isFacet, Unsubscribe } from '@react-facet/core'

const noop = () => {}

const EMPTY = {}

const mapKeys = <T extends Record<string, unknown>, V>(x: T, callback: (v: keyof T) => V): V[] => {
  const a = []
  let b: keyof T
  for (b in x) {
    a.push(callback(b))
  }
  return a
}

const fastTypeMap: Record<Type, keyof HTMLElementTagNameMap> = {
  'fast-a': 'a',
  'fast-div': 'div',
  'fast-p': 'p',
  'fast-img': 'img',
  'fast-textarea': 'textarea',
  'fast-input': 'input',
  'fast-span': 'span',

  // TODO: fix weird map
  'fast-text': 'span',
  a: 'a',
  div: 'div',
  p: 'p',
  img: 'img',
  textarea: 'textarea',
  input: 'input',
  style: 'style',
}

/**
 * Custom React Renderer created for Gameface
 *
 * based on https://blog.atulr.com/react-custom-renderer-1/
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
> => {
  const setupClassUpdate = (
    className: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(className)) {
      unsubscribers.set(
        'className',
        className.observe((className) => {
          element.className = className ?? ''
        }),
      )
    } else {
      element.className = className ?? ''
    }
  }

  /**
   * The React prop is called autoPlay (capital P) while the DOM
   * attribute is all lowercase (i.e. autoplay), so we handle that here.
   */
  const setupAutoPlayUpdate = (
    autoPlay: FacetProp<boolean | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(autoPlay)) {
      unsubscribers.set(
        'autoPlay',
        autoPlay.observe((autoPlay) => {
          if (autoPlay) {
            element.setAttribute('autoplay', '')
          } else {
            element.removeAttribute('autoplay')
          }
        }),
      )
    } else {
      if (autoPlay) {
        element.setAttribute('autoplay', '')
      } else {
        element.removeAttribute('autoplay')
      }
    }
  }

  const setupDataDroppableUpdate = (
    dataDroppable: FacetProp<boolean | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(dataDroppable)) {
      unsubscribers.set(
        'data-droppable',
        dataDroppable.observe((dataDroppable) => {
          if (dataDroppable) {
            element.setAttribute('data-droppable', '')
          } else {
            element.removeAttribute('data-droppable')
          }
        }),
      )
    } else {
      if (dataDroppable) {
        element.setAttribute('data-droppable', '')
      } else {
        element.removeAttribute('data-droppable')
      }
    }
  }

  const setupDataTestidUpdate = (
    dataTestid: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(dataTestid)) {
      unsubscribers.set(
        'data-testid',
        dataTestid.observe((dataTestid) => {
          if (dataTestid != null) {
            element.setAttribute('data-testid', dataTestid)
          } else {
            element.removeAttribute('data-testid')
          }
        }),
      )
    } else {
      if (dataTestid != null) {
        element.setAttribute('data-testid', dataTestid)
      } else {
        element.removeAttribute('data-testid')
      }
    }
  }

  const setupDataXRayUpdate = (
    dataXRay: FacetProp<boolean | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(dataXRay)) {
      unsubscribers.set(
        'data-x-ray',
        dataXRay.observe((dataXRay) => {
          if (dataXRay) {
            element.setAttribute('data-x-ray', '')
          } else {
            element.removeAttribute('data-x-ray')
          }
        }),
      )
    } else {
      if (dataXRay) {
        element.setAttribute('data-x-ray', '')
      } else {
        element.removeAttribute('data-x-ray')
      }
    }
  }

  const setupLoopUpdate = (
    loop: FacetProp<boolean | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(loop)) {
      unsubscribers.set(
        'loop',
        loop.observe((loop) => {
          if (loop) {
            element.setAttribute('loop', '')
          } else {
            element.removeAttribute('loop')
          }
        }),
      )
    } else {
      if (loop) {
        element.setAttribute('loop', '')
      } else {
        element.removeAttribute('loop')
      }
    }
  }

  const setupHrefUpdate = (
    href: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(href)) {
      unsubscribers.set(
        'href',
        href.observe((href) => {
          if (href != null) {
            element.setAttribute('href', href)
          } else {
            element.removeAttribute('href')
          }
        }),
      )
    } else {
      if (href != null) {
        element.setAttribute('href', href)
      } else {
        element.removeAttribute('href')
      }
    }
  }

  const setupTargetUpdate = (
    target: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(target)) {
      unsubscribers.set(
        'target',
        target.observe((target) => {
          if (target != null) {
            element.setAttribute('target', target)
          } else {
            element.removeAttribute('target')
          }
        }),
      )
    } else {
      if (target != null) {
        element.setAttribute('target', target)
      } else {
        element.removeAttribute('target')
      }
    }
  }

  const setupDisabledUpdate = (
    disabled: FacetProp<boolean | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(disabled)) {
      unsubscribers.set(
        'disabled',
        disabled.observe((disabled) => {
          if (disabled) {
            element.setAttribute('disabled', '')
          } else {
            element.removeAttribute('disabled')
          }
        }),
      )
    } else {
      if (disabled) {
        element.setAttribute('disabled', '')
      } else {
        element.removeAttribute('disabled')
      }
    }
  }

  const setupMaxLengthUpdate = (
    maxLength: FacetProp<number | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(maxLength)) {
      unsubscribers.set(
        'maxLength',
        maxLength.observe((maxLength) => {
          const textElement = element as HTMLTextAreaElement
          textElement.maxLength = maxLength ?? Number.MAX_SAFE_INTEGER
        }),
      )
    } else {
      const textElement = element as HTMLTextAreaElement
      textElement.maxLength = maxLength ?? Number.MAX_SAFE_INTEGER
    }
  }

  const setupRowsUpdate = (
    rows: FacetProp<number | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(rows)) {
      unsubscribers.set(
        'rows',
        rows.observe((rows) => {
          const textElement = element as HTMLTextAreaElement
          textElement.rows = rows ?? Number.MAX_SAFE_INTEGER
        }),
      )
    } else {
      const textElement = element as HTMLTextAreaElement
      textElement.rows = rows ?? Number.MAX_SAFE_INTEGER
    }
  }

  const setupTypeUpdate = (
    type: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(type)) {
      unsubscribers.set(
        'type',
        type.observe((type) => {
          if (type != null) {
            element.setAttribute('type', type)
          } else {
            element.removeAttribute('type')
          }
        }),
      )
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
  const setupValueUpdate = (
    value: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(value)) {
      unsubscribers.set(
        'value',
        value.observe((value) => {
          const inputElement = element as HTMLInputElement
          inputElement.value = value ?? ''

          if (value != null) {
            inputElement.setAttribute('value', value)
          } else {
            inputElement.removeAttribute('value')
          }
        }),
      )
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

  const setupSrcUpdate = (
    src: FacetProp<string | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: HTMLElement,
  ) => {
    if (isFacet(src)) {
      unsubscribers.set(
        'src',
        src.observe((src) => {
          const textElement = element as HTMLImageElement
          textElement.src = src ?? ''
        }),
      )
    } else {
      const textElement = element as HTMLImageElement
      textElement.src = src ?? ''
    }
  }

  const setupTextUpdate = (
    text: FacetProp<string | number | undefined>,
    unsubscribers: Map<ValidPropsNames, Unsubscribe>,
    element: Text,
  ) => {
    if (isFacet(text)) {
      unsubscribers.set(
        'text',
        text.observe((text) => {
          const textElement = element as Text
          textElement.nodeValue = (text ?? '') as string
        }),
      )
    } else {
      const textElement = element as Text
      textElement.nodeValue = (text ?? '') as string
    }
  }

  return {
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
      typeof window !== 'undefined'
        ? window.clearTimeout
        : (id) => window.clearTimeout(id as unknown as NodeJS.Timeout),

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
        unsubscribers: new Map(),
      }
    },
    createInstance: function (externalType, newProps) {
      const unsubscribers = new Map()
      const styleUnsubscribers = new Map()

      if (externalType === 'fast-text') {
        const element = document.createTextNode('')

        setupTextUpdate(newProps.text, unsubscribers, element)

        return {
          element,
          unsubscribers,
          styleUnsubscribers,
        }
      }

      const type = fastTypeMap[externalType] ?? externalType
      const element = document.createElement(type)

      const style = newProps.style != null ? element.style : undefined

      if (newProps.style != null) {
        // We know for sure here that style will never be null (we created it above)
        const notNullStyle = style as unknown as Record<string, unknown>

        mapKeys(newProps.style, (key) => {
          const value = newProps.style?.[key]
          if (value != null) {
            if (isFacet(value)) {
              styleUnsubscribers.set(
                key,
                value.observe((value) => {
                  notNullStyle[key] = value
                }),
              )
            } else {
              notNullStyle[key] = value
            }
          }
        })
      }

      if (newProps.dangerouslySetInnerHTML != null) {
        element.innerHTML = newProps.dangerouslySetInnerHTML.__html
      }

      if (newProps.className != null) {
        setupClassUpdate(newProps.className, unsubscribers, element)
      }

      if (newProps.autoPlay != null) {
        setupAutoPlayUpdate(newProps.autoPlay, unsubscribers, element)
      }

      if (newProps['data-droppable'] != null) {
        setupDataDroppableUpdate(newProps['data-droppable'], unsubscribers, element)
      }

      if (newProps['data-testid'] != null) {
        setupDataTestidUpdate(newProps['data-testid'], unsubscribers, element)
      }

      if (newProps['data-x-ray'] != null) {
        setupDataXRayUpdate(newProps['data-x-ray'], unsubscribers, element)
      }

      if (newProps.loop != null) {
        setupLoopUpdate(newProps.loop, unsubscribers, element)
      }

      if (newProps.href != null) {
        setupHrefUpdate(newProps.href, unsubscribers, element)
      }

      if (newProps.target != null) {
        setupTargetUpdate(newProps.target, unsubscribers, element)
      }

      if (newProps.disabled != null) {
        setupDisabledUpdate(newProps.disabled, unsubscribers, element)
      }

      if (newProps.maxLength != null) {
        setupMaxLengthUpdate(newProps.maxLength, unsubscribers, element)
      }

      if (newProps.rows != null) {
        setupRowsUpdate(newProps.rows, unsubscribers, element)
      }

      if (newProps.type != null) {
        setupTypeUpdate(newProps.type, unsubscribers, element)
      }

      if (newProps.value != null) {
        setupValueUpdate(newProps.value, unsubscribers, element)
      }

      if (newProps.src != null) {
        setupSrcUpdate(newProps.src, unsubscribers, element)
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
        unsubscribers,
        styleUnsubscribers,
        style,
      }
    },
    appendInitialChild: function (parent, child) {
      if (parent.element == null || child.element == null) return

      parent.element.appendChild(child.element)
    },
    finalizeInitialChildren: function () {
      return false
    },
    prepareForCommit: function () {},
    resetAfterCommit: function () {},
    commitMount: function () {},
    appendChildToContainer: function (parent, child) {
      if (parent.element == null || child.element == null) return

      parent.element.appendChild(child.element)
    },

    prepareUpdate: function () {
      return true
    },
    commitUpdate: function (instance, updatePayload, type, oldProps, newProps) {
      const { element: uncastElement, unsubscribers, styleUnsubscribers } = instance

      if (type === 'fast-text') {
        if (isFacet(oldProps.text)) {
          unsubscribers.get('text')?.()
        }

        setupTextUpdate(newProps.text, unsubscribers, uncastElement as Text)
      }

      const element = uncastElement as HTMLElement

      let style = instance.style

      if (newProps.style !== oldProps.style) {
        // if it is null, we need to get it
        if (style == null) {
          instance.style = element.style
          style = instance.style
        }

        const notNullStyle = style as unknown as Record<string, unknown>

        if (oldProps.style != null) {
          mapKeys(oldProps.style, (key) => {
            const value = oldProps.style?.[key]

            if (newProps.style?.[key] == null || newProps.style?.[key] != value) {
              if (isFacet(value)) {
                styleUnsubscribers.get(key)?.()
              }
            }
          })
        }

        if (newProps.style != null) {
          mapKeys(newProps.style, (key) => {
            const value = newProps.style?.[key]

            if (isFacet(value)) {
              styleUnsubscribers.set(
                key,
                value.observe((value) => {
                  notNullStyle[key] = value
                }),
              )
            } else {
              notNullStyle[key] = value
            }
          })
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
        if (isFacet(oldProps.autoPlay)) {
          unsubscribers.get('autoPlay')?.()
        }

        if (newProps.autoPlay == null) {
          element.removeAttribute('autoplay')
        } else {
          setupAutoPlayUpdate(newProps.autoPlay, unsubscribers, element)
        }
      }

      if (newProps.className !== oldProps.className) {
        if (isFacet(oldProps.className)) {
          unsubscribers.get('className')?.()
        }

        if (newProps.className == null) {
          element.className = ''
        } else {
          setupClassUpdate(newProps.className, unsubscribers, element)
        }
      }

      if (newProps['data-droppable'] !== oldProps['data-droppable']) {
        if (isFacet(oldProps['data-droppable'])) {
          unsubscribers.get('data-droppable')?.()
        }

        if (newProps['data-droppable'] == null) {
          element.removeAttribute('data-droppable')
        } else {
          setupDataDroppableUpdate(newProps['data-droppable'], unsubscribers, element)
        }
      }

      if (newProps['data-testid'] !== oldProps['data-testid']) {
        if (isFacet(oldProps['data-testid'])) {
          unsubscribers.get('data-testid')?.()
        }

        if (newProps['data-testid'] == null) {
          element.removeAttribute('data-testid')
        } else {
          setupDataTestidUpdate(newProps['data-testid'], unsubscribers, element)
        }
      }

      if (newProps['data-x-ray'] !== oldProps['data-x-ray']) {
        if (isFacet(oldProps['data-x-ray'])) {
          unsubscribers.get('data-x-ray')?.()
        }

        if (newProps['data-x-ray'] == null) {
          element.removeAttribute('data-x-ray')
        } else {
          setupDataXRayUpdate(newProps['data-x-ray'], unsubscribers, element)
        }
      }

      if (newProps.loop !== oldProps.loop) {
        if (isFacet(oldProps.loop)) {
          unsubscribers.get('loop')?.()
        }

        if (newProps.loop == null) {
          element.removeAttribute('loop')
        } else {
          setupLoopUpdate(newProps.loop, unsubscribers, element)
        }
      }

      if (newProps.href !== oldProps.href) {
        if (isFacet(oldProps.href)) {
          unsubscribers.get('href')?.()
        }

        if (newProps.href == null) {
          element.removeAttribute('href')
        } else {
          setupHrefUpdate(newProps.href, unsubscribers, element)
        }
      }

      if (newProps.target !== oldProps.target) {
        if (isFacet(oldProps.target)) {
          unsubscribers.get('target')?.()
        }

        if (newProps.target == null) {
          element.removeAttribute('target')
        } else {
          setupTargetUpdate(newProps.target, unsubscribers, element)
        }
      }

      if (newProps.disabled !== oldProps.disabled) {
        if (isFacet(oldProps.disabled)) {
          unsubscribers.get('disabled')?.()
        }

        if (newProps.disabled == null) {
          element.removeAttribute('disabled')
        } else {
          setupDisabledUpdate(newProps.disabled, unsubscribers, element)
        }
      }

      if (newProps.maxLength !== oldProps.maxLength) {
        if (isFacet(oldProps.maxLength)) {
          unsubscribers.get('maxLength')?.()
        }

        if (newProps.maxLength == null) {
          const textElement = element as HTMLTextAreaElement
          textElement.removeAttribute('maxlength')
        } else {
          setupMaxLengthUpdate(newProps.maxLength, unsubscribers, element)
        }
      }

      if (newProps.rows !== oldProps.rows) {
        if (isFacet(oldProps.rows)) {
          unsubscribers.get('rows')?.()
        }

        if (newProps.rows == null) {
          const textElement = element as HTMLTextAreaElement
          textElement.removeAttribute('rows')
        } else {
          setupRowsUpdate(newProps.rows, unsubscribers, element)
        }
      }

      if (newProps.type !== oldProps.type) {
        if (isFacet(oldProps.type)) {
          unsubscribers.get('type')?.()
        }

        if (newProps.type == null) {
          const textElement = element as HTMLTextAreaElement
          textElement.removeAttribute('type')
        } else {
          setupTypeUpdate(newProps.type, unsubscribers, element)
        }
      }

      if (newProps.value !== oldProps.value) {
        if (isFacet(oldProps.value)) {
          unsubscribers.get('value')?.()
        }

        if (newProps.value == null) {
          const textElement = element as HTMLTextAreaElement
          textElement.removeAttribute('value')
        } else {
          setupValueUpdate(newProps.value, unsubscribers, element)
        }
      }

      if (newProps.src !== oldProps.src) {
        if (isFacet(oldProps.src)) {
          unsubscribers.get('src')?.()
        }

        if (newProps.src == null) {
          const textElement = element as HTMLTextAreaElement
          textElement.removeAttribute('src')
        } else {
          setupSrcUpdate(newProps.src, unsubscribers, element)
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
    appendChild: function (parentInstance, child) {
      parentInstance.element.appendChild(child.element)
    },
    insertBefore: function (parentInstance, child, beforeChild) {
      parentInstance.element.insertBefore(child.element, beforeChild.element)
    },
    removeChild: function (parentInstance, child) {
      parentInstance.element.removeChild(child.element)
    },
    insertInContainerBefore: function (container, child, beforeChild) {
      container.element.insertBefore(child.element, beforeChild.element)
    },
    removeChildFromContainer: function (container, child) {
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
  }
}
