import {
  createUniformArrayEqualityCheck,
  createUniformObjectEqualityCheck,
  createObjectWithKeySpecificEqualityCheck,
  createOptionalValueEqualityCheck,
} from './createEqualityChecks'
import { shallowObjectEqualityCheck, strictEqualityCheck } from './equalityChecks'

describe('createUniformObjectEqualityCheck', () => {
  it('handles matching arguments', () => {
    const equalityCheck = createUniformObjectEqualityCheck(strictEqualityCheck)()
    expect(equalityCheck({ a: 1, b: 2, c: 2 })).toBe(false)
    expect(equalityCheck({ a: 1, b: 2, c: 2 })).toBe(true)
    expect(equalityCheck({ a: 1, b: 2, c: 4 })).toBe(false)
    expect(equalityCheck({ a: 1, b: 2, c: 4 })).toBe(true)
  })
})

describe('createUniformArrayEqualityCheck', () => {
  it('handles matching arguments', () => {
    const equalityCheck = createUniformArrayEqualityCheck(strictEqualityCheck)()
    expect(equalityCheck(['a', 'b', 'c'])).toBe(false)
    expect(equalityCheck(['a', 'b', 'c'])).toBe(true)
  })

  it('handles empty arrays', () => {
    const equalityCheck = createUniformArrayEqualityCheck(strictEqualityCheck)()
    expect(equalityCheck([])).toBe(false)
    expect(equalityCheck([])).toBe(true)
  })

  it('handles non-matching arguments', () => {
    const equalityCheck = createUniformArrayEqualityCheck(strictEqualityCheck)()
    expect(equalityCheck(['a', 'b', 'c'])).toBe(false)
    expect(equalityCheck(['a', 'b', 'a'])).toBe(false)
    expect(equalityCheck(['a'])).toBe(false)
    expect(equalityCheck([])).toBe(false)
    expect(equalityCheck(['a'])).toBe(false)
  })

  it('handles arrays with objects inside', () => {
    const equalityCheck = createUniformArrayEqualityCheck(shallowObjectEqualityCheck)()
    expect(equalityCheck([{ a: 1 }, { a: 2 }])).toBe(false)
    expect(equalityCheck([{ a: 1 }, { a: 2 }])).toBe(true)
    expect(equalityCheck([{ a: 1 }, { a: 3 }])).toBe(false)
    expect(equalityCheck([{ a: 1 }, { a: 3 }])).toBe(true)
    expect(equalityCheck([{ a: 1 }, { a: 3 }, { a: 2 }])).toBe(false)
    expect(equalityCheck([{ a: 1 }, { a: 3 }, { a: 2 }])).toBe(true)
    expect(equalityCheck([{ a: 1 }])).toBe(false)
  })
})

describe('createObjectWithKeySpecificEqualityCheck', () => {
  it('handles a different type of equality check on each key', () => {
    const equalityCheck = createObjectWithKeySpecificEqualityCheck({
      name: strictEqualityCheck,
      age: strictEqualityCheck,
      posts: createUniformArrayEqualityCheck(shallowObjectEqualityCheck),
    })()

    expect(equalityCheck({ name: 'test', age: 20, posts: [{ title: 'a' }] })).toBe(false)
    expect(equalityCheck({ name: 'test', age: 20, posts: [{ title: 'a' }] })).toBe(true)
    expect(equalityCheck({ name: 'test', age: 20, posts: [{ title: 'a' }, { title: 'b' }] })).toBe(false)
    expect(equalityCheck({ name: 'test', age: 20, posts: [{ title: 'a' }, { title: 'b' }] })).toBe(true)
    expect(equalityCheck({ name: 'test', age: 21, posts: [{ title: 'a' }, { title: 'b' }] })).toBe(false)
    expect(equalityCheck({ name: 'test', age: 21, posts: [{ title: 'a' }, { title: 'b' }] })).toBe(true)
  })
})

describe('createOptionalValueEqualityCheck', () => {
  it('handles comparing nullary values, and letting the non-null be compared by the argument', () => {
    const equalityCheck = createOptionalValueEqualityCheck(shallowObjectEqualityCheck)()

    expect(equalityCheck({ a: 1 })).toBe(false)
    expect(equalityCheck({ a: 1 })).toBe(true)
    expect(equalityCheck(null)).toBe(false)
    expect(equalityCheck(null)).toBe(true)
    expect(equalityCheck(undefined)).toBe(true)
    expect(equalityCheck({ a: 1 })).toBe(false)
    expect(equalityCheck({ a: 2 })).toBe(false)
    expect(equalityCheck({ a: 2 })).toBe(true)
  })
})
