import Text from '@/components/ui/text'
import React from 'react'
import Breadcrums from '@/components/molecules/breadcrums';
import Outlets from '@/layout/store/outlets';

function OutletsPage() {
    return (
        <div className='flex flex-col gap-7'>
            <div className='flex justify-between items-center gap-5 select-none'>
                <div className='flex flex-col gap-3'>
                    <Text variant='h2'>Outlets</Text>
                    <Breadcrums />
                </div>
            </div>
            <div className='my-5'>
                <Outlets />
            </div>
        </div>
    )
}

export default OutletsPage
