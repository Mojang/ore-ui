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

  task.scheduled = true
  scheduledTasks.add(task)
}

export const cancelScheduledTask = (task: Task) => {
  // Mark a task as canceled instead of removing it.
  // Its reference might already have been taken while processing the tasks.
  task.scheduled = false
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

    do {
      // Make a copy of the schedule, as running a task can cause other tasks to be scheduled
      const copiedScheduledTasks = Array.from(scheduledTasks)
      scheduledTasks.clear()

      for (const task of copiedScheduledTasks) {
        if (task.scheduled) task()
      }

      // Exhaust all tasks
    } while (scheduledTasks.size > 0)
  }

  // Ends a batch
  batchId -= 1
}
