'use client'

import { Title } from '@/components/ui'
import { getBounce } from '@/lib/bounce'
import useForm from '@/lib/useForm'

export default function Dip() {
  const { values, handleChange } = useForm({
    initialValues: {
      start: '07:00',
      startLunch: '12:00',
      endLunch: '12:30',
    },
    onSubmit: data => {
      console.log(data)
    },
  })
  const { start, startLunch, endLunch } = values
  const { T: dip } = getBounce(
    String(start),
    String(startLunch),
    String(endLunch)
  )
  return (
    <>
      <Title>dip</Title>
      <div className='flex flex-col space-y-4'>
        <input
          name='start'
          value={String(start)}
          onChange={handleChange}
          type='time'
          className='bg-cobalt w-full'
        />
        <input
          name='startLunch'
          value={String(startLunch)}
          onChange={handleChange}
          type='time'
          className='bg-cobalt w-full'
        />
        <input
          name='endLunch'
          value={String(endLunch)}
          onChange={handleChange}
          type='time'
          className='bg-cobalt w-full'
        />
      </div>
      <p>{dip}</p>
    </>
  )
}
