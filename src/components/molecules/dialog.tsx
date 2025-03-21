import {
    Dialog as Base,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Description } from '@radix-ui/react-dialog'
import React from 'react'


type DialogProps = {
    children: React.ReactNode
    onClose: (open: boolean) => void
    open: boolean
    title: string
    description?: string
}

function Dialog({ children, onClose, open, title, description }: DialogProps) {
    return (
        <Base onOpenChange={onClose} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ?
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                        : <Description />
                    }
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Base>
    )
}

export default Dialog
