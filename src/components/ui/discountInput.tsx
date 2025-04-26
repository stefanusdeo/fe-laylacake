"use client"

import { forwardRef, type ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DiscountInputProps extends ComponentProps<"input"> {
    onApply?: (code: string) => void
}

const DiscountInput = forwardRef<HTMLInputElement, DiscountInputProps>(({ className, onApply, ...props }, ref) => {
    const disabled = props.value === "" || props.value === undefined || props.disabled

    const handleApply = () => {
        if (onApply) {
            onApply(props.value as string)
        }
    }

    return (
        <div className="relative">
            <Input type="text" placeholder="Discount codes" className={cn("pr-20", className)} ref={ref} {...props} />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-green-500 hover:text-green-600 font-medium"
                onClick={handleApply}
                // disabled={disabled}
            >
                Apply
            </Button>
        </div>
    )
})

DiscountInput.displayName = "DiscountInput"

export { DiscountInput }
