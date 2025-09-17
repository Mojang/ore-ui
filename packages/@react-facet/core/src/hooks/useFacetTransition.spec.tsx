import { useFacetTransition } from './useFacetTransition'
import { batchTransition } from '../scheduler'

const mockIsPending = false
const mockReactStartTransition = jest.fn().mockImplementation((fn) => fn())

jest.mock('react', () => ({
  useTransition: jest.fn().mockImplementation(() => [mockIsPending, mockReactStartTransition]),
  useCallback: jest.fn().mockImplementation((fn) => fn),
}))

jest.mock('../scheduler', () => ({
  batchTransition: jest.fn(),
}))

it('acts as a useTransition, but wrapping the provided fn within a batchTransition', () => {
  const [isPending, startTransition] = useFacetTransition()

  expect(isPending).toBe(mockIsPending)

  const fn = jest.fn()
  startTransition(fn)
  expect(batchTransition).toHaveBeenCalledTimes(1)
  expect(batchTransition).toHaveBeenCalledWith(fn)
})
