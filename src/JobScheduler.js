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

class JobScheduler {
  #workers
  #busy
  #start
  #queue

  constructor (WorkerConstructor, n) {
    this.#workers = []
    this.#busy = []
    this.#start = []
    for (let i = 0; i < n; i++) {
      this.#workers.push(new WorkerConstructor())
      this.#busy.push(false)
      this.#start.push(-1)
    }

    this.#queue = []

    this.#handleComplete.bind(this)
    this.#run.bind(this)
    this.#getFree.bind(this)
    this.#report.bind(this)
    this.#processQueue.bind(this)
    this.schedule.bind(this)
  }

  #handleComplete (worker, queueStart, resolve, result) {
    console.log(`Job complete on worker ${worker}`, result)
    result.threadtime = performance.now() - this.#start[worker]
    result.queuetime = performance.now() - queueStart
    resolve(result)
    this.#start[worker] = -1
    this.#busy[worker] = false

    this.#processQueue()
  }

  #run (worker, job) {
    if (this.#busy[worker]) {
      console.error(`Requested to run job on worker ${worker} but it is not free`, job)
    }

    this.#busy[worker] = true
    this.#start[worker] = performance.now()

    const { parameters, resolve, reject, queueStart } = job
    console.log(`Executing job on worker ${worker}`, parameters)

    this.#workers[worker].run(...parameters).then(
      (result) => {
        this.#handleComplete(worker, queueStart, resolve, result)
      },
      (error) => {
        this.#handleComplete(worker, queueStart, reject, error)
      }
    )
  }

  #getFree () {
    return this.#busy.findIndex((x) => !x)
  }

  #report () {
    const jobs = this.#busy.reduce((a, v) => v ? a + 1 : a) || 0
    const queue = this.#queue.length
    console.log(`There are ${jobs} jobs running and ${queue} queued.`)
  }

  #processQueue () {
    const freeWorker = this.#getFree()

    if (freeWorker > -1) {
      const job = this.#queue.shift()
      if (job) this.#run(freeWorker, job)
    }

    this.#report()
  }

  schedule (...parameters) {
    return new Promise((resolve, reject) => {
      this.#queue.push({
        parameters,
        resolve,
        reject,
        queueStart: performance.now()
      })
      console.log('Queued new job', parameters)
      this.#processQueue()
    })
  }
}

export default JobScheduler
