import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import Text from '../ui/text'
import { listMenu, MenuItem, MenuSection } from '@/constant/base'
import Link from 'next/link'

function AppSidebar() {
    return (
        <Sidebar collapsible='icon' side='left' variant='sidebar' className=' select-none'>
            <SidebarHeader>
                <Text variant='h4' className='text-white size-10 p-1.5 bg-amber-600 flex items-center justify-center rounded-md'>PT</Text>
            </SidebarHeader>
            <SidebarContent>
                {listMenu.map((menu: MenuSection, idx: number) => {
                    return (
                        <SidebarGroup key={menu.title}>
                            <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menu.items.map((item: MenuItem) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild >
                                                <Link href={item.href}>{item.title}</Link>
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
