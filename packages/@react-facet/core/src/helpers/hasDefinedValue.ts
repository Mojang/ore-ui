import { NoValue, NO_VALUE, Value } from '../types'

export const hasDefinedValue = (value: Value | NoValue): value is Value =>
  value !== undefined && value !== null && value !== NO_VALUE
