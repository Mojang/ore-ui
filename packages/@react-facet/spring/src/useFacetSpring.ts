import { Facet, NO_VALUE, useFacetLayoutEffect, useFacetMap, useFacetState } from '@react-facet/core'
import stepper from './stepper'

type UseFacetSpringOptions = {
  damping?: number
  stiffness?: number
  precision?: number
}

type AnimationState = [number, number]

export function useFacetSpring(targetFacet: Facet<number>, options?: UseFacetSpringOptions) {
  const [state, setState] = useFacetState<AnimationState>(NO_VALUE)

  const damping = options?.damping ?? 26
  const stiffness = options?.stiffness ?? 170
  const precision = options?.precision ?? 0.01

  useFacetLayoutEffect(
    (target) => {
      let frameID: number
      let previousTimestamp: number

      const tick = (now: number) => {
        const secondsPerFrame = previousTimestamp == null ? 1 / 60 : (now - previousTimestamp) / 1000
        previousTimestamp = now

        setState((currentState) => {
          if (currentState === NO_VALUE) return [target, 0]

          const [currentXPosition, currentVelocity] = currentState

          const nextState = stepper(
            secondsPerFrame,
            currentXPosition,
            currentVelocity,
            target,
            stiffness,
            damping,
            precision,
          )

          if (nextState[0] !== target) {
            frameID = requestAnimationFrame(tick)
          }

          return nextState
        })
      }

      frameID = requestAnimationFrame(tick)

      return () => cancelAnimationFrame(frameID)
    },
    [damping, stiffness, precision, setState],
    [targetFacet],
  )

  return useFacetMap(([currentXPosition]) => currentXPosition, [], [state])
}
