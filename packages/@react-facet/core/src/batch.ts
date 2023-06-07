export type Task = () => void

let batchId = 0
let scheduledBatches = new Set<Task>()
const taskCounter = new Map<Task, number>()

export const scheduleUpdate = (task: Task) => {
  if (batchId === 0) return false

  if (scheduledBatches.has(task)) {
    console.log('⚠️This would execute twice on this frame!')
  }

  const currentCount = taskCounter.get(task) ?? 0
  taskCounter.set(task, currentCount + 1)

  scheduledBatches.add(task)
  return true
}

export const batch = (cb: Task) => {
  batchId += 1

  cb()

  batchId -= 1

  // We are back at the root batch call
  if (batchId === 0) {
    const taskCounterCopy = Array.from(taskCounter)
    taskCounter.clear()

    const optimizedCount = taskCounterCopy.filter(([_, count]) => count > 1).length
    if (taskCounterCopy.length > 0) {
      console.log(`⚒️ Total: ${taskCounterCopy.length}. Optimized: ${optimizedCount}`)
    }

    // Make a copy of the schedule
    // As notifying can start other batch roots
    const array = Array.from(scheduledBatches)
    scheduledBatches = new Set<Task>()

    for (const task of array) {
      task()
    }
  }
}
