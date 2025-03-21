import Dialog from '@/components/molecules/dialog'
import React from 'react'

type ModalCreateUserProps = {
    open: boolean
    onClose: (open: boolean) => void
}

function ModalCreateUser({ open, onClose }: ModalCreateUserProps) {
    return (
        <Dialog title='Create New User' open={open} onClose={onClose} >
            <form>
                <div className='flex flex-col gap-5'>
                    <input type='text' placeholder='Name' className='input' />
                    <input type='text' placeholder='Email' className='input' />
                    <input type='text' placeholder='Password' className='input' />
                    <input type='text' placeholder='Confirm Password' className='input' />
                </div>
            </form>
        </Dialog>
    )
}

export default ModalCreateUser
