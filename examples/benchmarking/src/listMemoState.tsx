import { render } from 'react-dom'
import React, { useEffect, useState, memo } from 'react'

interface Data {
  name: string
  health: number
}

const initialData = Array.from({ length: 2000 }, (): Data => ({ name: 'player', health: 10 }))

export const Performance = () => {
  const [data, setData] = useState({ data: initialData })

  useEffect(() => {
    let frameId: number

    const tick = () => {
      setData(({ data }) => {
        data[0].health = data[0].health === 10 ? 5 : 10

        // forces re-render by using a new object (since we are mutating)
        return { data }
      })

      frameId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      {data.data.map((item, index) => (
        <ListItem key={index} health={item.health} name={item.name} />
      ))}
    </>
  )
}

const ListItem = memo(({ health, name }: Data) => {
  useEffect(() => {
    randomWork(health)
  }, [health])

  useEffect(() => {
    randomWork(name)
  }, [name])

  useEffect(() => {
    randomWork(name)
  }, [name])

  useEffect(() => {
    randomWork(name)
  }, [name])

  return null
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const randomWork = (name: string | number) => Math.random()

document.body.innerHTML = '<div id="root"/>'
render(<Performance />, document.getElementById('root'))
