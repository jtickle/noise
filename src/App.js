import React from 'react'
import Canvas2D from './Canvas2D.js'

import './App.css'

function absCosFn (x, c) {
  return Math.abs(Math.cos(x * 2 * Math.PI))
}

function cosFn (x, c) {
  return Math.cos(x * 4 * Math.PI) / 2 + 0.5
}

function simpleFn (x, c) {
  return x
}

/** @param {CanvasRenderingContext2D} context  */
function drawFactoryXOnly (fn) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width
   * @param {number} height
   */
  return (context, width, height) => {
    if (width === 0) return
    const imageData = context.createImageData(width, height)

    const row = new Uint8ClampedArray(width * 4)
    for (let i = 0; i < width; i++) {
      const value = Math.floor(fn(i / width) * 255)
      row[i * 4 + 0] = value
      row[i * 4 + 1] = value
      row[i * 4 + 2] = value
      row[i * 4 + 3] = 255
    }
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width * 4; j++) {
        imageData.data[i * width * 4 + j] = row[j]
      }
    }

    context.putImageData(imageData, 0, 0)
  }
}

function App () {
  return (
    <div className="App">
      <h1>f(x) = x</h1>
      <Canvas2D draw={drawFactoryXOnly(simpleFn)} ratio={0.2}/>
      <h1>f(x) = cos(x * 4pi) / 2 + 0.5</h1>
      <Canvas2D draw={drawFactoryXOnly(cosFn)} ratio={0.2}/>
      <h1>f(x) = abs(cos(x * 2pi))</h1>
      <Canvas2D draw={drawFactoryXOnly(absCosFn)} ratio={0.2}/>
    </div>
  )
}

export default App
