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

const PerfMon = ({ bus }) => {
  const [data, setData] = React.useState({})

  React.useEffect(() => {
    bus.addListener(setData)
    return _ => {
      bus.removeListener(setData)
    }
  })

  return Object.entries(data).map(([key, value]) => <p key={key}>{key}: {value}</p>)
}

PerfMon.propTypes = {
  bus: PropTypes.instanceOf(EventBus).isRequired
}

export default PerfMon
