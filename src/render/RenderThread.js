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

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./Worker.js'

class RenderThread {
  constructor () {
    this.worker = new Worker()
    this.worker.addEventListener('message', this.handleMessage.bind(this))
    this.awaitingResult = false
  }

  handleMessage (message) {
    switch (message.data.type) {
      case 'log':
        console.log(...message.data.msg)
        break
      case 'result':
        delete message.data.type
        this.handleResult(message.data)
        break
      default:
        console.log('Unrecognized message type', message.data)
    }
  }

  handleResult (result) {
    if (this.awaitingResult === false) {
      console.log('Received result but wasn\'t awaiting', result)
      return
    }

    const resolve = this.awaitingResult.resolve
    this.awaitingResult = false
    resolve(result)
  }

  /**
   * Runs a Render job on this thread
   * @param {string} renderer
   * @param {string} algorithm
   * @param {ImageData} imageData
   * @param {object} dimension
   * @returns {PromiseLike<ImageData>}
   */
  run (renderer, algorithm, imageData, dimension) {
    // Return a promise that the work will be done
    return new Promise((resolve, reject) => {
      // Set to awaitingResult state and save the resolver for later
      this.awaitingResult = { resolve, reject }

      // Run the job
      this.worker.postMessage({
        renderer,
        algorithm,
        imageData,
        dimension
      })
    })
  }
}

export default RenderThread
