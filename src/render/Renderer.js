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

/**
 * Render one row and repeat it for all Y, monochrome
 * @param {function} algorithm
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 */
function renderX (algorithm, imageData, dimension) {
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  const { width, height } = dimension

  const row = new Uint8ClampedArray(width * 4)
  for (let i = 0; i < width; i++) {
    const value = Math.floor(algorithm(i / width) * 255)
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
  return { imageData, min, max }
}

/**
 * Render each pixel, monochrome
 * @param {function} algorithm
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 */
function renderXY (algorithm, imageData, dimension) {
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  const { width, height } = dimension

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      // eslint-disable-next-line no-unused-vars
      const value = Math.floor(algorithm(x / width, y / height) * 255)
      if (value > max) max = value
      if (value < min) min = value
      imageData.data[y * width * 4 + x * 4 + 0] = value
      imageData.data[y * width * 4 + x * 4 + 1] = value
      imageData.data[y * width * 4 + x * 4 + 2] = value
      imageData.data[y * width * 4 + x * 4 + 3] = 255
    }
  }

  return { imageData, min, max }
}

/**
 * Render each pixel with color component
 * @param {function} algorithm
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 */
function renderXYC (algorithm, imageData, dimension) {
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  const { width, height } = dimension

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      // eslint-disable-next-line no-unused-vars
      const Rvalue = Math.floor(algorithm(x / width, y / height, 0) * 255)
      const Gvalue = Math.floor(algorithm(x / width, y / height, 1) * 255)
      const Bvalue = Math.floor(algorithm(x / width, y / height, 2) * 255)
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

  return { imageData, min, max }
}

export default {
  renderX,
  renderXY,
  renderXYC
}
