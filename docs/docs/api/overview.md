---
sidebar_position: 1
---

# API Overview

## Hooks

The facet library provides a series of React hooks to interact with facets.

Many of them are the `Facet` analog of standard React hooks:

- [`useFacetState`](hooks#usefacetstate)
- [`useFacetEffect`](hooks#usefaceteffect)
- [`useFacetMemo`](hooks#usefacetmemo)
- [`useFacetCallback`](hooks#usefacetcallback)
- [`useFacetRef`](hooks#usefacetref)

A few are meant to solve `Facet`-specific issues:

- [`useFacetMap`](hooks#usefacetmap)
- [`useFacetWrap`](hooks#usefacetwrap)
- [`useFacetUnwrap`](hooks#usefacetunwrap)

## Mount Components

These are components that can be used together with the `fast-*` components when there is a need to conditionally add or remove nodes in the React tree.

- [`Mount`](mount-components#mount)
- [`Map`](mount-components#map)
- [`With`](mount-components#with)

## `fast-*` Components

When using [`@react-facet/dom-fiber`](../rendering/using-the-custom-renderer), you have access to:

- [`fast-div`](fast-components) - Primary container element
- [`fast-text`](fast-components) - Text content
- [`fast-input`](fast-components) - Text input
- [`fast-textarea`](fast-components) - Multi-line text input
- [`fast-img`](fast-components) - Images
- [`fast-a`](fast-components) - Anchor/link element
- [`fast-span`](fast-components) - Inline element
- [`fast-p`](fast-components) - Paragraph element

## Helpers

- [`multiObserve`](helpers#multiObserve)
- [`hasDefinedValue`](helpers#hasDefinedValue)
- [`areAllDefinedValues`](helpers#areAllDefinedValues)
