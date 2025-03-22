import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { on } from 'events'
import React, { useState } from 'react'
import { AiOutlineUserDelete } from 'react-icons/ai'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { TbUserEdit } from 'react-icons/tb'

type ButtonActionProps = {
    className?: string,
    onClick?: () => void,
    onDelete?: () => void,
    onEdit?: () => void,
}

function ButtonAction({ onDelete, onEdit }: ButtonActionProps) {
    const [open, setOpen] = useState(false)

    const onDeleteUser = () => {
        onDelete?.()
        setOpen(false)
    }

    const onEditUser = () => {
        onEdit?.()
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                >
                    <PiDotsThreeOutlineVerticalFill />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align='center'
                alignOffset={0}
                side="left"
                sideOffset={-10}
                avoidCollisions
                arrowPadding={10}
                className={`max-w-40 relative px-2 py-2.5 space-y-2 divide-y divide-border`}
            >
                <Button
                    onClick={onEditUser}
                    size={"sm"}
                    className='border-0 w-full px-2.5 text-slate-600 flex font-normal text-sm justify-start hover:font-semibold hover:text-slate-600'
                    variant={'ghost'}>
                    <TbUserEdit />
                    Edit
                </Button>

                <Button
                    onClick={onDeleteUser}
                    size={"sm"}
                    className='w-full px-2.5 text-slate-600 flex font-normal text-sm justify-start hover:font-semibold hover:text-slate-600'
                    variant={'ghost'}>
                    <AiOutlineUserDelete />
                    Delete
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default ButtonAction
