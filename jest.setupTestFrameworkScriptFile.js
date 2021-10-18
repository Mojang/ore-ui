import React from 'react'
import '@testing-library/jest-dom/extend-expect'

// Make useEffect run synchronously to make it easier to test
// TODO: update this to an official solution once available
// see: https://github.com/kentcdodds/react-testing-library/issues/215#issuecomment-438294336
beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect))
afterAll(() => React.useEffect.mockRestore())
