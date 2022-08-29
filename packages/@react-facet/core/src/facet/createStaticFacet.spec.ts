import { createStaticFacet } from './createStaticFacet'

describe('createStaticFacet', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })

  it(`it can be read but not mutated`, () => {
    const initialValue = {}
    const mock = createStaticFacet(initialValue)

    expect(mock.get()).toBe(initialValue)
    expect('set' in mock).toBe(false)
  })

  it(`it responds with the same value if you observe it and warns you in a non-production environment`, () => {
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

    const update = jest.fn()
    const initialValue = {}
    const mock = createStaticFacet(initialValue)

    mock.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(initialValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(1)
    expect(consoleLogMock).toHaveBeenCalledWith(`Accessing a static facet, perhaps you're missing a Context Provider?`)

    update.mockClear()
    consoleLogMock.mockClear()

    process.env.NODE_ENV = 'production'

    mock.observe(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(initialValue)
    expect(consoleLogMock).toHaveBeenCalledTimes(0)
  })
})
