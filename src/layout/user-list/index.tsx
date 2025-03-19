import Breadcrums from '@/components/molecules/breadcrums'
import { Button } from '@/components/ui/button'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { Plus } from 'lucide-react'
import React from 'react'

function UserList() {
    return (
        <div className='flex flex-col gap-7'>
            <div className='flex justify-between items-center gap-5'>
                <div className='flex flex-col gap-3'>
                    <Text variant='h2'>User List</Text>
                    <Breadcrums />
                </div>
                <Button size={'lg'}><Plus /> Add User</Button>
            </div>
            <div className='w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg px-5 py-5'>
                <SearchInputGroup options={[{value:"name",label:"Name"},{value:"phone",label:"Phone"}]} className='rounded-md'/>
            </div>
        </div>
    )
}

export default UserList
