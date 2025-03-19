import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import Text from '../ui/text'
import { listMenu, MenuItem, MenuSection } from '@/constant/base'
import Link from 'next/link'
import { LuDot } from "react-icons/lu";
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function AppSidebar() {
    const path = usePathname()
    const { open } = useSidebar()
    return (
        <Sidebar collapsible='icon' side='left' variant='sidebar' className=' select-none'>
            <SidebarHeader className='flex flex-col gap-3.5 pt-5 pb-3'>
                <Text variant='h4' className='text-white size-10 p-1.5 bg-amber-400 flex items-center justify-center rounded-md'>PT</Text>
                <Link href={"/profile"} className={`flex gap-3.5 rounded-lg transition-all ease-linear duration-200 ${open ? "px-5 py-4 bg-slate-100 " : "px-0 py-4"}`}>
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
            <SidebarContent className='!bg-transparent scrollbar '>
                {listMenu.map((menu: MenuSection, _idx: number) => {
                    return (
                        <SidebarGroup key={menu.title} className='py-0'>
                            <SidebarGroupLabel className='text-xs uppercase font-bold'>{menu.title}</SidebarGroupLabel>
                            <SidebarGroupContent className='my-2 '>
                                <SidebarMenu>
                                    {menu.items.map((item: MenuItem) => (
                                        <SidebarMenuItem key={item.title} className=''>
                                            <SidebarMenuButton size={'lg'} asChild isActive={item.href === path} className='' >
                                                <Link href={item.href} className='flex items-center text-sm'><LuDot /> {item.title}</Link>
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
