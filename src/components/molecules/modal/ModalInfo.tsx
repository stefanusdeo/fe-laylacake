import React from 'react'
import Dialog from '../dialog'
import { ModalProps } from '@/types/modalTypes'
import { PiWarningCircle } from 'react-icons/pi'
import Text from '@/components/ui/text'
import { Button } from '@/components/ui/button'

type ModalInfoProps = {
    title: string;
    description: string | React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
}

function ModalInfo({ open, onClose, description, title, onConfirm, onCancel }: ModalProps & ModalInfoProps) {
    return (
        <Dialog onClose={onClose} open={open}>
            <div className=' flex flex-col gap-5 items-center justify-center'>
                <PiWarningCircle className='text-5xl text-amber-500' />
                <div className=' flex flex-col gap-2'>
                    <Text variant='h4' className='text-center text-slate-800'>{title}</Text>
                    <Text variant='p' className='text-center text-slate-600'>{description}</Text>
                </div>
                <div className=' flex gap-5'>
                    <Button onClick={onCancel} variant={'outline'}>Cancel</Button>
                    <Button onClick={onConfirm} variant={"default"}>Yes, I am sure</Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ModalInfo
