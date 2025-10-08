---
sidebar_position: 3
---

# Fast Components

When using [`@react-facet/dom-fiber`](../rendering/overview) as a renderer instead of `react-dom`, you have access to the `fast-*` family of components, which are `Facet`-ready equivalent of the regular HTML components supported by `react-dom`.

This means that all properties passed to a `fast-*` components can be regular values or `Facet`s. For example:

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
import { useFacetWrap } from '@react-facet/core'
// ---cut---

<>
  <fast-div id="facet-div-0" />
  <fast-div id={useFacetWrap('facet-div-1')} />
</>
```

Here's a list of the currently supported `fast-*` components:

- `fast-a`
- `fast-div`
- `fast-span`
- `fast-p`
- `fast-img`
- `fast-textarea`
- `fast-input`

On top of these, a special case of a `fast-*` component that does not have any counterpart in HTML is the `fast-text`. The reason for a custom component is because React does not support functions to be passed down as `children` to the reconciler, and a `Facet` is a function.

`fast-text` receives a `text` prop that accepts a `Facet` containing a string. The `fast-text` component is renderer as just a `textNode` under the hood, so it doesn't create more DOM elements.

```tsx twoslash
// @esModuleInterop
import { render } from '@react-facet/dom-fiber'
import { useFacetWrap } from '@react-facet/core'
// ---cut---
<fast-span>
  <fast-text text={useFacetWrap('lorem ipsum')} />
</fast-span>
```

## Coherent Labs' Gameface support

The `fast-*` components also provide access to a series of special Gameface CSS properties that do not rely on `string`s and use `number`s instead. Because construction and parsing of `string`s is avoided for these properties, they are usually at least 2x faster.

TODO WHICH?

> For more details on available optimized properties, you can search for properties ending on `PX`, `VH` & `VW` in the [Gameface properties documentation](https://coherent-labs.com/Documentation/cpp-gameface/db/d44/interface_c_s_s_style_declaration.html)
