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
import PropTypes from 'prop-types'

import PerfMon from './PerfMon'

const Canvas2D = ({ render, ratio }) => {
  const canvas = React.useRef()

  const [dimension, setDimension] = React.useState({
    width: 0,
    height: 0
  })

  function handleResize () {
    const width = Math.floor(canvas.current.parentElement.clientWidth)
    const height = Math.floor(width * ratio)
    setDimension({ width, height })
  }

  // Handle resize event
  React.useEffect(() => {
    // TODO: use window.ResizeObserver if exists
    // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
    window.addEventListener('resize', handleResize)
    if (dimension.width === 0) handleResize()
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  // This unfortunate trick allows us to get the performance data
  // after the render happens and pass it to the PerfMon child via
  // promise, which should not trigger re-render for the canvas
  const perf = new Promise((resolve, reject) => {
    React.useEffect(() => {
      // If we don't have a size yet, clean up and don't bother rendering
      if (dimension.width === 0) {
        reject(new Error('Canvas does not yet have a size'))
        return
      }

      // Set up the imageData for rendering
      const context = canvas.current.getContext('2d')
      const imageData = context.createImageData(dimension.width, dimension.height)

      // Render the canvas (or promise to)
      render(imageData, dimension).then((result) => {
        // Report performance after render job is complete
        resolve({
          'Render Time': result.runtime,
          'Thread Time': result.threadtime,
          'Queue Time': result.queuetime,
          'Min Val': result.min,
          'Max Val': result.max
        })
        // Paint the canvas
        context.putImageData(result.imageData, 0, 0)
      })
    })
  })

  return (
    <div className="canvas2d">
      <canvas ref={canvas} height={dimension.height} width={dimension.width} />
      <PerfMon perf={perf}/>
    </div>
  )
}

Canvas2D.propTypes = {
  render: PropTypes.func.isRequired,
  ratio: PropTypes.number.isRequired
}

export default Canvas2D
