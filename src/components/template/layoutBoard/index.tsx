"use client"
import AppSidebar from '@/components/organizm/appSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'
import MainComponent from './main'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/store/hooks/useAuth'
import { useProfileStore } from '@/store/hooks/useProfile'
import { getProfile } from '@/store/action/profile'

function LayoutBoard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const { profile } = useProfileStore()
    async function fetchProfile() {
        try {
            await getProfile()
        } catch (error) {
            console.error('Failed to fetch profile:', error)
        }
    }
    useEffect(() => {
        if (profile) return
        fetchProfile()
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
