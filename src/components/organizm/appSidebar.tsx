import React, { useEffect } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import Text from '../ui/text'
import { listMenu, MenuItem, MenuSection } from '@/constant/base'
import Link from 'next/link'
import { GoDotFill } from "react-icons/go";
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

function AppSidebar() {
    const path = usePathname()
    const { open , setOpenMobile } = useSidebar()

    useEffect(() => {
        setOpenMobile(false)
    }, [path])
    return (
        <Sidebar collapsible='icon' side='left' variant='sidebar' className=' select-none'>
            <SidebarHeader className='flex flex-col gap-3.5 pt-5 pb-3'>
                <Text variant='h4' className='text-white size-10 p-1.5 bg-amber-400 flex items-center justify-center rounded-md'>PT</Text>
                <Link href={"/account"} className={`flex gap-3.5 rounded-lg transition-all ease-linear duration-200 ${open ? "px-5 py-4 bg-slate-100 " : "px-0 py-4"}`}>
                    <Avatar className='size-10'>
                        <AvatarImage src="" />
                        <AvatarFallback className='bg-slate-300'>WT</AvatarFallback>
                    </Avatar>
                    {
                        open && (
                            <div className='flex flex-col capitalize'>
                                <Text className='font-semibold'>Wahyu</Text>
                                <Text variant='span' className='text-slate-500'>Super Admin</Text>
                            </div>
                        )
                    }
                </Link>
            </SidebarHeader>
            <SidebarContent className='!bg-transparent scrollbar px-0'>
                {listMenu.map((menu: MenuSection, _idx: number) => {
                    return (
                        <SidebarGroup key={menu.title} className={`py-0 px-2.5`}>
                            {menu.show && <SidebarGroupLabel className='text-xs uppercase font-bold'>{menu.title}</SidebarGroupLabel>}
                            <SidebarGroupContent className=''>
                                <SidebarMenu className=''>
                                    {menu.show && menu.items.map((item: MenuItem) => (
                                        <SidebarMenuItem key={item.title} className={`${item.show ? "" : "hidden"} ${open ? "" : "px-1 my-2"}`}>
                                            <SidebarMenuButton tooltip={item.title} size={'lg'} asChild isActive={item.href === path} className={cn(open ? "" :"flex justify-center w-full",' data-[active=false]:text-slate-400 px-3')} >
                                                <Link href={item.href} className='flex items-center text-sm'><GoDotFill className='' /> {open && item.title}</Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                })}
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
