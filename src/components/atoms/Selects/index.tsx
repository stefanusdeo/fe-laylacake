"use client"

import type React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export interface SelectOption {
    value: string
    label: string
}

export interface CustomSelectProps {
    options?: SelectOption[]
    label?: string
    placeholder?: string
    defaultValue?: string
    value?: string
    onChange?: (value: string) => void
    name?: string
    className?: string
    disabled?: boolean
    isLoading?: boolean
    emptyMessage?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options = [],
    label,
    placeholder = "Select an option",
    defaultValue,
    value,
    onChange,
    name,
    className = "w-[180px]",
    disabled = false,
    isLoading = false,
    emptyMessage = "No options available",
}) => {
    const hasOptions = Array.isArray(options) && options.length > 0

    return (
        <Select
            defaultValue={defaultValue}
            value={value}
            onValueChange={onChange}
            name={name}
            disabled={disabled || isLoading || !hasOptions}
        >
            <SelectTrigger className={className}>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    <SelectValue placeholder={placeholder} />
                )}
            </SelectTrigger>
            <SelectContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading options...</span>
                    </div>
                ) : hasOptions ? (
                    <SelectGroup>
                        {label && <SelectLabel>{label}</SelectLabel>}
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                ) : (
                    <div className="text-center py-2 text-muted-foreground">{emptyMessage}</div>
                )}
            </SelectContent>
        </Select>
    )
}
