import { ReactFacetDevTools } from '@react-facet/dev-tools'

function injectCode(code: string) {
  const script = document.createElement('script')
  script.textContent = code

  // This script runs before the <head> element is created,
  // so we add the script to <html> instead.
  document.documentElement?.appendChild(script)
  script.parentNode?.removeChild(script)
}

function installHook(target: Window) {
  if (target.hasOwnProperty('__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__')) {
    return null
  }

  const setupReactFacetDevTools = (): ReactFacetDevTools => {
    const hooks = []

    return {
      send: ({ hookName, facets, newFacet }) => {
        hooks.push({ hookName, facets, newFacet })
        console.log({ hooks })
      },
    }
  }

  const hook = setupReactFacetDevTools()

  setTimeout(() => window.postMessage({ type: 'FROM_PAGE', text: 'Hello from the webpage!' }, '*'), 1000)

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
  injectCode(';(' + installHook.toString() + `(window, '${chrome.runtime.id})');`)
}

const port = chrome.runtime.connect({ name: 'knockknock' })

console.log('IT CONNECTED', port)

port.postMessage({ joke: 'Knock knock' })
port.onMessage.addListener(function (msg) {
  console.log('MESSAGE IN CONTENT SCRIPT', msg)
  if (msg.question === "Who's there?") port.postMessage({ answer: 'Madame' })
  else if (msg.question === 'Madame who?') port.postMessage({ answer: 'Madame... Bovary' })
})

window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source != window) {
      return
    }

    console.log('RECEIVED POST MESSAGE', event)

    // if (event.data.type && (event.data.type == "FROM_PAGE")) {
    //   console.log("Content script received: " + event.data.text);
    //   port.postMessage(event.data.text);
    // }
  },
  false,
)

console.log(chrome.runtime.id)
