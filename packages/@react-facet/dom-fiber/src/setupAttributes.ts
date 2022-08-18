import { FacetProp, isFacet, NoValue, NO_VALUE } from '@react-facet/core'

export const setupClassUpdate = (className: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  const htmlElement = element as HTMLElement

  if (isFacet(className)) {
    let previous: string | undefined | NoValue = NO_VALUE

    return className.observe((value) => {
      if (value !== previous) {
        htmlElement.className = value ?? ''
        previous = value
      }
    })
  } else {
    htmlElement.className = className ?? ''
  }
}

export const setupIdUpdate = (id: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(id)) {
    let previous: string | undefined | NoValue = NO_VALUE

    return id.observe((value) => {
      if (value !== previous) {
        element.id = value ?? ''
        previous = value
      }
    })
  } else {
    element.id = id ?? ''
  }
}

export const setupMaxLengthUpdate = (maxLength: FacetProp<number | undefined>, element: HTMLElement | SVGElement) => {
  const textElement = element as HTMLTextAreaElement

  if (isFacet(maxLength)) {
    let previous: number | undefined | NoValue = NO_VALUE

    return maxLength.observe((value) => {
      if (value !== previous) {
        textElement.maxLength = value ?? Number.MAX_SAFE_INTEGER
        previous = value
      }
    })
  } else {
    textElement.maxLength = maxLength ?? Number.MAX_SAFE_INTEGER
  }
}

export const setupRowsUpdate = (rows: FacetProp<number | undefined>, element: HTMLElement | SVGElement) => {
  const textElement = element as HTMLTextAreaElement

  if (isFacet(rows)) {
    let previous: number | undefined | NoValue = NO_VALUE

    return rows.observe((value) => {
      if (value !== previous) {
        textElement.rows = value ?? Number.MAX_SAFE_INTEGER
        previous = value
      }
    })
  } else {
    textElement.rows = rows ?? Number.MAX_SAFE_INTEGER
  }
}

/**
 * The value attribute seems to behave differently to other
 * attributes. When using `setAttribute`, browsers and gameface
 * don't always update the element to have what's in the value,
 * so we need to set the `value` attribute directly to solve this.
 * ref: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMInput.js
 */
export const setupValueUpdate = (value: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  const inputElement = element as HTMLInputElement

  if (isFacet(value)) {
    let previous: string | undefined | NoValue = NO_VALUE

    return value.observe((value) => {
      if (value !== previous) {
        inputElement.value = value ?? ''

        if (value != null) {
          inputElement.setAttribute('value', value)
        } else {
          inputElement.removeAttribute('value')
        }

        previous = value
      }
    })
  } else {
    inputElement.value = value ?? ''

    if (value != null) {
      inputElement.setAttribute('value', value)
    } else {
      inputElement.removeAttribute('value')
    }
  }
}

export const setupSrcUpdate = (src: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  const textElement = element as HTMLImageElement

  if (isFacet(src)) {
    let previous: string | undefined | NoValue = NO_VALUE

    return src.observe((value) => {
      if (value !== previous) {
        textElement.src = value ?? ''
        previous = value
      }
    })
  } else {
    textElement.src = src ?? ''
  }
}

export const setupTextUpdate = (text: FacetProp<string | number | undefined>, element: Text) => {
  const textElement = element as Text

  if (isFacet(text)) {
    let previous: string | number | undefined | NoValue = NO_VALUE

    return text.observe((value) => {
      if (value !== previous) {
        textElement.nodeValue = (value ?? '') as string
        previous = value
      }
    })
  } else {
    textElement.nodeValue = (text ?? '') as string
  }
}

/**
 * removeAttribute and setAttribute automatically convert the attribute name to lower case.
 * The DOM attribute viewBox is camel cased so setAttributeNS and removeAttributeNS are used
 */
export const setupViewBoxUpdate = (viewBox: FacetProp<string | undefined>, element: HTMLElement | SVGElement) => {
  if (isFacet(viewBox)) {
    let previous: string | undefined | NoValue = NO_VALUE

    return viewBox.observe((value) => {
      if (value !== previous) {
        if (value != null) {
          element.setAttributeNS(null, 'viewBox', value)
        } else {
          element.removeAttributeNS(null, 'viewBox')
        }
        previous = value
      }
    })
  } else {
    if (viewBox != null) {
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
    let previous: string | boolean | undefined | NoValue = NO_VALUE

    return value.observe((value) => {
      if (value !== previous) {
        if (value === true) {
          element.setAttribute(attribute, '')
        } else if (value === false) {
          element.removeAttribute(attribute)
        } else if (value != null) {
          element.setAttribute(attribute, value)
        } else {
          element.removeAttribute(attribute)
        }

        previous = value
      }
    })
  } else {
    if (value === true) {
      element.setAttribute(attribute, '')
    } else if (value === false) {
      element.removeAttribute(attribute)
    } else if (value != null) {
      element.setAttribute(attribute, value)
    } else {
      element.removeAttribute(attribute)
    }
  }
}
