import { Task, Batch } from './types'

let isWithinTransition = false
let batchId = 0
let taskQueue: Task[] = []
let transitionTaskQueue: Task[] = []

/**
 * Schedules a given task to be executed at the end of a current batch, or runs it immediately if no batch is active.
 * @param task
 * @private
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

    if (isWithinTransition) {
      transitionTaskQueue.push(task)
    } else {
      taskQueue.push(task)
    }
  }
}

/**
 * Cancels the scheduling of a previously scheduled task.
 * @param task
 * @private
 */
export const cancelScheduledTask = (task: Task) => {
  // Mark a task as canceled instead of removing it.
  // Its reference might already have been taken while processing the tasks.
  task.scheduled = false
}

/**
 * Starts a batch, scheduling Facet updates within the cb to be executed at the end of the batch.
 * @param b will be executed immediately to collect Facet changes
 *
 * Application code should not use this directly. For batching within transitions,
 * use `startFacetTransition` or `useFacetTransition` instead.
 */
export const batch = (b: Batch) => {
  // Starts a batch
  batchId += 1

  try {
    b()

    // If this is the root batch, we start executing the tasks
    if (batchId === 1) {
      flushTasks()
    }
  } finally {
    // Ends a batch
    batchId -= 1
  }
}

/**
 * Special type of batch that ensures all tasks are ran at the end (unless nested on another transition)
 * @param b will be executed immediately to collect Facet changes
 *
 * @private users should use startFacetTransition and useFacetTransition instead
 */
export const batchTransition = (b: Batch) => {
  const isRootTransition = !isWithinTransition

  // Starts a batch batch
  isWithinTransition = true
  batchId += 1

  try {
    b()

    if (batchId === 1 || isRootTransition) {
      flushTasks()
    }
  } finally {
    // Ends a batch transition
    if (isRootTransition) {
      isWithinTransition = false
    }
    batchId -= 1
  }
}

const flushTasks = () => {
  do {
    // Starts a new queue, as we work through the current one
    const taskQueueCopy = isWithinTransition ? transitionTaskQueue : taskQueue
    if (isWithinTransition) {
      transitionTaskQueue = []
    } else {
      taskQueue = []
    }

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

      if (isWithinTransition) {
        transitionTaskQueue = []
      } else {
        taskQueue = []
      }
      throw e
    }

    // Exhaust all tasks
  } while ((isWithinTransition ? transitionTaskQueue : taskQueue).length > 0)
}
