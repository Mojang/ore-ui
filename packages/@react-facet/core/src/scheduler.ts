import { Task, Batch } from './types'

let batchId = 0
let taskQueue: Task[] = []

/**
 * Schedules a given task to be executed at the end of a current batch, or runs it immediately if no batch is active.
 * @param task
 */
export const scheduleTask = (task: Task) => {
  // Not currently within a batch, so we execute the task immediately.
  if (batchId === 0) {
    task()
    return
  }

  // Only schedules a task once within this batch execution.
  if (!task.scheduled) {
    task.scheduled = true
    taskQueue.push(task)
  }
}

/**
 * Cancels the scheduling of a previously scheduled task.
 * @param task
 */
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

  try {
    b()

    // If this is the root batch, we start executing the tasks
    if (batchId === 1) {
      do {
        // Starts a new queue, as we work through the current one
        const taskQueueCopy = taskQueue
        taskQueue = []

        try {
          for (let index = 0; index < taskQueueCopy.length; index++) {
            const task = taskQueueCopy[index]

            if (task.scheduled) {
              task.scheduled = false
              task()
            }
          }
        } catch (e) {
          // If something goes wrong, we unschedule all remaining tasks
          for (let index = 0; index < taskQueueCopy.length; index++) {
            const task = taskQueueCopy[index]
            task.scheduled = false
          }

          taskQueue = []
          throw e
        }

        // Exhaust all tasks
      } while (taskQueue.length > 0)
    }
  } finally {
    // Ends a batch
    batchId -= 1
  }
}
