import Breadcrums from '@/components/molecules/breadcrums';
import Text from '@/components/ui/text';
import Account from '@/layout/account';

function AccountPage() {
    return (
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
    )
}

export default AccountPage
