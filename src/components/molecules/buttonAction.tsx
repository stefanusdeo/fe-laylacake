import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React, { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { MdOutlineEditNote } from "react-icons/md"
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { TbListDetails, TbPackageExport } from 'react-icons/tb'
type ButtonActionProps = {
    onDelete?: () => void,
    onEdit?: () => void,
    onDetail?: () => void,
    onMigrate?: () => void,
    iconsDetail?: React.ReactNode,
    iconsEdit?: React.ReactNode,
    iconsDelete?: React.ReactNode,
    iconsMigrate?: React.ReactNode
}

function ButtonAction({ onDelete, onEdit, onDetail, onMigrate,iconsDelete,iconsDetail,iconsEdit,iconsMigrate }: ButtonActionProps) {
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
                {onEdit && (
                    <Button
                        onClick={onEditUser}
                        size={"sm"}
                        className='border-0 w-full px-2.5 text-slate-600 flex font-normal text-sm justify-start hover:font-semibold hover:text-slate-600'
                        variant={'ghost'}>
                        {iconsEdit ?? <MdOutlineEditNote />}
                        Edit
                    </Button>
                )}

                {onDetail && (
                    <Button
                        onClick={onDetail}
                        size={"sm"}
                        className='border-0 w-full px-2.5 text-slate-600 flex font-normal text-sm justify-start hover:font-semibold hover:text-slate-600'
                        variant={'ghost'}>
                        {iconsDetail ?? <TbListDetails />}
                        Detail
                    </Button>
                )}

                {onMigrate && (
                    <Button
                        onClick={onMigrate}
                        size={"sm"}
                        className='border-0 w-full px-2.5 text-slate-600 flex font-normal text-sm justify-start hover:font-semibold hover:text-slate-600'
                        variant={'ghost'}>
                        {iconsMigrate ?? <TbPackageExport />}
                        Moving
                    </Button>
                )}

                {onDelete && (
                    <Button
                        onClick={onDeleteUser}
                        size={"sm"}
                        className='w-full px-2.5 text-slate-600 flex font-normal text-sm justify-start hover:font-semibold hover:text-slate-600'
                        variant={'ghost'}>
                        {iconsDelete ?? <AiOutlineDelete />}
                        Delete
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    )
}

export default ButtonAction
