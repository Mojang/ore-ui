---
sidebar_position: 7
---

# Supported Attributes

Because of the characteristics of the [platforms primarily targeted by React Facet](../goals#platform-characteristics), only a subset of HTML attributes and event handlers is supported by the components already included in the packages.

The following are the props available for both the [DOM Components](dom-components) and the [`fast-*` Components](fast-components):

## Basic React Props

- `children`: works as React children. In the `fast-*` Components, the type is set to [`StrictReactNode`](support-types#StrictReactNode)
- `key`
- `className`
- `ref` (`innerRef` in the case of DOM Components)
- `dangerouslySetInnerHTML`: only for `fast-*` Components
- `style`: the `style` object itself cannot be a `Facet`, but each of the properties of the object can either be a `Facet` or a plain value.

## Events

As a reminder: these events are different than the ones supported by React DOM, since the synthetic events and other cross-browser and usability features have been stripped away to make the library leaner. This is possible because they are not necessary in the target platforms.

Instead, these events address the native events in the DOM directly, as implemented in modern browsers.

### Pointer Events

- `onClick`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onMouseDown`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onMouseUp`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onTouchStart`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onTouchMove`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onTouchEnd`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onMouseEnter`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`
- `onMouseLeave`: ([MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) => `void`

### Focus Events

- `onFocus`: ([FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) => `void`
- `onBlur`: ([FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) => `void`

### Keyboard Events

- `onKeyPress`: ([KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)) => `void`
- `onKeyDown`: ([KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)) => `void`
- `onKeyUp`: ([KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)) => `void`

## Component specific properties

### `img` / `fast-img` / `fast.img`

- `src`

### `a` / `fast-a` / `fast.a`

-	`href`
- `target`

### `input` / `fast-input` / `fast.input`

- `disabled`
- `maxLength`
- `type`
- `value`

### `textarea` / `fast-textarea` / `fast.textarea`

- `disabled`
- `maxLength`
- `rows`
- `value`
