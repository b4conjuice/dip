import { Main } from '@/components/ui'
import Dip from './dip'

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <Dip />
      </div>
    </Main>
  )
}
