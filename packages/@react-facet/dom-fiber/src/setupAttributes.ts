import { FacetProp, isFacet } from '@react-facet/core'

export const setupClassUpdate = (className: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  const htmlElement = element as HTMLElement
  if (isFacet(className)) {
    return className.observe((className) => {
      htmlElement.className = className !== undefined ? className : ''
    })
  } else {
    htmlElement.className = className !== undefined ? className : ''
  }
}

export const setupIdUpdate = (id: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(id)) {
    return id.observe((id) => {
      element.id = id !== undefined ? id : ''
    })
  } else {
    element.id = id !== undefined ? id : ''
  }
}

export const setupMaxLengthUpdate = (maxLength: FacetProp<number | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(maxLength)) {
    return maxLength.observe((maxLength) => {
      const textElement = element as HTMLTextAreaElement
      textElement.maxLength = maxLength !== undefined ? maxLength : Number.MAX_SAFE_INTEGER
    })
  } else {
    const textElement = element as HTMLTextAreaElement
    textElement.maxLength = maxLength !== undefined ? maxLength : Number.MAX_SAFE_INTEGER
  }
}

export const setupRowsUpdate = (rows: FacetProp<number | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(rows)) {
    return rows.observe((rows) => {
      const textElement = element as HTMLTextAreaElement
      textElement.rows = rows !== undefined ? rows : Number.MAX_SAFE_INTEGER
    })
  } else {
    const textElement = element as HTMLTextAreaElement
    textElement.rows = rows !== undefined ? rows : Number.MAX_SAFE_INTEGER
  }
}

/**
 * The value attribute seems to behave differently to other
 * attributes. When using `setAttribute`, browsers and gameface
 * don't always update the element to have what's in the value,
 * so we need to set the `value` attribute directly to solve this.
 * ref: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMInput.js
 */

const updateValue = (element: HTMLElement | SVGElement, value: string | undefined) => {
  const inputElement = element as HTMLInputElement
  // Only accept numerical characters if the input type is number
  if (inputElement.type === 'number' && isNaN(Number(value))) return

  if (value !== undefined) {
    inputElement.value = value
    inputElement.setAttribute('value', value)
  } else {
    inputElement.value = ''
    inputElement.removeAttribute('value')
  }
}

export const setupValueUpdate = (value: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(value)) {
    return value.observe((value) => updateValue(element, value))
  } else {
    updateValue(element, value)
  }
}

export const setupSrcUpdate = (src: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(src)) {
    return src.observe((src) => {
      const textElement = element as HTMLImageElement
      textElement.src = src !== undefined ? src : ''
    })
  } else {
    const textElement = element as HTMLImageElement
    textElement.src = src !== undefined ? src : ''
  }
}

export const setupTextUpdate = (text: FacetProp<string | number | undefined>, element: Text) => {
  if (isFacet(text)) {
    return text.observe((text) => {
      const textElement = element as Text
      textElement.nodeValue = (text !== undefined ? text : '') as string
    })
  } else {
    const textElement = element as Text
    textElement.nodeValue = (text !== undefined ? text : '') as string
  }
}

/**
 * removeAttribute and setAttribute automatically convert the attribute name to lower case.
 * The DOM attribute viewBox is camel cased so setAttributeNS and removeAttributeNS are used
 */
export const setupViewBoxUpdate = (viewBox: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(viewBox)) {
    return viewBox.observe((value) => {
      if (value !== undefined) {
        element.setAttributeNS(null, 'viewBox', value)
      } else {
        element.removeAttributeNS(null, 'viewBox')
      }
    })
  } else {
    if (viewBox !== undefined) {
      element.setAttributeNS(null, 'viewBox', viewBox)
    } else {
      element.removeAttributeNS(null, 'viewBox')
    }
  }
}

export const setupAttributeUpdate = (
  attribute: string,
  value: FacetProp<string | boolean | undefined>,
  element: HTMLElement | SVGElement,
) => {
  if (isFacet(value)) {
    return value.observe((value) => {
      if (value === true) {
        element.setAttribute(attribute, '')
      } else if (value === false) {
        element.removeAttribute(attribute)
      } else if (value !== undefined) {
        element.setAttribute(attribute, value)
      } else {
        element.removeAttribute(attribute)
      }
    })
  } else {
    if (value === true) {
      element.setAttribute(attribute, '')
    } else if (value === false) {
      element.removeAttribute(attribute)
    } else if (value !== undefined) {
      element.setAttribute(attribute, value)
    } else {
      element.removeAttribute(attribute)
    }
  }
}
