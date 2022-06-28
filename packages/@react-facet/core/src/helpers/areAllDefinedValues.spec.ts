import { NO_VALUE, Value, NoValue } from '..'
import { areAllDefinedValues } from './areAllDefinedValues'

it('returns false if one of the facetValues is not defined', () => {
  const testCase1: (Value | NoValue)[] = [null, undefined, NO_VALUE, 'someValue', 0, true, { a: 'b' }, ['a', 'b', 0]]
  expect(areAllDefinedValues(testCase1)).toBe(false)

  const testCase2: (Value | NoValue)[] = [null, true, 'someValue', 0, false, { a: 'b' }, ['a', 'b', 0]]
  expect(areAllDefinedValues(testCase2)).toBe(false)

  const testCase3: (Value | NoValue)[] = [undefined, true, 'someValue', 0, false, { a: 'b' }, ['a', 'b', 0]]
  expect(areAllDefinedValues(testCase3)).toBe(false)

  const testCase4: (Value | NoValue)[] = [NO_VALUE, true, 'someValue', 0, false, { a: 'b' }, ['a', 'b', 0]]
  expect(areAllDefinedValues(testCase4)).toBe(false)
})

it('returns true if all of the facetValues are defined', () => {
  const testValues: (Value | NoValue)[] = [true, false, '', 'someValue', 0, 1, { a: 'b' }, ['a', 'b']]

  expect(areAllDefinedValues(testValues)).toBe(true)
})
