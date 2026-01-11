'use client'

import { useEffect, useRef, useState } from 'react'
import { addHours, addMinutes, format, parse } from 'date-fns'

import { Title } from '@/components/ui'
import { getBounce } from '@/lib/bounce'
import useForm from '@/lib/useForm'
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
  const { values, handleChange } = useForm({
    initialValues: {
      start: storedStart,
      ...defaultValues,
    },
    onSubmit: data => {
      console.log(data)
    },
  })
  const { start, startLunch, endLunch, hours } = values
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
      const timeLeft = getTimeLeft(dipAsDate)

      setTimeLeft(timeLeft)
      if (timeLeft === 'time has passed!') {
        clearInterval(intervalRef.current as unknown as number)
        intervalRef.current = null
      }
    }

    intervalRef.current = setInterval(updateTimeLeft, 1000) as unknown as number

    const updateTimeLeftBeforeLunch = () => {
      console.log('updateTimeLeftBeforeLunch')
      if (!shouldStartLunch) return
      const timeLeft = getTimeLeft(shouldStartLunch)
      setTimeLeftBeforeLunch(timeLeft)
      if (timeLeft === 'time has passed!') {
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
      <Title>dip</Title>
      <div className='flex flex-col space-y-4'>
        <input
          name='start'
          value={String(start)}
          onChange={e => {
            handleChange(e)
            setStoredStart(e.currentTarget.value)
          }}
          type='time'
          className='w-full bg-cobalt'
        />
        {shouldStartLunch && (
          <>
            <Title>take lunch by: {format(shouldStartLunch, 'HH:mm aa')}</Title>
            <Title>{timeLeftBeforeLunch}</Title>
          </>
        )}
        <input
          name='startLunch'
          value={String(startLunch)}
          onChange={handleChange}
          type='time'
          className='w-full bg-cobalt'
        />
        <input
          name='endLunch'
          value={String(endLunch)}
          onChange={handleChange}
          type='time'
          className='w-full bg-cobalt'
        />
        <input
          name='hours'
          value={Number(hours)}
          onChange={handleChange}
          type='number'
          className='w-full bg-cobalt'
        />
      </div>
      <Title>{dip}</Title>
      <Title>{timeLeft}</Title>
    </>
  )
}
