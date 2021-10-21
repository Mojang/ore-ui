import React from 'react'
import { render } from 'react-dom'

console.log(chrome.runtime.id)

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log('message received on panel', { request, sender })
})

console.log('LALAALALLALAL')

render(<h2>This is from React</h2>, document.getElementById('root'))

export {}
