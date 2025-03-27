"use client";

import { usePathname } from "next/navigation";
import { ChevronDown, Slash } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listMenu } from "@/constant/base";
import { LuDot } from "react-icons/lu";

export function BreadcrumbWithDropdown() {
    const pathname = usePathname(); // Ambil path saat ini
    const pathSegments = pathname.split("/").filter(Boolean); // Pisahkan path menjadi array

    let matchedMenuItem = null;
    let matchedMenuSection = null;

    // Cari menu yang cocok dengan path saat ini
    for (const section of listMenu) {
        for (const item of section.items) {
            if (item.href === pathname) {
                matchedMenuItem = item;
                matchedMenuSection = section;
                break;
            }
        }
        if (matchedMenuItem) break;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator>
                    <LuDot className="text-2xl"/>
                </BreadcrumbSeparator>

                {matchedMenuSection && matchedMenuSection.items.filter(item => item.show).length > 1 ? (
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 focus-visible:outline-0">
                                {matchedMenuSection.title}
                                <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {matchedMenuSection.items
                                    .filter(item => item.show) // Filter hanya item dengan show = true
                                    .map((item) => (
                                        <DropdownMenuItem key={item.href}>
                                            <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                ) : (
                    matchedMenuSection && (
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">{matchedMenuSection.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )
                )}

                {matchedMenuItem && (
                    <>
                        <BreadcrumbSeparator>
                            <LuDot className="text-2xl"/>
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{matchedMenuItem.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default BreadcrumbWithDropdown;
