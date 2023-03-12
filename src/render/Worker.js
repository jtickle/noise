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

import algorithm from './Algorithms.js'
import renderer from './Renderer.js'

function log (...args) {
  // eslint-disable-next-line no-undef
  self.postMessage({
    type: 'log',
    msg: args
  })
}
// eslint-disable-next-line no-undef
self.log = log

/**
 * Prepare an individual algorithm for execution
 * @param {Array} command
 */
function prepare (command) {
  const cmd = command.shift()
  if (typeof algorithm[cmd] !== 'function') {
    log('Invalid Algorithm', cmd)
  }

  return algorithm[cmd](...command)
}

function execute (params) {
  if (typeof renderer[params.renderer] !== 'function') {
    log('Invalid Renderer', params)
  }

  const start = performance.now()
  const result = renderer[params.renderer](
    prepare(params.algorithm),
    params.imageData,
    params.dimension)
  result.runtime = performance.now() - start
  result.type = 'result'

  // eslint-disable-next-line no-undef
  self.postMessage(result)
}

/**
 * Web Worker message handler
 *
 * @param {MessageEvent} e
 */
// eslint-disable-next-line no-undef
self.onmessage = (e) => {
  execute(e.data)
}
