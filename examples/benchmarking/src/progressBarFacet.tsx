import React, { useEffect } from 'react'
import { useFacetMap, Facet, useFacetState } from '@react-facet/core'
import { render } from '@react-facet/dom-fiber'

const ProgressBar = ({ progress }: { progress: Facet<number> }) => {
  const width = useFacetMap((progress) => `${progress * 20}px`, [], [progress])

  return (
    <div style={{ padding: '2px', border: '2px solid #E60F58', width: '200px' }}>
      <fast-div
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
  const [progress, setProgress] = useFacetState(0)

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
