"use client"
import AppSidebar from '@/components/organizm/appSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getProfile } from '@/store/action/profile'
import { useAuthStore } from '@/store/hooks/useAuth'
import { useProfileStore } from '@/store/hooks/useProfile'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import MainComponent from './main'

function LayoutBoard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { profile } = useProfileStore()

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const fetchProfile = async () => {
        try {
            await getProfile()
        } catch (error) {
            console.error('Failed to fetch profile:', error)
        }
    }

    useEffect(() => {
        if (!profile) {
            fetchProfile()
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticated && router.pathname !== "/login") {
            router.push({
                pathname: "/login",
                query: { callbackUrl: router.asPath },
            })
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated && router.pathname !== "/login") {
        return null
    }
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
