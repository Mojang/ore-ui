---
sidebar_position: 1
---

# API Overview

## Hooks

The facet library provides a series of React hooks to interact with the facets.

Many of them are the `Facet` analog of the React standard hooks:

- [`useFacetState`](hooks#usefacetstate)
- [`useFacetEffect`](hooks#usefaceteffect)
- [`useFacetMemo`](hooks#usefacetmemo)
- [`useFacetCallback`](hooks#usefacetcallback)
- [`useFacetRef`](hooks#usefacetref)

A few are meant to solve `Facet` specific issues:

- [`useFacetMap`](hooks#usefacetmap)
- [`useFacetWrap`](hooks#usefacetwrap)
- [`useFacetUnwrap`](hooks#usefacetunwrap)

## Mount Components

These are a series of components that can be used together with the `fast-*` components when there is a needed to add or remove nodes in the React tree.

- [`Mount`](mount-components#mount)
- [`Map`](mount-components#map)
- [`With`](mount-components#with)

## `fast-*` components and their React DOM compatible equivalent

- [`fast-a`](fast-components) / [`fast.a`](dom-components)
- [`fast-div`](fast-components) / [`fast.div`](dom-components)
- [`fast-span`](fast-components) / [`fast.span`](dom-components)
- [`fast-p`](fast-components) / [`fast.p`](dom-components)
- [`fast-img`](fast-components) / [`fast.img`](dom-components)
- [`fast-textarea`](fast-components) / [`fast.textarea`](dom-components)
- [`fast-input`](fast-components) / [`fast.input`](dom-components)
