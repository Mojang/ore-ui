import { Facet } from '@react-facet/core'
import { ReactFacetDevTools } from '@react-facet/dev-tools'

function injectCode(code: string) {
  const script = document.createElement('script')
  script.textContent = code

  // This script runs before the <head> element is created,
  // so we add the script to <html> instead.
  document.documentElement?.appendChild(script)
  // script.parentNode?.removeChild(script)
}

type ReactFacetHookEntry = {
  hookName: string
  styleName?: string
  typeName?: string
  facets?: Facet<unknown>[]
  newFacet?: Facet<unknown>
}

type Descendants = number[]
type Event = {
  source: 'react-facet-devtools-content-script'
  payload: { symbol: Symbol }
}

function installHook(target: Window) {
  if (target.hasOwnProperty('__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__')) {
    return null
  }

  const getRelationships = (hooks: ReactFacetHookEntry[]) => {
    const relationships: { [key: string]: Descendants } = {}
    for (let sourceIndex = 0; sourceIndex < hooks.length; sourceIndex++) {
      const currentFacet = hooks[sourceIndex]?.newFacet
      if (currentFacet != null) {
        relationships[sourceIndex] = []

        for (let targetIndex = 0; targetIndex < hooks.length; targetIndex++) {
          if (hooks[targetIndex]?.facets?.includes(currentFacet)) {
            relationships[sourceIndex].push(targetIndex)
          }
        }
      }
    }

    return relationships
  }

  const hooksWithoutFacetReferences = (hooks: ReactFacetHookEntry[]) => {
    return hooks.map(({ hookName, styleName, typeName }) => ({ hookName, styleName, typeName }))
  }

  const setupReactFacetDevTools = (): ReactFacetDevTools => {
    const hooks: ReactFacetHookEntry[] = []

    return {
      send: ({ hookName, facets, newFacet, styleName, typeName }) => {
        hooks.push({ hookName, facets, newFacet, styleName, typeName })
        const currentRelationships = getRelationships(hooks)
        window.postMessage(
          {
            source: 'react-facet-devtools-content-script',
            payload: { hooks: hooksWithoutFacetReferences(hooks), currentRelationships },
          },
          '*',
        )
      },
    }
  }

  const hook = setupReactFacetDevTools()

  Object.defineProperty(target, '__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__', {
    // This property needs to be configurable for the test environment,
    // else we won't be able to delete and recreate it between tests.
    // configurable: __DEV__,
    enumerable: false,
    get() {
      return hook
    },
  })

  return hook
}

if ('text/html' === document.contentType) {
  injectCode(';(' + installHook.toString() + `(window));`)
}

const port = chrome.runtime.connect({ name: 'react-facet-devtools' })

window.addEventListener(
  'message',
  (event: MessageEvent<Event>) => {
    // We only accept messages from ourselves
    if (event.source != window || event.data.source !== 'react-facet-devtools-content-script') {
      return
    }

    port.postMessage(event.data)
  },
  false,
)
