import { createFacet } from '../facet'
import { asPromise } from './asPromise'

it('resolves facets with their values if available', async () => {
  const facet = createFacet({ initialValue: 'testing' })
  const value = await asPromise(facet)
  expect(value).toEqual('testing')
})

it.todo('waits for the facet to have a value, making sure to not hold subscriptions')
