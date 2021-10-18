import { render } from 'react-dom'
import React, { useEffect, useState } from 'react'
import { times } from 'ramda'

interface Marker {
  x: number
  y: number
}

function Marker({ marker }: { marker: Marker }) {
  const leftValue = `${marker.x * 1920}px`
  const topValue = `${marker.y * 1080}px`

  return (
    <div
      className={'123'}
      style={{
        width: '4rem',
        height: '4rem',
        backgroundColor: 'green',
        position: 'absolute',
        top: topValue,
        left: leftValue,
      }}
    />
  )
}

function Performance() {
  const [testing, setTesting] = useState(() => times(() => ({ x: Math.random(), y: Math.random() }), 1000))

  useEffect(() => {
    let frameId: number

    const update = () => {
      setTesting((testing) => {
        return testing.map((value) => {
          value.x = Math.random()
          value.y = Math.random()
          return value
        })
      })

      frameId = window.requestAnimationFrame(update)
    }

    update()

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [setTesting])

  return (
    <div style={{ width: '1920px', height: '1080px', position: 'relative' }}>
      {testing.map((item, index) => (
        <Marker key={index} marker={item} />
      ))}
    </div>
  )
}

document.body.innerHTML = '<div id="root"/>'
render(<Performance />, document.getElementById('root'))
