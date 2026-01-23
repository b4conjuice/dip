'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { addHours, addMinutes, format, parse } from 'date-fns'
import { useForm } from 'react-hook-form'

import { Title } from '@/components/ui'
import { getBounce } from '@/lib/bounce'
import useLocalStorage from '@/lib/useLocalStorage'
import getTimeLeft from '@/lib/getTimeLeft'

function getTimeStringAsDate(time: string) {
  // Define the format of your time string.
  // 'h' for 12-hour format (1-12), 'hh' for 01-12 (padded)
  // 'm' for minutes (0-59), 'mm' for 00-59 (padded)
  // 'aa' for AM/PM marker (AM, PM)
  const format = 'h:mm aa'

  // Parse the time string using the format and the reference date
  const parsedDate = parse(`${time} PM`, format, new Date())

  return parsedDate
}

const defaultValues = {
  startLunch: '12:00',
  endLunch: '12:30',
  hours: 8,
}

export default function Dip() {
  const [storedStart, setStoredStart] = useLocalStorage('dip-start', '07:00')
  const initialValues = useMemo(() => {
    return {
      start: storedStart,
      ...defaultValues,
    }
  }, [storedStart])
  const { register, reset, watch } = useForm({
    defaultValues: initialValues,
  })
  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])
  const start = watch('start')
  const startLunch = watch('startLunch')
  const endLunch = watch('endLunch')
  const hours = watch('hours')

  useEffect(() => {
    if (!start) return
    setStoredStart(start)
  }, [start, setStoredStart])
  const { T: dip } = storedStart
    ? getBounce({
        start: String(start),
        lunchStart: String(startLunch),
        lunchEnd: String(endLunch),
        hours: Number(hours),
      })
    : { T: null }

  const [timeLeft, setTimeLeft] = useState('')
  const intervalRef = useRef<number | null>(null)

  const [timeLeftBeforeLunch, setTimeLeftBeforeLunch] = useState('')
  const intervalRefForTimeLeftBeforeLunch = useRef<number | null>(null)
  const parsedStart = start ? parse(String(start), 'HH:mm', new Date()) : null
  const shouldStartLunch = parsedStart
    ? addMinutes(addHours(parsedStart, 4), 59)
    : null
  useEffect(() => {
    const updateTimeLeft = () => {
      const dipAsDate = getTimeStringAsDate(dip ?? '')
      const { asTimeString: timeLeft, asMilliseconds } = getTimeLeft(dipAsDate)

      setTimeLeft(timeLeft)
      if (asMilliseconds <= 0) {
        clearInterval(intervalRef.current as unknown as number)
        intervalRef.current = null
      }
    }

    intervalRef.current = setInterval(updateTimeLeft, 1000) as unknown as number

    const updateTimeLeftBeforeLunch = () => {
      if (!shouldStartLunch) return
      const { asTimeString: timeLeft, asMilliseconds } =
        getTimeLeft(shouldStartLunch)
      setTimeLeftBeforeLunch(timeLeft)
      if (asMilliseconds <= 0) {
        clearInterval(
          intervalRefForTimeLeftBeforeLunch.current as unknown as number
        )
        intervalRefForTimeLeftBeforeLunch.current = null
      }
    }

    intervalRefForTimeLeftBeforeLunch.current = setInterval(
      updateTimeLeftBeforeLunch,
      1000
    ) as unknown as number

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (intervalRefForTimeLeftBeforeLunch.current !== null) {
        clearInterval(intervalRefForTimeLeftBeforeLunch.current)
        intervalRefForTimeLeftBeforeLunch.current = null
      }
    }
  }, [dip, shouldStartLunch])
  return (
    <>
      <div className='flex flex-col space-y-4'>
        <input
          {...register('start')}
          type='time'
          className='w-full bg-cobalt'
        />
        {shouldStartLunch && (
          <>
            <Title>lunch: {format(shouldStartLunch, 'HH:mm aa')}</Title>
            <Title>{timeLeftBeforeLunch}</Title>
          </>
        )}
        <input
          {...register('startLunch')}
          type='time'
          className='w-full bg-cobalt'
        />
        <input
          {...register('endLunch')}
          type='time'
          className='w-full bg-cobalt'
        />
        <input
          {...register('hours')}
          type='number'
          className='w-full bg-cobalt'
        />
      </div>
      <Title>dip: {dip}</Title>
      <Title>{timeLeft}</Title>
    </>
  )
}
