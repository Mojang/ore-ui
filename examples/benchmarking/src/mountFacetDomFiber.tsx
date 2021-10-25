import { render } from '@react-facet/dom-fiber'
import { times } from 'ramda'
import React, { useEffect, useState } from 'react'

const DATA = times((index) => index, 10)

/**
 * Test screen that always keeps mounting and unmounting components
 */
function Performance() {
  const [firstGroup, setFirstGroup] = useState<boolean>(true)

  useEffect(() => {
    const tick = () => {
      setFirstGroup((firstGroup) => !firstGroup)
      id = requestAnimationFrame(tick)
    }

    let id = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(id)
    }
  }, [])

  return (
    <div>
      {firstGroup && DATA.map((value, index) => <ComplexComponent key={index} value={value} />)}
      {!firstGroup && DATA.map((value, index) => <ComplexComponent key={index} value={value} />)}
    </div>
  )
}

const ComplexComponent = ({ value }: { value: number }) => {
  return (
    <div style={{ position: 'absolute', top: '0px', backgroundColor: 'white', color: 'black' }}>
      <div>Text</div>
      <div>More text</div>
      <div>
        <div>Stuff nested</div>
        <span>More stuff</span>
      </div>
      <div>
        <div>
          <div>
            <div>Stuff nested</div>
            <span>More stuff</span>
            <div>{value}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

document.body.innerHTML = '<div id="root"/>'
render(<Performance />, document.getElementById('root'))
