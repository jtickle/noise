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

import Canvas2D from './Canvas2D.js'
import RenderThread from './render/RenderThread.js'
import JobScheduler from './JobScheduler.js'

import './App.css'

function App () {
  const scheduler = React.useMemo(() => new JobScheduler(RenderThread, 4))

  const render = (renderer, algorithm) => {
    return (imageData, dimension) => {
      return scheduler.schedule(renderer, algorithm, imageData, dimension)
    }
  }

  return (
    <div className="App">
      <h1>1D Experiments</h1>
      <h2>f(x) = x</h2>
      <Canvas2D render={render('renderX', ['simple1d'])} ratio={0.2}/>
      <h2>f(x) = (2x - 1)<sup>2</sup></h2>
      <Canvas2D render={render('renderX', ['simplePow1d'])} ratio={0.2}/>
      <h2>f(x) = abs(cos(x * 2pi))</h2>
      <Canvas2D render={render('renderX', ['cos1d'])} ratio={0.2}/>
      <h2>f(x) = cos(x * 4pi) / 2 + 0.5</h2>
      <Canvas2D render={render('renderX', ['absCos1d'])} ratio={0.2}/>
      <h2>f(x) = -abs(sin(x * 2pi)) + 1</h2>
      <Canvas2D render={render('renderX', ['invAbsSin1d'])} ratio={0.2}/>
      <h1>2D Experiments</h1>
      <h2>f(x) = x * y</h2>
      <Canvas2D render={render('renderXY', ['simple2d'])} ratio={0.6}/>
      <h2>f(x) = cos(x) * cos(y)</h2>
      <Canvas2D render={render('renderXY', ['cos2d'])} ratio={0.6}/>
      <h2>f(x) = noise2D(x, y)</h2>
      <Canvas2D render={render('renderXY', ['noise2d'])} ratio={0.6}/>
      <h2>f(x) = fractal2D(x, y)</h2>
      <Canvas2D render={render('renderXY', ['fractal2d', 1.0, 1.0, 8, 0.5])} ratio={1}/>
      <h2>f(x) = multFractal2D(x, y)</h2>
      <Canvas2D render={render('renderXY', ['multFractal2d', 1, 0.1, 8, 1.0])} ratio={1}/>
      <h1>How about some COLOR</h1>
      <Canvas2D render={render('renderXYC', ['noise2d'])} ratio={1}/>
      <h2>f(x) = fractal2D(x, y)</h2>
      <Canvas2D render={render('renderXYC', ['fractal2d', 1, 0.1, 8, 1.0])} ratio={1}/>
      <h2>f(x) = multFractal2D(x, y)</h2>
      <Canvas2D render={render('renderXYC', ['multFractal2d', 1, 0.1, 8, 1.0])} ratio={1}/>
    </div>
  )
}

export default App
