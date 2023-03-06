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
