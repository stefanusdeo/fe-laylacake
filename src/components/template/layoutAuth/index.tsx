import Text from '@/components/ui/text'
import { useAuthStore } from '@/store/hooks/useAuth'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
type LayoutAuthProps = {
  children: React.ReactNode
  restricted?: boolean
}

function LayoutAuth({ children, restricted = false }: LayoutAuthProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && restricted) {
      router.push("/account")
    }
  }, [isAuthenticated, restricted, router])

  if (isAuthenticated && restricted) {
    return null
  }
  return (
    <div className='select-none'>
      <div className=' absolute w-full mt-10 px-10 flex items-center'>
        <Text variant='h4' className='text-white size-10 p-1.5 bg-amber-400 flex items-center justify-center rounded-md'>PT</Text>
      </div>
      <div className='flex p-5 gap-2 sm:gap-10 h-screen'>
        <div className='w-full max-w-md p-10 bg-slate-50/50 shadow-sm shadow-accent border border-accent rounded-2xl h-full flex items-center text-neutral-900 max-sm:hidden'>
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