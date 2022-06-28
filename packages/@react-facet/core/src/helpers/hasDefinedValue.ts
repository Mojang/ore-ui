import { NoValue, NO_VALUE, Value } from '..'

export const hasDefinedValue = (value: Value | NoValue) => value != null && value !== NO_VALUE
