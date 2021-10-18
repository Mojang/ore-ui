import { shallowObjectEqualityCheck, strictEqualityCheck, defaultEqualityCheck } from './equalityChecks'

describe('shallowObjectEqualityCheck()', () => {
  it('handles matching objects', () => {
    const equalityCheck = shallowObjectEqualityCheck()
    expect(equalityCheck({})).toBe(false)
    expect(equalityCheck({})).toBe(true)

    expect(equalityCheck({ foo: 'bar' })).toBe(false)
    expect(equalityCheck({ foo: 'bar' })).toBe(true)

    expect(equalityCheck({ foo: 'bar', bar: 'baz' })).toBe(false)
    expect(equalityCheck({ foo: 'bar', bar: 'baz' })).toBe(true)

    expect(equalityCheck({})).toBe(false)
    expect(equalityCheck({})).toBe(true)

    expect(equalityCheck({ foo: 'bar' })).toBe(false)
    expect(equalityCheck({ foo: 'bar' })).toBe(true)
  })

  it('handles non-matching objects', () => {
    const equalityCheck = shallowObjectEqualityCheck()

    expect(equalityCheck({ foo: 1 })).toBe(false)
    expect(equalityCheck({ foo: true })).toBe(false) // Make sure it does a strict type check

    expect(equalityCheck({ foo: 'bar' })).toBe(false)
    expect(equalityCheck({ foo: 'bars' })).toBe(false)

    expect(equalityCheck({ foo: 'bar', bar: 'baz' })).toBe(false)
    expect(equalityCheck({ foo: 'baz', bar: undefined })).toBe(false)

    expect(equalityCheck({ foo: 'bar', bar: 'baz' })).toBe(false)
    expect(equalityCheck({ foo: 'bar' })).toBe(false)
  })
})

describe('strictEqualityCheck', () => {
  it('handles function comparisons by reference', () => {
    const equalityCheck = strictEqualityCheck()
    const noop = () => {}

    expect(equalityCheck(noop)).toBe(false)
    expect(equalityCheck(noop)).toBe(true)
  })

  it('returns true for "immutable" undefined types', () => {
    const equalityCheck = strictEqualityCheck()
    const value = undefined

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })

  it('returns true for "immutable" null types', () => {
    const equalityCheck = strictEqualityCheck()
    const value = null

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })
})

describe('defaultEqualityCheck', () => {
  it('returns false for "mutable" object types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value = {}

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(false)
  })

  it('returns false for "mutable" array types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value: string[] = []

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(false)
  })

  it('returns true for "immutable" number types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value = 1

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })

  it('returns true for "immutable" boolean types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value = true

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })

  it('returns true for "immutable" string types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value = '1'

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })

  it('returns true for "immutable" undefined types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value = undefined

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })

  it('returns true for "immutable" null types', () => {
    const equalityCheck = defaultEqualityCheck()
    const value = null

    expect(equalityCheck(value)).toBe(false)
    expect(equalityCheck(value)).toBe(true)
  })
})
