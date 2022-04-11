interface MemoizableFunction<A, R> {
  (argument: A): R
}

/**
 * Simple memoize implementation that supports a single argument
 *
 * TODO: handle cleaning up the cache.
 */
export default function memoize<A, R>(fn: MemoizableFunction<A, R>): MemoizableFunction<A, R> {
  const results = new Map<A, R>()

  return (argument: A): R => {
    const previousResult = results.get(argument)
    if (previousResult) return previousResult

    const newResult = fn(argument)
    results.set(argument, newResult)
    return newResult
  }
}
