// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGlobalThis(): any {
  /* istanbul ignore else */
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }
  /* istanbul ignore next */
  if (typeof self !== 'undefined') {
    return self
  }
  /* istanbul ignore next */
  if (typeof window !== 'undefined') {
    return window
  }
  /* istanbul ignore next */
  if (typeof global !== 'undefined') {
    return global
  }
  /* istanbul ignore next */
  throw new Error('unable to locate global object')
}

/**
 * More info: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
 * Reference implementation: https://github.com/testing-library/react-testing-library/blob/c80809a956b0b9f3289c4a6fa8b5e8cc72d6ef6d/src/act-compat.js#L5
 */
export const setupAct = () => {
  getGlobalThis().IS_REACT_ACT_ENVIRONMENT = true
}
