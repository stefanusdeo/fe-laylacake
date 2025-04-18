import { getFilteredMenu, MenuItem, MenuSection } from '@/constant/base'
import { cn, useWithDevice } from '@/lib/utils'
import { useProfileStore } from '@/store/hooks/useProfile'
import { getInitialsName } from '@/utils/getInitialName'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { GoDotFill } from "react-icons/go"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '../ui/sidebar'
import Text from '../ui/text'

function AppSidebar() {
    const path = usePathname()
    const { open, setOpenMobile, setOpen } = useSidebar()
    const { widthDevice } = useWithDevice()
    const { profile } = useProfileStore()

    const nameUser = getInitialsName(profile?.name || "")

    useEffect(() => {
        setOpenMobile(false)
    }, [path])

    useEffect(() => {
        if (widthDevice > 767 && widthDevice <= 1056) {
            setOpen(false)
        } else if (widthDevice > 1056) {
            setOpen(true)
        }
    }, [widthDevice])

    const filteredMenu = getFilteredMenu(profile?.role_name)

    return (
        <Sidebar collapsible='icon' side='left' variant='sidebar' className='select-none'>
            <SidebarHeader className='flex flex-col gap-3.5 pt-5 pb-3'>
                <Text variant='h4' className='text-white size-10 p-1.5 bg-orange-400 flex items-center justify-center rounded-md'>PT</Text>
                <Link href={"/account"} className={`flex gap-3.5 rounded-lg transition-all ease-linear duration-200 ${open ? "px-5 py-4 bg-slate-100 " : "px-0 py-4"}`}>
                    <Avatar className='size-10'>
                        <AvatarImage src="" />
                        <AvatarFallback className='bg-slate-300 uppercase'>{nameUser}</AvatarFallback>
                    </Avatar>
                    {
                        open && (
                            <div className='flex flex-col capitalize'>
                                <Text className='font-semibold'>{profile?.name ?? ""}</Text>
                                <Text variant='span' className='text-slate-500 lowercase'>{profile?.email ?? ""}</Text>
                            </div>
                        )
                    }
                </Link>
            </SidebarHeader>

            <SidebarContent className='!bg-transparent scrollbar px-0'>
                {filteredMenu.map((menu: MenuSection) => (
                    <SidebarGroup key={menu.title} className={`py-0 px-2.5`}>
                        <SidebarGroupLabel className='text-xs uppercase font-bold'>{menu.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menu.items.map((item: MenuItem) => (
                                    <SidebarMenuItem key={item.title} className={`${open ? "" : "px-1 my-2"}`}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            size='lg'
                                            isActive={item.href === path}
                                            className={cn(open ? "" : "flex justify-center w-full", 'data-[active=false]:text-slate-400 px-3')}
                                        >
                                            <Link href={item.href} className='flex items-center text-sm'>
                                                <GoDotFill /> {open && item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
