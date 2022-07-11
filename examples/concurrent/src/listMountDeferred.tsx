import { createRoot } from 'react-dom/client'
import React, { useEffect, useState } from 'react'
import { useFacetUnwrap } from '@react-facet/core'
import { DeferredMount, DeferredMountProvider, useIsDeferring } from '@react-facet/deferred-mount'

interface Data {
  name: string
  health: number
}

const allData = Array.from({ length: 2000 }, (): Data => ({ name: 'player', health: 10 }))

export const ListConcurrent = () => {
  const [data, setData] = useState<Data[]>([])
  const isDeferring = useFacetUnwrap(useIsDeferring())

  useEffect(() => {
    const tick = () => {
      setData(allData)
    }

    setTimeout(tick, 2000)
  }, [])

  return (
    <>
      <input />
      <div></div>
      <div></div>
      {isDeferring != true ? 'done' : <Spinner />}
      <List data={data} />
    </>
  )
}

const List = ({ data }: { data: Data[] }) => {
  return (
    <>
      {data.map((item, index) => (
        <DeferredMount>
          <ListItem key={index} />
        </DeferredMount>
      ))}
    </>
  )
}

const ListItem = () => {
  return (
    <div style={{ width: 200, height: 20, backgroundColor: 'red', margin: 2 }}>
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

const Spinner = () => {
  return (
    <div style={{ animation: '1.5s linear infinite spinner', width: 40, height: 40, border: '4px solid red' }}></div>
  )
}

document.body.innerHTML = `
<style>
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
<div id="root"/>
`
const domElement = document.getElementById('root')

if (domElement) {
  const root = createRoot(domElement)
  root.render(
    <DeferredMountProvider>
      <ListConcurrent />
    </DeferredMountProvider>,
  )
}
