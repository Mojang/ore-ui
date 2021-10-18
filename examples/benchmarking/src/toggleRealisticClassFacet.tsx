import { render } from '@react-facet/dom-fiber'
import { useFacetState } from '@react-facet/core'
import React, { useEffect } from 'react'

function Performance() {
  const [className, setClassName] = useFacetState('blue')

  useEffect(() => {
    let frameId: number

    const update = () => {
      setClassName((className) => (className === 'blue' ? 'red' : 'blue'))
      frameId = requestAnimationFrame(update)
    }

    update()

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [setClassName])

  return (
    <div>
      <p className="highlighted">Hello World</p>
      <div>
        <p>This renders a more realistic component, with more elements.</p>
      </div>
      <fast-div className={className}>Flashing</fast-div>
      <div>This might be something else</div>
      <button className="primary" onClick={noop}>
        Do nothing.
      </button>
    </div>
  )
}

const noop = () => {}

document.body.innerHTML = `
<div id="root"></div>

<style>
	.highlighted {
		font-weight: bold;
	}

	.primary {
		border: 2px solid black;
	}

	.red {
		background: #caadbc;
	}

	.blue {
		background: #bdbcbd;
	}
</style>
`

render(<Performance />, document.getElementById('root'))
