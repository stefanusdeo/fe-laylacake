import TrigerSidebar from '@/components/organizm/trigerSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useSidebar } from '@/components/ui/sidebar'
import Text from '@/components/ui/text'
import { logoutAccount } from '@/store/action/auth'
import { useRouter } from 'next/navigation'
import React from 'react'

function MainComponent({ children }: { children: React.ReactNode }) {
    const { open, openMobile, isMobile } = useSidebar()
    const route = useRouter()
    const styleShape = "before:bg-white before:size-2.5 before:rotate-45 before:absolute before:-top-1.5 before:right-3 before:border-l before:border-t before:border-border"
    return (
        <main className=' relative w-full'>
            <header className={` ${open ? "w-[calc(100%-18rem)]" : "w-[calc(100%-4rem)]"} ${isMobile && "w-full"} backdrop-blur-sm px-10 py-5 fixed flex justify-between items-center gap-10`}>
                <TrigerSidebar />
                <div>
                    <Popover>
                        <PopoverTrigger>
                            <Avatar className='size-10'>
                                <AvatarImage src="" />
                                <AvatarFallback className='bg-slate-300'>WT</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent
                            align='end'
                            alignOffset={0}
                            sideOffset={10}
                            avoidCollisions
                            arrowPadding={10}
                            className={`w-fit max-w-60 relative p-0 ${styleShape} divide-y divide-border`}
                        >
                            <div className='px-4 py-3 space-y-0.5 select-none'>
                                <Text className='font-semibold leading-4'>Wahyu</Text>
                                <Text variant='span' className='text-slate-500 text-ellipsis'>wahyutricahyomulyo@gmail.com</Text>
                            </div>
                            <div className='px-1 py-2'>
                                <Button onClick={() => route.push("/account")} className='w-full px-2.5 flex font-normal text-sm justify-start' variant={'ghost'}>Profile</Button>
                            </div>
                            <div className='px-1 py-2'>
                                <Button onClick={logoutAccount} className='w-full px-2.5 flex font-normal text-sm justify-start' variant={'ghost'}>Logout </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>
            <div className='px-10 mt-24'>
                {children}
            </div>
        </main>
    )
}

export default MainComponent
