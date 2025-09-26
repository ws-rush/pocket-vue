let queued = false
const queue: Function[] = []
const p = Promise.resolve()

export const nextTick = (fn?: () => void) => {
  if (fn) {
    return p.then(fn)
  } else {
    return p.then(() => {
      // Wait for all queued jobs to complete
      return new Promise(resolve => {
        const checkQueue = () => {
          if (queue.length === 0 && !queued) {
            resolve(undefined)
          } else {
            setTimeout(checkQueue, 0)
          }
        }
        checkQueue()
      })
    })
  }
}

export const queueJob = (job: Function) => {
  if (!queue.includes(job)) queue.push(job)
  if (!queued) {
    queued = true
    nextTick(flushJobs)
  }
}

const flushJobs = () => {
  for (const job of queue) {
    job()
  }
  queue.length = 0
  queued = false
}
