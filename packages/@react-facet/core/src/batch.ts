export type Task = () => void

let batchId = 0
let scheduledBatches = new Set<Task>()

export const scheduleUpdate = (task: Task) => {
  if (batchId === 0) {
    task()
    return
  }

  scheduledBatches.add(task)
}

export const batch = (cb: Task) => {
  batchId += 1

  cb()

  batchId -= 1

  // We are back at the root batch call
  if (batchId === 0) {
    // Make a copy of the schedule
    // As notifying can start other batch roots
    const array = Array.from(scheduledBatches)
    scheduledBatches = new Set<Task>()

    for (const task of array) {
      task()
    }
  }
}
