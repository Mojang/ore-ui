import { Reducer, Dispatch, useCallback } from 'react'
import { Option, Facet, EqualityCheck } from '../types'
import { defaultEqualityCheck } from '../equalityChecks'
import { useFacetState } from './useFacetState'
import { ReactFacetDevTools } from '@react-facet/dev-tools'

/**
 * Provides a parallel to React's useReducer, but instead returns a facet as the value
 *
 * @param reducer function that will take the previous state and an action to return a new state
 * @param initialState mandatory initial state for the reducer's facet
 * @param equalityCheck optional equality check (has a default checker)
 * @returns
 */
export const useFacetReducer = <S, A = string>(
  reducer: Reducer<Option<S>, A>,
  initialState: S,
  equalityCheck: EqualityCheck<S> = defaultEqualityCheck,
): [Facet<S>, Dispatch<A>] => {
  const [state, setState] = useFacetState(initialState, equalityCheck)

  const dispatch = useCallback<Dispatch<A>>(
    (action: A) => {
      setState((previousState) => reducer(previousState, action))
    },
    [reducer, setState],
  )

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((global as any).__REACT_FACET_DEVTOOLS_GLOBAL_HOOK__ as ReactFacetDevTools).send({
      hookName: 'useFacetReducer',
      newFacet: state,
    })
  }

  return [state, dispatch]
}
