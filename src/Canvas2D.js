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
import PropTypes from 'prop-types'

import EventBus from './EventBus'
import PerfMon from './PerfMon'

const Canvas2D = ({ draw, ratio }) => {
  const canvas = React.useRef()

  const [cwidth, setWidth] = React.useState(0)

  const bus = new EventBus()

  function drawCanvas () {
    const width = Math.floor(cwidth)
    const height = Math.floor(width * ratio)
    const context = canvas.current.getContext('2d')

    if (width === 0) return
    const initImageData = context.createImageData(width, height)

    const start = performance.now()
    const [imageData, min, max] = draw(initImageData, width, height)
    bus.extend({
      'Render Time': performance.now() - start,
      'Min Val': min,
      'Max Val': max
    })

    context.putImageData(imageData, 0, 0)
  }

  function handleResize () {
    setWidth(canvas.current.parentElement.clientWidth)
  }

  React.useEffect(() => {
    drawCanvas()

    window.addEventListener('resize', handleResize)
    if (cwidth === 0) {
      handleResize()
    }
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <>
      <canvas ref={canvas} height={cwidth * ratio} width={cwidth} />
      <PerfMon bus={bus}/>
    </>
  )
}

Canvas2D.propTypes = {
  draw: PropTypes.func.isRequired,
  ratio: PropTypes.number.isRequired
}

export default Canvas2D
