/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line require-in-package/require-in-package
const React = require('react')

const matchers = require('@testing-library/jest-dom/extend-expect')

expect.extend(matchers)

// Make useEffect run synchronously to make it easier to test
// TODO: update this to an official solution once available
// see: https://github.com/kentcdodds/react-testing-library/issues/215#issuecomment-438294336
beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect))
afterAll(() => React.useEffect.mockRestore())
