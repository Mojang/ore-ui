import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'

const ProgressBar = ({ progress }: { progress: number }) => {
  const width = `${progress * 20}px`

  return (
    <div style={{ padding: '2px', border: '2px solid #E60F58', width: '200px' }}>
      <div
        style={{
          height: '10px',
          backgroundColor: '#E60F58',
          width,
        }}
      />
    </div>
  )
}

const App = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frameId: number

    const update = () => {
      setProgress((progress) => (progress === 0 ? 10 : 0))
      frameId = requestAnimationFrame(update)
    }

    update()

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [setProgress])

  return <ProgressBar progress={progress} />
}

document.body.innerHTML = `<div id="root"></div>`
render(<App />, document.getElementById('root'))
