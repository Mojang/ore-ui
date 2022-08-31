import { createStaticFacet } from './createStaticFacet'

describe('createStaticFacet', () => {
  it(`it can be read but not mutated`, () => {
    const initialValue = {}
    const mock = createStaticFacet(initialValue)

    expect(mock.get()).toBe(initialValue)
    expect('set' in mock).toBe(false)
  })

  it(`it responds with the same value if you observe it and warns you in a non-production environment`, () => {
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
})
