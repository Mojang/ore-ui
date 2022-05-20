import { FacetProp, isFacet } from '@react-facet/core'

export const setupClassUpdate = (className: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(className)) {
    return className.observe((className) => {
      element.className = className ?? ''
    })
  } else {
    element.className = className ?? ''
  }
}

export const setupIdUpdate = (id: FacetProp<string | undefined>, element: HTMLElement) => {
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
export const setupAutoPlayUpdate = (autoPlay: FacetProp<boolean | undefined>, element: HTMLElement) => {
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

export const setupDUpdate = (d: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupDataDroppableUpdate = (dataDroppable: FacetProp<boolean | undefined>, element: HTMLElement) => {
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

export const setupDataTestidUpdate = (dataTestid: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupDataXRayUpdate = (dataXRay: FacetProp<boolean | undefined>, element: HTMLElement) => {
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

export const setupFillUpdate = (fill: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupLoopUpdate = (loop: FacetProp<boolean | undefined>, element: HTMLElement) => {
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

export const setupHrefUpdate = (href: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupHeightUpdate = (height: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(height)) {
    return height.observe((height) => {
      if (height != null) {
        element.setAttribute('height', height)
      } else {
        element.removeAttribute('height')
      }
    })
  } else {
    if (height != null) {
      element.setAttribute('height', height)
    } else {
      element.removeAttribute('height')
    }
  }
}

export const setupTargetUpdate = (target: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupDisabledUpdate = (disabled: FacetProp<boolean | undefined>, element: HTMLElement) => {
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

export const setupMaxLengthUpdate = (maxLength: FacetProp<number | undefined>, element: HTMLElement) => {
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

export const setupRowsUpdate = (rows: FacetProp<number | undefined>, element: HTMLElement) => {
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

export const setupTypeUpdate = (type: FacetProp<string | undefined>, element: HTMLElement) => {
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
export const setupValueUpdate = (value: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupSrcUpdate = (src: FacetProp<string | undefined>, element: HTMLElement) => {
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

export const setupStrokeUpdate = (stroke: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(stroke)) {
    return stroke.observe((stroke) => {
      if (stroke != null) {
        element.setAttribute('stroke', stroke)
      } else {
        element.removeAttribute('stroke')
      }
    })
  } else {
    if (stroke != null) {
      element.setAttribute('stroke', stroke)
    } else {
      element.removeAttribute('stroke')
    }
  }
}

export const setupTextUpdate = (text: FacetProp<string | number | undefined>, element: Text) => {
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

export const setupXUpdate = (x: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(x)) {
    return x.observe((x) => {
      if (x != null) {
        element.setAttribute('x', x)
      } else {
        element.removeAttribute('x')
      }
    })
  } else {
    if (x != null) {
      element.setAttribute('x', x)
    } else {
      element.removeAttribute('x')
    }
  }
}

export const setupWidthUpdate = (width: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(width)) {
    return width.observe((width) => {
      if (width != null) {
        element.setAttribute('width', width)
      } else {
        element.removeAttribute('width')
      }
    })
  } else {
    if (width != null) {
      element.setAttribute('width', width)
    } else {
      element.removeAttribute('width')
    }
  }
}

export const setupYUpdate = (y: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(y)) {
    return y.observe((y) => {
      if (y != null) {
        element.setAttribute('y', y)
      } else {
        element.removeAttribute('y')
      }
    })
  } else {
    if (y != null) {
      element.setAttribute('y', y)
    } else {
      element.removeAttribute('y')
    }
  }
}

export const setupCxUpdate = (cx: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(cx)) {
    return cx.observe((cx) => {
      if (cx != null) {
        element.setAttribute('cx', cx)
      } else {
        element.removeAttribute('cx')
      }
    })
  } else {
    if (cx != null) {
      element.setAttribute('cx', cx)
    } else {
      element.removeAttribute('cx')
    }
  }
}

export const setupCyUpdate = (cy: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(cy)) {
    return cy.observe((cy) => {
      if (cy != null) {
        element.setAttribute('cy', cy)
      } else {
        element.removeAttribute('cy')
      }
    })
  } else {
    if (cy != null) {
      element.setAttribute('cy', cy)
    } else {
      element.removeAttribute('cy')
    }
  }
}

export const setupRUpdate = (r: FacetProp<string | undefined>, element: HTMLElement) => {
  if (isFacet(r)) {
    return r.observe((r) => {
      if (r != null) {
        element.setAttribute('r', r)
      } else {
        element.removeAttribute('r')
      }
    })
  } else {
    if (r != null) {
      element.setAttribute('r', r)
    } else {
      element.removeAttribute('r')
    }
  }
}
