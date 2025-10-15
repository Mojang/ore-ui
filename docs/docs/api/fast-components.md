---
sidebar_position: 3
---

# Fast Components

When using [`@react-facet/dom-fiber`](../rendering/overview) as a renderer instead of `react-dom`, you have access to the `fast-*` family of components, which are `Facet`-ready equivalents of regular HTML components.

This means that all properties passed to `fast-*` components can be regular values or `Facet`s. For example:

```tsx twoslash
// @esModuleInterop
import { createRoot } from '@react-facet/dom-fiber'
import { useFacetWrap } from '@react-facet/core'
// ---cut---
const Example = () => (
  <>
    <fast-div id="facet-div-0" />
    <fast-div id={useFacetWrap('facet-div-1')} />
  </>
)
```

## Available Components

- `fast-div` - Container element (use for all containers, buttons, links, etc.)
- `fast-text` - Text content (renders as text node, no wrapper element)
- `fast-input` - Text input fields
- `fast-textarea` - Multi-line text input
- `fast-img` - Images
- `fast-a` - Anchor/link element
- `fast-span` - Inline element
- `fast-p` - Paragraph element

## The `fast-text` Component

The `fast-text` component is a special component that doesn't have a direct HTML counterpart. It exists because React does not support functions to be passed down as `children` to the reconciler, and a `Facet` is a function.

`fast-text` receives a `text` prop that accepts a `Facet` containing a string. The component is rendered as just a `textNode` under the hood, so it doesn't create additional DOM elements.

```tsx twoslash
// @esModuleInterop
import { createRoot } from '@react-facet/dom-fiber'
import { useFacetWrap } from '@react-facet/core'
// ---cut---
const Example = () => (
  <fast-div>
    <fast-text text={useFacetWrap('lorem ipsum')} />
  </fast-div>
)
```

## Coherent Labs' Gameface Support

The `fast-*` components provide access to special Gameface CSS properties that use `number`s instead of `string`s. This avoids string construction and parsing overhead, resulting in at least 2x faster performance for these properties.

Properties ending in `PX`, `VH`, and `VW` support numeric values:

```tsx
<fast-div widthPX={100} heightVH={50} />
```

> For more details on available optimized properties, see the [Gameface properties documentation](https://coherent-labs.com/Documentation/cpp-gameface/db/d44/interface_c_s_s_style_declaration.html)
