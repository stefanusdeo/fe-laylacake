"use client"

import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { listMenu } from "@/constant/base"
import { LuDot } from "react-icons/lu"
import { useEffect, useState } from "react"

export function BreadcrumbWithDropdown() {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)
    const [userRole, setUserRole] = useState<string | null>(null)

    // Get user role from cookies when component mounts
    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop()?.split(";").shift() || null
            return null
        }

        const role = getCookie("user_role")
        setUserRole(role)
    }, [])

    let matchedMenuItem = null
    let matchedMenuSection = null

    // Find menu that matches current path
    for (const section of listMenu) {
        for (const item of section.items) {
            if (item.href === pathname) {
                matchedMenuItem = item
                matchedMenuSection = section
                break
            }
        }
        if (matchedMenuItem) break
    }

    // Filter menu items based on user role and visibility
    const getAccessibleMenuItems = (section: any) => {
        if (!section || !userRole) return []

        return section.items.filter(
            (item: any) =>
                item.show && // Item must be visible
                item.permission.includes(userRole), // User must have permission
        )
    }

    // Get accessible menu items for the current section
    const accessibleMenuItems = matchedMenuSection ? getAccessibleMenuItems(matchedMenuSection) : []

    return (
        <Breadcrumb>
            <BreadcrumbList className="max-sm:text-xs">
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator>
                    <LuDot className="text-2xl" />
                </BreadcrumbSeparator>

                {matchedMenuSection && accessibleMenuItems.length > 1 ? (
                    // Show dropdown if there are multiple accessible items
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 focus-visible:outline-0">
                                {matchedMenuSection.title}
                                <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {accessibleMenuItems.map((item:any) => (
                                    <DropdownMenuItem key={item.href}>
                                        <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                ) : (
                    // Show regular breadcrumb if there's only one accessible item or none
                    matchedMenuSection && (
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">{matchedMenuSection.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )
                )}

                {matchedMenuItem && (
                    <>
                        <BreadcrumbSeparator>
                            <LuDot className="text-2xl" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{matchedMenuItem.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbWithDropdown
