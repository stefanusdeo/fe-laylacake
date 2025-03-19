import AppSidebar from '@/components/organizm/appSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function LayoutBoard({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <div className=' flex justify-between items-center gap-10'>
                        <SidebarTrigger />
                    </div>
                    {children}
                </main>
            </SidebarProvider>

        </div>
    )
}

export default LayoutBoard
