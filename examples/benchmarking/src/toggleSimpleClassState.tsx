import { render } from 'react-dom'
import React, { useEffect, useState } from 'react'

function Performance() {
  const [className, setClassName] = useState('blue')

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

  return <div className={className}>Hello World</div>
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
