/* Experiments with Dunamic Texturing
 * Copyright (C) 2022  Jeffrey W. Tickle
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import Canvas2D from './Canvas2D.js'

import { makeNoise2D } from 'open-simplex-noise'

import './App.css'

function simpleFn (x) {
  return x
}

function simpleQuadFn (x) {
  return Math.pow((x * 2 - 1), 2)
}

function cosFn (x) {
  return Math.cos(x * 4 * Math.PI) / 2 + 0.5
}

function absCosFn (x) {
  return Math.abs(Math.cos(x * 2 * Math.PI))
}

function nAbsSinFn (x) {
  return -Math.abs(Math.sin(x * 2 * Math.PI)) + 1
}

function simple2dFn (x, y) {
  return x * y
}

function cos2dFn (x, y) {
  return Math.cos(x * 5 * Math.PI) * Math.cos(y * 5 * Math.PI) / 2 + 0.5
}

const start = performance.now()
const noise2D = makeNoise2D(3)
console.log(`Generated noise2d in ${performance.now() - start}ms`)
function noise2dFn (x, y) {
  return noise2D(x * 20, y * 20) / 2 + 0.5
}

function mkFractal2dFn (amplitude, frequency, octaves, persistence) {
  return (x, y) => {
    x = x * 20
    y = y * 20
    let value = 0.0
    for (let octave = 0; octave < octaves; octave++) {
      const freq = frequency * Math.pow(2, octave)
      value += noise2D(x * freq, y * freq) *
        (amplitude * Math.pow(persistence, octave))
    }
    return value / (2 - 1 / Math.pow(2, octaves - 1)) / 4 + 0.5
  }
}

function mkMultFractal2dFn (amplitude, frequency, octaves, persistence) {
  return (x, y) => {
    // x = x * 20
    // y = y * 20
    let value = 1.0
    for (let octave = 0; octave < octaves; octave++) {
      const freq = frequency * Math.pow(2, octave)
      // value += noise2D(x * freq, y * freq) *
      value *= noise2dFn(x * freq, y * freq) *
        (amplitude * Math.pow(persistence, octave))
    }
    // More Dramatic
    // return value / (2 - 1 / Math.pow(2, octaves - 1)) * 32
    // Brighter
    return Math.log2(value / (2 - 1 / Math.pow(2, octaves - 1))) / 12 + 1.5
  }
}

/** @param {CanvasRenderingContext2D} context  */
function drawFactoryXOnly (fn) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width
   * @param {number} height
   */
  return (context, width, height) => {
    width = Math.floor(width)
    height = Math.floor(height)

    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE

    if (width === 0) return [0, 0]
    const imageData = context.createImageData(width, height)

    const row = new Uint8ClampedArray(width * 4)
    for (let i = 0; i < width; i++) {
      const value = Math.floor(fn(i / width) * 255)
      if (value > max) max = value
      if (value < min) min = value
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

    return [min, max]
  }
}

/** @param {CanvasRenderingContext2D} context */
function drawFactoryXY (fn) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width
   * @param {number} height
   */
  return (context, width, height) => {
    width = Math.floor(width)
    height = Math.floor(height)

    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE

    if (width === 0) return [0, 0]
    const imageData = context.createImageData(width, height)

    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        // eslint-disable-next-line no-unused-vars
        const value = Math.floor(fn(x / width, y / height) * 255)
        if (value > max) max = value
        if (value < min) min = value
        imageData.data[y * width * 4 + x * 4 + 0] = value
        imageData.data[y * width * 4 + x * 4 + 1] = value
        imageData.data[y * width * 4 + x * 4 + 2] = value
        imageData.data[y * width * 4 + x * 4 + 3] = 255
      }
    }

    context.putImageData(imageData, 0, 0)

    return [min, max]
  }
}

function App () {
  return (
    <div className="App">
      <h1>1D Experiments</h1>
      <h2>f(x) = x</h2>
      <Canvas2D draw={drawFactoryXOnly(simpleFn)} ratio={0.2}/>
      <h2>f(x) = (2x - 1)<sup>2</sup></h2>
      <Canvas2D draw={drawFactoryXOnly(simpleQuadFn)} ratio={0.2}/>
      <h2>f(x) = abs(cos(x * 2pi))</h2>
      <Canvas2D draw={drawFactoryXOnly(absCosFn)} ratio={0.2}/>
      <h2>f(x) = cos(x * 4pi) / 2 + 0.5</h2>
      <Canvas2D draw={drawFactoryXOnly(cosFn)} ratio={0.2}/>
      <h2>f(x) = -abs(sin(x * 2pi)) + 1</h2>
      <Canvas2D draw={drawFactoryXOnly(nAbsSinFn)} ratio={0.2}/>
      <h1>2D Experiments</h1>
      <h2>f(x) = x * y</h2>
      <Canvas2D draw={drawFactoryXY(simple2dFn)} ratio={0.6}/>
      <h2>f(x) = cos(x) * cos(y)</h2>
      <Canvas2D draw={drawFactoryXY(cos2dFn)} ratio={0.6}/>
      <h2>f(x) = noise2D(x, y)</h2>
      <Canvas2D draw={drawFactoryXY(noise2dFn)} ratio={0.6}/>
      <h2>f(x) = fractal2D(x, y)</h2>
      <Canvas2D draw={drawFactoryXY(mkFractal2dFn(1, 0.1, 8, 1.0))} ratio={0.6}/>
      <h2>f(x) = multFractal2D(x, y)</h2>
      <Canvas2D draw={drawFactoryXY(mkMultFractal2dFn(1, 0.1, 8, 1.0))} ratio={0.6}/>
    </div>
  )
}

export default App
