import { createRoot } from 'react-dom/client'
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

document.body.innerHTML = '<div id="root"/>'
const element = document.getElementById('root')
if (element != null) {
  const root = createRoot(element)
  root.render(<Performance />)
}
