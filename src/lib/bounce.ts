type Time = {
  T: string
  Hour: number
  Minute: number
}

export function getBounce({
  start,
  lunchStart,
  lunchEnd,
  hours,
}: {
  start: string
  lunchStart: string
  lunchEnd: string
  hours: number
}) {
  const startTime = getTime(start)
  const lunchStartTime = getTime(lunchStart)
  const lunchEndTime = getTime(lunchEnd)

  const beforeLunch = getTimeDifference(startTime, lunchStartTime)
  // const fullTime = getTimeHM(7, 59)
  const fullTime = getTimeHM(hours, 0)
  const afterLunch = getTimeDifference(beforeLunch, fullTime)
  const bounce = getTimeSum(lunchEndTime, afterLunch)
  return bounce
}

const getTime = (time: string) => {
  const T = time
  const [hour, min] = time.split(':')
  let h = parseInt(hour ?? '0')
  let m = parseInt(min ?? '0')
  if (m > 59) {
    m %= 60
    h += 1
  } else if (m < 0) {
    m += 60
    h -= 1
  }
  h = convertAMPM(h)
  const Hour = h
  const Minute = m
  return {
    T,
    Hour,
    Minute,
  }
}

const getTimeHM = (h: number, m: number) => {
  let hour = h
  let minute = m
  if (minute > 59) {
    minute %= 60
    hour += 1
  } else if (minute < 0) {
    minute += 60
    hour -= 1
  }

  const Hour = hour
  const Minute = minute
  let minuteString = minute.toString()
  if (minute < 10) minuteString = `0${minute}`
  if (minute === 0) minuteString = '00'
  hour = convertAMPM(hour)
  const T = `${hour}:${minuteString}`
  return {
    T,
    Hour,
    Minute,
  }
}

const getTimeDifference = (time1: Time, time2: Time) =>
  getTimeHM(time2.Hour - time1.Hour, time2.Minute - time1.Minute)

const getTimeSum = (time1: Time, time2: Time) =>
  getTimeHM(time2.Hour + time1.Hour, time2.Minute + time1.Minute)

const convertAMPM = (hour: number) => {
  let newHour = hour
  if (newHour > 12) newHour -= 12
  else if (newHour < 6) newHour += 12

  return newHour
}
