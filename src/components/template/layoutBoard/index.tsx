"use client"
import AppSidebar from '@/components/organizm/appSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import MainComponent from './main'

function LayoutBoard({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <MainComponent>
                    {children}
                </MainComponent>
            </SidebarProvider>

        </div>
    )
}

export default LayoutBoard
