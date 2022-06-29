import { Value, NoValue } from '../types'
import { hasDefinedValue } from './hasDefinedValue'

export const areAllDefinedValues = (facetValues: (Value | NoValue)[]) => {
  for (let i = 0; i < facetValues.length; i++) {
    if (!hasDefinedValue(facetValues[i])) {
      return false
    }
  }
  return true
}
