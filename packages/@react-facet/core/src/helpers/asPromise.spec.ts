import { NO_VALUE } from '..'
import { createFacet } from '../facet'
import { asPromise } from './asPromise'

it('immediately resolves facets with their values if available', async () => {
  const facet = createFacet({ initialValue: 'testing' })
  const value = await asPromise(facet).promise
  expect(value).toEqual('testing')
})

it('waits for the facet to have a value, making sure to not hold subscriptions', async () => {
  const cleanupSubscription = jest.fn()
  const startSubscription = jest.fn().mockImplementation((update) => {
    update('testing')
    return cleanupSubscription
  })

  const facet = createFacet<string>({
    initialValue: NO_VALUE,
    startSubscription,
  })

  const value = await asPromise(facet).promise
  expect(value).toEqual('testing')

  expect(startSubscription).toHaveBeenCalledTimes(1)
  expect(cleanupSubscription).toHaveBeenCalledTimes(1)
})
