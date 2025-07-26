import {
  differenceInMilliseconds,
  intervalToDuration,
  formatDuration,
} from 'date-fns'

/**
 * Calculates the time remaining until a target time.
 * @param {Date | number} targetTime The future time to calculate the remaining duration for.
 * @returns {string} A human-readable string representing the time left (e.g., "1 hour 30 minutes").
 */
export default function getTimeLeft(targetTime: Date) {
  const now = new Date() // Get the current time
  const target = new Date(targetTime) // Ensure targetTime is a Date object

  // Calculate the difference in milliseconds
  const diffMs = differenceInMilliseconds(target, now)

  if (diffMs <= 0) {
    return 'time has passed!'
  }

  // Convert the difference into a Duration object
  const duration = intervalToDuration({ start: now, end: target })

  // Format the duration into a human-readable string
  // You can customize which units to include by passing a `format` array
  // For example, to only show hours and minutes: formatDuration(duration, { format: ['hours', 'minutes'] })
  return formatDuration(duration, { delimiter: ', ' })
}
