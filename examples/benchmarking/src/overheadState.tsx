import { render } from 'react-dom'
import React, { useEffect, useState } from 'react'

function Performance() {
  const [value, setValue] = useState('blue')

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

  useEffect(() => {
    // and effect that does nothing
  }, [value])

  return null
}

document.body.innerHTML = `<div id="root"></div>`
render(<Performance />, document.getElementById('root'))
