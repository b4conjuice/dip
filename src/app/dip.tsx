'use client'

import { useEffect, useRef, useState } from 'react'
import { parse } from 'date-fns'

import { Title } from '@/components/ui'
import { getBounce } from '@/lib/bounce'
import useForm from '@/lib/useForm'
import useLocalStorage from '@/lib/useLocalStorage'
import getTimeLeft from '@/lib/getTimeLeft'

function getDipAsDate(dip: string) {
  // Define the format of your time string.
  // 'h' for 12-hour format (1-12), 'hh' for 01-12 (padded)
  // 'm' for minutes (0-59), 'mm' for 00-59 (padded)
  // 'aa' for AM/PM marker (AM, PM)
  const format = 'h:mm aa'

  // Parse the time string using the format and the reference date
  const parsedDate = parse(`${dip} PM`, format, new Date())

  return parsedDate
}

export default function Dip() {
  const [storedStart, setStoredStart] = useLocalStorage('dip-start', '07:00')
  const { values, handleChange } = useForm({
    initialValues: {
      start: storedStart,
      startLunch: '12:00',
      endLunch: '12:30',
    },
    onSubmit: data => {
      console.log(data)
    },
  })
  const { start, startLunch, endLunch } = values
  const { T: dip } = storedStart
    ? getBounce(String(start), String(startLunch), String(endLunch))
    : { T: null }

  const [timeLeft, setTimeLeft] = useState('')

  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const updateTimeLeft = () => {
      const dipAsDate = getDipAsDate(dip ?? '')
      const timeLeft = getTimeLeft(dipAsDate)

      setTimeLeft(timeLeft)
      if (timeLeft === 'time has passed!') {
        clearInterval(intervalRef.current as unknown as number)
        intervalRef.current = null
      }
    }

    intervalRef.current = setInterval(updateTimeLeft, 1000) as unknown as number
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [dip])
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
      </div>
      <Title>{dip}</Title>
      <Title>{timeLeft}</Title>
    </>
  )
}
