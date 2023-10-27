import { useFacetState, Facet, useFacetMap, useFacetEffect, NO_VALUE, Map } from '@react-facet/core'
import { render } from '@react-facet/dom-fiber'
import React, { useEffect } from 'react'

interface Data {
  name: string
  health: number
  index: number
}

const initialData = Array.from({ length: 2000 }, (_, index): Data => ({ name: 'player', health: 10, index }))

export const Performance = () => {
  const [dataFacet, setDataFacet] = useFacetState(initialData)

  useEffect(() => {
    let frameId: number

    const tick = () => {
      setDataFacet((data) => {
        if (data === NO_VALUE) return []

        data[0].health = data[0].health === 10 ? 5 : 10
        return data
      })

      frameId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [setDataFacet])

  return (
    <>
      <Map array={dataFacet} equalityCheck={dataEqualityCheck}>
        {(item) => <ListItem item={item} />}
      </Map>
    </>
  )
}

const ListItem = ({ item }: { item: Facet<Data> }) => {
  const health = useFacetMap((item) => item.health, [], [item])
  const name = useFacetMap((item) => item.name, [], [item])

  useFacetEffect(
    (health) => {
      randomWork(health)
    },
    [],
    [health],
  )

  useFacetEffect(
    (name) => {
      randomWork(name)
    },
    [],
    [name],
  )

  useFacetEffect(
    (name) => {
      randomWork(name)
    },
    [],
    [name],
  )

  useFacetEffect(
    (name) => {
      randomWork(name)
    },
    [],
    [name],
  )

  return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const randomWork = (name: string | number) => Math.random()

const dataEqualityCheck = () => {
  let previousName: string
  let previousHealth: number
  let previousIndex: number

  return (current: Data) => {
    if (current.name !== previousName || current.health !== previousHealth || current.index !== previousIndex) {
      previousName = current.name
      previousHealth = current.health
      previousIndex = current.index
      return false
    }

    return true
  }
}

document.body.innerHTML = '<div id="root"/>'
render(<Performance />, document.getElementById('root'))
