'use client'

import { Title } from '@/components/ui'
import { getBounce } from '@/lib/bounce'
import useForm from '@/lib/useForm'
import useLocalStorage from '@/lib/useLocalStorage'

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
    </>
  )
}
