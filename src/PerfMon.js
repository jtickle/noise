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

const PerfMon = ({ perf }) => {
  const [data, setData] = React.useState({})

  React.useEffect(() => {
    perf.then(data => {
      setData(data)
    }, _ => {})
  })

  return (
    <div className="performance">
      {Object.entries(data).map(([key, value]) =>
        <p key={key}>{key}{String(value).padStart(8, '.')}</p>)}
    </div>
  )
}

PerfMon.propTypes = {
  perf: PropTypes.instanceOf(Promise).isRequired
}

export default PerfMon
