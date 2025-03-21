import Text from '@/components/ui/text'
import React from 'react'
type LayoutAuthProps = {
  children: React.ReactNode
}

function LayoutAuth({ children }: LayoutAuthProps) {
  return (
    <div className='select-none'>
      <div className=' absolute w-full mt-10 px-10 flex items-center'>
        <Text variant='h4' className='text-white size-10 p-1.5 bg-amber-400 flex items-center justify-center rounded-md'>PT</Text>
      </div>
      <div className='flex p-5 gap-10 bg-neutral-50 h-screen'>
        <div className='w-full max-w-md p-10 bg-neutral-200 rounded-2xl h-full flex items-center text-neutral-900 max-sm:hidden'>
          <Text variant='h2' className='font-bold'>Hi, Welcome Back</Text>
        </div>
        <div className='w-full'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default LayoutAuth