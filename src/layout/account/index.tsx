"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProfile } from '@/store/action/profile'
import { useProfileStore } from '@/store/hooks/useProfile'
import { useEffect } from 'react'
import { PiKeyDuotone, PiUserSquareDuotone } from "react-icons/pi"
import ChangePassword from './change-password'
import General from './general'
function Account() {
    return (
        <Tabs defaultValue="general">
            <TabsList className='bg-transparent rounded flex gap-5'>
                <TabsTrigger
                    value={'general'}
                    className='flex items-center gap-2 py-5 px-1.5 rounded-none font-normal text-slate-400 border-b-2 data-[state=active]:text-slate-700 data-[state=active]:border-orange-400'
                >
                    <PiUserSquareDuotone size={400} /> General
                </TabsTrigger>
                <TabsTrigger
                    value={'password'}
                    className='flex items-center gap-2 py-5 px-1.5 rounded-none font-normal text-slate-400 border-b-2 data-[state=active]:text-slate-700 data-[state=active]:border-orange-400'
                >
                    <PiKeyDuotone /> Change Password
                </TabsTrigger>
            </TabsList>
            <TabsContent className='my-10 p-5 rounded-lg shadow-md shadow-accent border border-accent' value={'general'}>
                <General />
            </TabsContent>
            <TabsContent className='my-10 p-5 rounded-lg shadow-md shadow-accent border border-accent' value={'password'}>
                <ChangePassword />
            </TabsContent>
        </Tabs>
    )
}

export default Account
