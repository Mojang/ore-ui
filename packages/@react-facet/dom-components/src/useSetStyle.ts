import { RefObject, useLayoutEffect, useRef } from 'react'
import { FacetCSSStyleDeclaration } from '@react-facet/core'

interface LocalStyle {
  [key: string]: string | number
}

const mapKeys = <T extends Record<string, unknown>, V>(x: T, callback: (v: keyof T) => V): V[] => {
  const a = []
  let b: keyof T
  for (b in x) {
    a.push(callback(b))
  }
  return a
}

export function useSetStyle(style: FacetCSSStyleDeclaration | undefined, ref: RefObject<HTMLElement>) {
  const gamefaceStyleRef = useRef<CSSStyleDeclaration | null>(null)

  useLayoutEffect(() => {
    if (style === undefined) return

    const element = ref.current
    if (element === null) return

    gamefaceStyleRef.current = element.style
    if (gamefaceStyleRef.current === null) return

    // Casting elementStyle because of issues with matching the CSS Style type and the FacetCSSStyleDeclaration
    const elementStyle = gamefaceStyleRef.current as unknown as LocalStyle

    const unsubscribes = mapKeys(style, (key) => {
      let cache: string | number | null = null
      const value = style[key]
      if (value === undefined) return

      if (typeof value === 'string' || typeof value === 'number') {
        if (cache !== value) {
          elementStyle[key] = value
          cache = value
        }
      } else {
        const property = value

        return property.observe((value: string | number) => {
          elementStyle[key] = value
        })
      }
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => {
        unsubscribe?.()
      })
    }
  }, [style, ref])
}
