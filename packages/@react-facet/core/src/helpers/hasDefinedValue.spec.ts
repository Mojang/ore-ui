import { NO_VALUE } from '../types'
import { hasDefinedValue } from './hasDefinedValue'

it('returns false if value is null', () => {
  expect(hasDefinedValue(null)).toBe(false)
})

it('returns false if value is undefined', () => {
  expect(hasDefinedValue(undefined)).toBe(false)
})

it('returns false if value is NO_VALUE', () => {
  expect(hasDefinedValue(NO_VALUE)).toBe(false)
})

it('returns true otherwise', () => {
  expect(hasDefinedValue(0)).toBe(true)
})
