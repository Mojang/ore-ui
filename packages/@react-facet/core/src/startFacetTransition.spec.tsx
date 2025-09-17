import { startFacetTransition } from './startFacetTransition'
import { batchTransition } from './scheduler'

jest.mock('react', () => ({
  startTransition: jest.fn().mockImplementation((fn) => fn()),
}))

jest.mock('./scheduler', () => ({
  batchTransition: jest.fn(),
}))

it('acts as a startTransition, but wrapping the provided fn within a batchTransition', () => {
  const fn = jest.fn()
  startFacetTransition(fn)

  expect(batchTransition).toHaveBeenCalledTimes(1)
  expect(batchTransition).toHaveBeenCalledWith(fn)
})
