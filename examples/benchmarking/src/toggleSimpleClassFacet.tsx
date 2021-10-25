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

  return <fast-div className={className}>Hello World</fast-div>
}

document.body.innerHTML = `
<div id="root"></div>

<style>
	.red {
		background: #caadbc;
	}

	.blue {
		background: #bdbcbd;
	}
</style>
`

render(<Performance />, document.getElementById('root'))
