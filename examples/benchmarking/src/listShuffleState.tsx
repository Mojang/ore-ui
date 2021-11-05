import { render } from '@react-facet/dom-fiber'
import React, { useEffect, useState } from 'react'

interface Data {
  name: string
  health: number
  key: number
}

const initialData = Array.from({ length: 10 }, (_, key): Data => ({ name: 'player', health: key, key }))

export const Performance = () => {
  const [data, setDataFacet] = useState({ data: initialData })

  useEffect(() => {
    let frameId: number

    const tick = () => {
      setDataFacet(({ data }) => {
        const indexA = Math.floor(Math.random() * data.length)
        const indexB = Math.floor(Math.random() * data.length)

        const valueA = data[indexA]
        const valueB = data[indexB]

        data[indexA] = valueB
        data[indexB] = valueA

        return { data }
      })

      frameId = setTimeout(tick, 1000)
    }

    tick()

    return () => {
      clearTimeout(frameId)
    }
  }, [setDataFacet])

  return (
    <>
      {data.data.map((item) => (
        <ListItem key={item.key} health={item.health} />
      ))}
    </>
  )
}

const ListItem = ({ health }: { health: number }) => {
  return <div>{health}</div>
}

document.body.innerHTML = '<div id="root"/>'
render(<Performance />, document.getElementById('root'))
