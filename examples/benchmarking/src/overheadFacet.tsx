import { render } from '@react-facet/dom-fiber'
import { useFacetState, useFacetEffect } from '@react-facet/core'
import React, { useEffect } from 'react'

function Performance() {
  const [value, setValue] = useFacetState('blue')

  useEffect(() => {
    let frameId: number

    const update = () => {
      setValue((className) => (className === 'blue' ? 'red' : 'blue'))
      frameId = requestAnimationFrame(update)
    }

    update()

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [setValue])

  useFacetEffect(
    () => {
      // and effect that does nothing
    },
    [],
    [value],
  )

  return null
}

document.body.innerHTML = `<div id="root"></div>`
render(<Performance />, document.getElementById('root'))
