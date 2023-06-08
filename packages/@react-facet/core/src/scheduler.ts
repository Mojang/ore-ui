import { Task, Batch } from './types'

let batchId = 0
const scheduledTasks = new Set<Task>()
const taskCounter = new Map<Task, number>()

/**
 * Schedules a given task to be executed at the end of a current batch, or runs it immediately if no batch is active.
 * @param task
 * @returns
 */
export const scheduleTask = (task: Task) => {
  if (batchId === 0) {
    task()
    return
  }

  if (process.env.NODE_ENV === 'development') {
    const currentCount = taskCounter.get(task) ?? 0
    taskCounter.set(task, currentCount + 1)
  }

  scheduledTasks.add(task)
}

/**
 * Starts a batch, scheduling Facet updates within the cb to be executed at the end of the batch.
 * @param b will be executed immediately to collect Facet changes
 */
export const batch = (b: Batch) => {
  // Starts a batch
  batchId += 1

  b()

  // If this is the root batch, we start executing the tasks
  if (batchId === 1) {
    if (process.env.NODE_ENV === 'development') {
      const taskCounterCopy = Array.from(taskCounter)
      taskCounter.clear()

      const optimizedCount = taskCounterCopy.filter((pair) => pair[1] > 1).length
      if (taskCounterCopy.length > 0) {
        console.log(`⚒️ Total: ${taskCounterCopy.length}. Optimized: ${optimizedCount}`)
      }
    }

    // Exhaust tasks
    let hasTasks = true
    while (hasTasks) {
      // Make a copy of the schedule
      // As notifying can start other batch roots
      const array = Array.from(scheduledTasks)
      scheduledTasks.clear()

      hasTasks = array.length > 0

      for (const task of array) {
        task()
      }
    }
  }

  // Ends a batch
  batchId -= 1
}
