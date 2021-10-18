import React, { useEffect } from 'react'
import { render } from '@react-facet/dom-fiber'
import { useFacetState, Facet, useFacetMap, NO_VALUE, Map } from '@react-facet/core'
import { times } from 'ramda'

interface Marker {
  x: number
  y: number
}

function Marker({ marker }: { marker: Facet<Marker> }) {
  const leftValue = useFacetMap(({ x }) => x * 1920, [], [marker])
  const topValue = useFacetMap(({ y }) => y * 1080, [], [marker])

  return (
    <fast-div
      className={'123'}
      style={{
        width: '4rem',
        height: '4rem',
        backgroundColor: 'green',
        position: 'absolute',
        topPX: topValue,
        leftPX: leftValue,
      }}
    />
  )
}

function Performance() {
  const [testingFacet, setTestingFacet] = useFacetState(times(() => ({ x: Math.random(), y: Math.random() }), 1000))

  useEffect(() => {
    let frameId: number

    const update = () => {
      setTestingFacet((testing) => {
        if (testing === NO_VALUE) return []

        for (let i = 0; i < testing.length; i++) {
          testing[i].x = Math.random()
          testing[i].y = Math.random()
        }

        return testing
      })

      frameId = window.requestAnimationFrame(update)
    }

    update()

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [setTestingFacet])

  return (
    <div style={{ width: '1920px', height: '1080px', position: 'relative' }}>
      <Map array={testingFacet}>{(item, index) => <Marker key={index} marker={item} />}</Map>
    </div>
  )
}

document.body.innerHTML = '<div id="root"/>'
render(<Performance />, document.getElementById('root'))
