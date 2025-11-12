import { NO_VALUE } from '../types'
import { createStaticFacet } from './createStaticFacet'

it('allows reading, but not mutation', () => {
  const initialValue = {}
  const mock = createStaticFacet(initialValue)

  expect(mock.get()).toBe(initialValue)
  expect('set' in mock).toBe(false)
})

it('responds with the same value if you observe it and warns you in a non-production environment', () => {
  const update = jest.fn()
  const initialValue = {}
  const mock = createStaticFacet(initialValue)

  mock.observe(update)
  expect(update).toHaveBeenCalledTimes(1)
  expect(update).toHaveBeenCalledWith(initialValue)

  update.mockClear()

  mock.observe(update)
  expect(update).toHaveBeenCalledTimes(1)
  expect(update).toHaveBeenCalledWith(initialValue)
})

it('avoids triggering the listener if initialized with NO_VALUE', () => {
  const update = jest.fn()
  const initialValue = NO_VALUE
  const mock = createStaticFacet(initialValue)

  mock.observe(update)
  expect(update).not.toHaveBeenCalled()
})
