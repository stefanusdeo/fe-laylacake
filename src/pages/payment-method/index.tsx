import Text from '@/components/ui/text'
import React from 'react'
import Breadcrums from '@/components/molecules/breadcrums';
import PaymentMethod from '@/layout/payment-method';

function PaymentMethodPage() {
    return (
        <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center gap-5 select-none'>
                <div className='flex flex-col gap-3'>
                    <Text variant='h2' className=' max-sm:text-2xl'>Payment Method</Text>
                    <Breadcrums />
                </div>
            </div>
            <div>
                <PaymentMethod />
            </div>
        </div>
    )
}

export default PaymentMethodPage
