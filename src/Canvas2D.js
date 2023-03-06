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

const Canvas2D = ({ draw, ratio }) => {
  const canvas = React.useRef()

  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    // Pass canvas to draw function
    draw(canvas.current.getContext('2d'), width, width * ratio)

    // Deal with container resize
    function handleResize () {
      setWidth(canvas.current.parentElement.clientWidth)
    }
    window.addEventListener('resize', handleResize)
    if (width === 0) {
      handleResize()
    }
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <canvas ref={canvas} height={width * ratio} width={width} />
  )
}

Canvas2D.propTypes = {
  draw: PropTypes.func.isRequired,
  ratio: PropTypes.number.isRequired
}

export default Canvas2D
