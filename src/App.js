/* Experiments with Dynamic Texturing
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
import { makeNoise2D } from 'fast-simplex-noise'
import fastRandom from 'fast-random'

import Canvas2D from './Canvas2D.js'

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
const noise2D = [1, 2, 3].map((n) => {
  const generator = fastRandom(n)
  return makeNoise2D(generator.nextFloat)
})
console.log(`Generated noise2d in ${performance.now() - start}ms`)
function noise2dFn (x, y, c) {
  if (typeof c === 'undefined') c = 0
  return noise2D[c](x * 20, y * 20) / 2 + 0.5
}

function mkFractal2dFn (amplitude, frequency, octaves, persistence) {
  return (x, y, c) => {
    if (typeof c === 'undefined') c = 0
    x = x * 10
    y = y * 10
    let value = 0.0
    for (let octave = 0; octave < octaves; octave++) {
      const freq = frequency * Math.pow(2, octave)
      value += noise2D[c](x * freq, y * freq) *
        (amplitude * Math.pow(persistence, octave))
    }
    return value / (2 - 1 / Math.pow(2, octaves - 1)) / 2 + 0.5
  }
}

function mkMultFractal2dFn (amplitude, frequency, octaves, persistence) {
  return (x, y, c) => {
    if (typeof c === 'undefined') c = 0
    x = x * 20
    y = y * 20
    let value = 1.0
    for (let octave = 0; octave < octaves; octave++) {
      const freq = frequency * Math.pow(2, octave)
      value *= noise2dFn(x * freq, y * freq, c) *
        (amplitude * Math.pow(persistence, octave))
    }
    return value * (6)
  }
}

/** @param {CanvasRenderingContext2D} context  */
function drawFactoryXOnly (fn) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width
   * @param {number} height
   */
  return (imageData, width, height) => {
    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE

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
    return [imageData, min, max]
  }
}

/** @param {CanvasRenderingContext2D} context */
function drawFactoryXY (fn) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width
   * @param {number} height
   */
  return (imageData, width, height) => {
    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE

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

    return [imageData, min, max]
  }
}

// eslint-disable-next-line no-unused-vars
function drawFactoryXYC (fn) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} width
   * @param {number} height
   */
  return (imageData, width, height) => {
    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE

    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        // eslint-disable-next-line no-unused-vars
        const Rvalue = Math.floor(fn(x / width, y / height, 0) * 255)
        const Gvalue = Math.floor(fn(x / width, y / height, 1) * 255)
        const Bvalue = Math.floor(fn(x / width, y / height, 2) * 255)
        if (Rvalue > max) max = Rvalue
        if (Rvalue < min) min = Rvalue
        if (Gvalue > max) max = Gvalue
        if (Gvalue < min) min = Gvalue
        if (Bvalue > max) max = Bvalue
        if (Bvalue < min) min = Bvalue
        imageData.data[y * width * 4 + x * 4 + 0] = Rvalue
        imageData.data[y * width * 4 + x * 4 + 1] = Gvalue
        imageData.data[y * width * 4 + x * 4 + 2] = Bvalue
        imageData.data[y * width * 4 + x * 4 + 3] = 255
      }
    }

    return [imageData, min, max]
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
      <Canvas2D draw={drawFactoryXY(mkFractal2dFn(1.0, 1.0, 8, 0.5))} ratio={1}/>
      <h2>f(x) = multFractal2D(x, y)</h2>
      <Canvas2D draw={drawFactoryXY(mkMultFractal2dFn(1, 0.1, 8, 1.0))} ratio={1}/>
      <h1>How about some COLOR</h1>
      <Canvas2D draw={drawFactoryXYC(noise2dFn)} ratio={1}/>
      <h2>f(x) = fractal2D(x, y)</h2>
      <Canvas2D draw={drawFactoryXYC(mkFractal2dFn(1, 0.1, 8, 1.0))} ratio={1}/>
      <h2>f(x) = multFractal2D(x, y)</h2>
      <Canvas2D draw={drawFactoryXYC(mkMultFractal2dFn(1, 0.1, 8, 1.0))} ratio={1}/>
    </div>
  )
}

App.mkFractal2dFn = mkFractal2dFn

export default App
