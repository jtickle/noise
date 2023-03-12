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

import { makeNoise2D } from 'fast-simplex-noise'
import fastRandom from 'fast-random'

// const start = performance.now()
const noise2D = [1, 2, 3].map((n) => {
  const generator = fastRandom(n)
  return makeNoise2D(generator.nextFloat)
})
// console.log(`Generated noise2d in ${performance.now() - start}ms`)

function simple1d () {
  return (x) => x
}

function simplePow1d () {
  return (x) => Math.pow((x * 2 - 1), 2)
}

function cos1d () {
  return (x) => Math.cos(x * 4 * Math.PI) / 2 + 0.5
}

function absCos1d () {
  return (x) => Math.abs(Math.cos(x * 2 * Math.PI))
}

function invAbsSin1d () {
  return (x) => -Math.abs(Math.sin(x * 2 * Math.PI)) + 1
}

function simple2d () {
  return (x, y) => x * y
}

function cos2d () {
  return (x, y) => Math.cos(x * 5 * Math.PI) * Math.cos(y * 5 * Math.PI) / 2 + 0.5
}

function noise2d () {
  return (x, y, c) => {
    if (typeof c === 'undefined') c = 0
    return noise2D[c](x * 20, y * 20) / 2 + 0.5
  }
}

function fractal2d (amplitude, frequency, octaves, persistence) {
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

function multFractal2d (amplitude, frequency, octaves, persistence) {
  return (x, y, c) => {
    if (typeof c === 'undefined') c = 0
    x = x * 20
    y = y * 20
    let value = 1.0
    for (let octave = 0; octave < octaves; octave++) {
      const freq = frequency * Math.pow(2, octave)
      value *= noise2d(x * freq, y * freq, c) *
        (amplitude * Math.pow(persistence, octave))
    }
    return value * (6)
  }
}

export default {
  simple1d,
  simplePow1d,
  cos1d,
  absCos1d,
  invAbsSin1d,
  simple2d,
  cos2d,
  noise2d,
  fractal2d,
  multFractal2d
}
