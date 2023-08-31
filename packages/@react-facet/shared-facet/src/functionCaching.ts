/* eslint-disable @typescript-eslint/no-explicit-any */

type ArgsToValueMapType<T extends Array<any>, V> = Map<T, V>

function areArraysMatchingRef<T extends Array<any>>(key1: T, key2: T): boolean {
  if (key1.length !== key2.length) {
    return false
  }

  // This assumes we will never change the order of the array key in the set, otherwise the loops will be
  // exponential in relation to how many arguments are in the keys
  for (let i = 0; i < key1.length; i++) {
    if (key1[i] !== key2[i]) return false
  }

  return true
}

export function functionCaching<T extends Array<any>, V>() {
  const refs: ArgsToValueMapType<T, V> = new Map()

  function removeFromRef(argsKey: T) {
    for (const [key] of refs) {
      if (areArraysMatchingRef(key, argsKey)) {
        refs.delete(key)
        return
      }
    }
  }

  function getFromRef(argsKey: T): V | undefined {
    for (const [key, value] of refs) {
      if (areArraysMatchingRef(key, argsKey)) {
        return value
      }
    }
  }

  function addToRef(argsKey: T, facet: V) {
    const existingRecord = getFromRef(argsKey)
    if (existingRecord) {
      return
    }
    refs.set(argsKey, facet)
  }

  return {
    refs,
    addToRef,
    removeFromRef,
    getFromRef,
  }
}
