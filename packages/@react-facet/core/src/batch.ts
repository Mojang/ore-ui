export type Cb = () => void

let batchId = -1
let scheduledBatches = new Set<Cb>()

export const scheduleUpdate = (update: Cb) => {
  if (batchId === -1) return false
  scheduledBatches.add(update)
  return true
}

export const batch = (cb: Cb) => {
  batchId += 1

  cb()

  batchId -= 1

  // We are back at the root batch call
  if (batchId === -1) {
    // Make a copy of the schedule
    // As notifying can start other batch roots
    const array = Array.from(scheduledBatches)
    scheduledBatches = new Set<Cb>()

    for (let index = array.length - 1; index >= 0; index--) {
      const notify = array[index]
      notify()
    }
  }
}
