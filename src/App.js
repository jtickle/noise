import React from 'react';
import Canvas from './Canvas.js';

import './App.css';

function draw(context) {

}

function App() {

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  })

  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div className="App">
      <Canvas draw={draw} height={dimensions.height} width={dimensions.width} />
    </div>
  );
}

export default App;
