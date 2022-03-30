---
sidebar_position: 2
---

# Remote Facets

Remote Facets are _the_ way of communicating back and forth from backend. They are constructed using `string` identifiers that the backend will use to populate the information in JavaScript.

Remote Facets are defined using the string identifier and an optional initial value. Note that since the type of the data stored in the facet cannot necessarily be deduced from the arguments, it's important to pass in the type of the facet data as a type argument:

```ts
export interface UserFacet {
  username: string
  signOut(): void
}

export const userFacet = remoteFacet<UserFacet>('data.user', {
  username: 'Alex',
  signOut() {},
})
```

> Note that to fully benefit of the performance improvements given by the facet approach over the default React state approach, it is recommended that when setting the new state, you mutate the original object instead of passing down a new one.

## Selectors

Selectors allow to narrow data from an upstream remote facet:

```ts
interface UserFacet {
  user: {
    name: string
    lastname: string
  }
}

const profileFacet = remoteFacet<UserFacet>('data.user', {
  user: {
    name: 'Jane',
    lastname: 'Doe',
  },
})

const userNameFacet = remoteSelector([profileFacet], ({ user }) => user.name)
```

The user name facet will only hold the user name as data and can be consumed like this:

```tsx
const UserData = () => {
  // This will print Jane
  return (
    <span>
      <fast-text text={userNameFacet} />
    </span>
  )
}
```

To avoid re-renders, you can specify an equality check function, so that if the original facet updates but the value of the data returned by the selector remains the same, listeners to the new facet will not get triggered pointlessly:

```ts
const userNameFacet = remoteSelector([profileFacet], ({ user }) => user.name, { equalityCheck: (a, b) => a === b })
```

If you want to make sure the new facet always holds a value, even if the original facet does not, you can specify an initial value for it:

```ts
const userNameFacet = remoteSelector([profileFacet], ({ user }) => user.name, { initialValue: 'Anonymous' })
```

## Dynamic Selectors

Dynamic Selectors creates a selector that returns a facet based on a parameter. The typical use case of this is an index for a particular element on a list.

```ts
interface MessagesFacet {
  messages: ReadonlyArray<{
    content: string
    timestamp: number
  }>
}

const chatFacet = remoteFacet<MessagesFacet>('data.messages', {
  messages: [
    { content: 'Hello', timestamp: 0 },
    { content: 'Are you free?', timestamp: 12 },
  ],
})

const messageContentSelector = remoteDynamicSelector((index: number) => ({
  dependencies: [chatFacet],
  get: ({ messages }) => messages[index].content,
}))
```

The selector will return a facet that holds the content of the particular message:


```tsx
const Message = ({ index }: { index: number }) => {
  // For index 0, this will be "Hello"
  return (
    <span>
      <fast-text text={messageContentSelector(index)} />
    </span>
  )
}
```

As with the regular selector, you can specify an equality check function and an initial value:

```ts
const messageContentSelector = remoteDynamicSelector(
  (index: number) => ({
    dependencies: [chatFacet],
    get: ({ messages }) => messages[index].content,
  }),
  { equalityCheck: (a, b) => a === b, initialValue: 'Lorem Ipsum' },
)
```

# Implementing facets in the game engine

TODO
