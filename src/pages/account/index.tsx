import Text from '@/components/ui/text'
import React from 'react'
import Breadcrums from '@/components/molecules/breadcrums';
import Account from '@/layout/account';
import LayoutBoard from '@/components/template/layoutBoard';

function AccountPage() {
    return (
        <LayoutBoard>
            <div className='flex flex-col gap-7'>
                <div className='flex justify-between items-center gap-5 select-none'>
                    <div className='flex flex-col gap-3'>
                        <Text variant='h2'>Account</Text>
                        <Breadcrums />
                    </div>
                </div>
                <div className='my-5'>
                    <Account />
                </div>
            </div>
        </LayoutBoard>
    )
}

export default AccountPage
