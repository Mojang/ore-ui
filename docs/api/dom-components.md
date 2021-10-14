---
sidebar_position: 6
---

# DOM Components

If you are not yet using the [`@react-facet/dom-fiber`](../rendering/using-the-custom-renderer), you can operate with Facets using the DOM components. DOM Components provide compatibility with React DOM.

For example:

```tsx
import { fast } from '@react-facet/dom-components'

const Example = () => {
  const [themeFacet, setTheme] = useFacetState('dark')

  const handleToggleTheme = useCallback(() => {
    setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  const classNameFacet = useFacetMap((theme) => `container ${theme}`, [], [themeFacet])

  return (
    <fast.div className={classNameFacet}>
      Current mode: <fast.text text={themeFacet} />
      <button onClick={handleToggleTheme}>Toggle theme mode</button>
    </fast.div>
  )
}
```

As you can see, the API of the DOM Components has been designed to closely resemble that of the `fast-*` components supported by the renderer. This is done to facilitate conversion from the DOM Components approach to the Custom Renderer if deemed necessary.

TODO: only some props are supported. Which and why?

---

## Available components

The following are available as DOM Components. They match one to one with the [equivalent `fast-*` components](fast-components)

- `fast.a`
- `fast.div`
- `fast.span`
- `fast.p`
- `fast.img`
- `fast.textarea`
- `fast.input`
- `fast.text` (which same as `fast-text`, allows for a Facet to be set as text via the `text` prop)
