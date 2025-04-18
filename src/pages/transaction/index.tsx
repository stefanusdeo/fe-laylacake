import Text from '@/components/ui/text'
import React from 'react'
import Breadcrums from '@/components/molecules/breadcrums';
import Transactions from '@/layout/transaction';

export default function TransactionPage() {
    return (
        <div className='flex flex-col gap-7'>
            <div className='flex justify-between items-center gap-5 select-none'>
                <div className='flex flex-col gap-3'>
                    <Text variant='h2' className=' max-sm:text-2xl'>Transaction List</Text>
                    <Breadcrums />
                </div>
            </div>
            <div className='md:my-5'>
                <Transactions />
            </div>
        </div>
    )
}
