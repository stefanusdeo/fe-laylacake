import {
    Dialog as Base,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Description } from '@radix-ui/react-dialog'
import React from 'react'


type DialogProps = {
    children: React.ReactNode
    onClose: (open: boolean) => void
    open: boolean
    title?: string
    description?: string
    className?: string
    footer?: React.ReactNode
}

function Dialog({ children, onClose, open, title, description, className, footer }: DialogProps) {
    return (
        <Base onOpenChange={onClose} open={open} >
            <DialogContent className={cn("w-auto", className)}>
                <DialogTitle className="sr-only" />
                <DialogDescription className="sr-only" />
                {title || description && (
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description ?
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                            : <Description />
                        }
                    </DialogHeader>
                )}
                <div className="overflow-y-auto px-2 scrollbar" style={{ maxHeight: "calc(85svh - 120px)" }}>
                    {children}
                </div>
                {footer && (
                    <DialogFooter>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Base>
    )
}

export default Dialog
