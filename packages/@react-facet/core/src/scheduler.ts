import { Task, Batch } from './types'

let batchId = -1
let taskQueue: Task[] = []
let effectQueue: Task[] = []

/**
 * Schedules a given task to be executed at the end of a current batch, or runs it immediately if no batch is active.
 * @param task
 */
export const scheduleTask = (task: Task, effect?: boolean) => {
  // Not currently within a batch, so we execute the task immediately.
  if (batchId === -1) {
    task()
    return
  }

  // Only schedules a task once within this batch execution.
  if (!task.scheduled) {
    task.scheduled = true
    if (effect) {
      effectQueue.push(task)
    } else {
      taskQueue.push(task)
    }
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
 * -Exausts all transformations, then runs effects
 */

/**
 * Starts a batch, scheduling Facet updates within the cb to be executed at the end of the batch.
 * @param b will be executed immediately to collect Facet changes
 */
export const batch = (b: Batch) => {
  // Starts a batch
  batchId += 1

  try {
    b()

    // We only execute tasks at the root batch
    if (batchId === 0) {
      do {
        do {
          const currentTaskQueue = taskQueue
          taskQueue = []

          try {
            for (let index = 0; index < currentTaskQueue.length; index++) {
              const task = currentTaskQueue[index]

              if (task.scheduled) {
                task.scheduled = false
                task()
              }
            }
          } catch (e) {
            for (let index = 0; index < currentTaskQueue.length; index++) {
              const task = currentTaskQueue[index]
              task.scheduled = false
            }

            throw e
          }
        } while (taskQueue.length > 0)

        const currentEffectQueue = effectQueue
        effectQueue = []

        try {
          for (let index = 0; index < currentEffectQueue.length; index++) {
            const task = currentEffectQueue[index]

            if (task.scheduled) {
              task.scheduled = false
              task()
            }
          }
        } catch (e) {
          // If something goes wrong, we unschedule all remaining tasks
          for (let index = 0; index < currentEffectQueue.length; index++) {
            const task = currentEffectQueue[index]
            task.scheduled = false
          }

          throw e
        }

        // Exhaust all tasks
      } while (taskQueue.length > 0 || effectQueue.length > 0)
    }
  } finally {
    // Ends a batch
    batchId -= 1
  }
}
