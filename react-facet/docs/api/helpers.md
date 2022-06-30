---
sidebar_position: 11
---

# Helpers


## `multiObserve`

`multiObserve` allows to observe an array of `Facet`s for changes. For example:

```ts twoslash
import { createFacet, multiObserve } from '@react-facet/core'

const userNameFacet = createFacet({ initialValue: 'Jane' })
const userLevelFacet = createFacet({ initialValue: 'maintainer' })

const unObserve = multiObserve(
  (userName, userLevel) => {
    console.log(`${userName} is now ${userLevel}`)
  },
  [userNameFacet, userLevelFacet]
)
// Logs "Jane is now maintainer"

userLevelFacet.set('admin')
// Logs "Jane is now admin"

unObserve()

userNameFacet.set('Janice')
// Does not log anything
```

## `hasDefinedValue`

This helpers allows to check for whether a value extracted from a Facet is `null`, `undefined` or `NO_VALUE`. This is useful because the classic check `!= null` is not enough, since a Facet value can also be the special `NO_VALUE` Symbol.

```ts twoslash
import { hasDefinedValue, NO_VALUE } from '@react-facet/core'

hasDefinedValue(null) // false
hasDefinedValue(undefined) // false
hasDefinedValue(NO_VALUE) // false
hasDefinedValue(0) // true
```


## `areAllDefinedValues`

This helpers allows to check for whether a list of values extracted from a list of Facets are `null`, `undefined` or `NO_VALUE`. This is useful because the classic check `!= null` is not enough, since a Facet value can also be the special `NO_VALUE` Symbol.

```ts twoslash
import { areAllDefinedValues, NO_VALUE } from '@react-facet/core'

areAllDefinedValues([null, undefined, NO_VALUE, 'someValue', 0, true, { a: 'b' }, ['a', 'b', 0]]) // false
areAllDefinedValues([null, true, 'someValue', 0, false, { a: 'b' }, ['a', 'b', 0]]) // false
areAllDefinedValues([undefined, true, 'someValue', 0, false, { a: 'b' }, ['a', 'b', 0]]) // false
areAllDefinedValues([NO_VALUE, true, 'someValue', 0, false, { a: 'b' }, ['a', 'b', 0]]) // false
areAllDefinedValues([true, false, '', 'someValue', 0, 1, { a: 'b' }, ['a', 'b']]) // true
```
