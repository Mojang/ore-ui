import { Task } from './types'

let batchId = 0
const scheduledTasks = new Set<Task>()
const taskCounter = new Map<Task, number>()

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

export const batch = (cb: Task) => {
  batchId += 1

  cb()

  batchId -= 1

  // We are back at the root batch call
  if (batchId === 0) {
    if (process.env.NODE_ENV === 'development') {
      const taskCounterCopy = Array.from(taskCounter)
      taskCounter.clear()

      const optimizedCount = taskCounterCopy.filter(([_, count]) => count > 1).length
      if (taskCounterCopy.length > 0) {
        console.log(`⚒️ Total: ${taskCounterCopy.length}. Optimized: ${optimizedCount}`)
      }
    }

    // Make a copy of the schedule
    // As notifying can start other batch roots
    const array = Array.from(scheduledTasks)
    scheduledTasks.clear()

    for (const task of array) {
      task()
    }
  }
}
