"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface SearchOption {
    value: string
    label: string
}

interface SearchInputGroupProps {
    options: SearchOption[]
    placeholder?: string
    onSearch?: (value: string, filter: string) => void
    className?: string
}


export function SearchInputGroup({
    options = [{ value: "all", label: "All" }],
    placeholder = "Search here...",
    onSearch,
    className,
}: SearchInputGroupProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedFilter, setSelectedFilter] = React.useState<SearchOption>(options[0])
    const [searchValue, setSearchValue] = React.useState("")

    const handleSearch = (value: string) => {
        setSearchValue(value)
        onSearch?.(value, selectedFilter.value)
    }

    return (
        <div className={cn("flex w-full max-w-fit rounded-lg border", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className="min-w-[120px] justify-between rounded-r-none border-r hover:bg-transparent"
                    >
                        {selectedFilter.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[120px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {options.map((data: SearchOption, idx: number) => (
                                    <CommandItem
                                        key={idx}
                                        value={data.value}
                                        onSelect={() => {
                                            setSelectedFilter(data)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedFilter.value === data.value ? "opacity-100" : "opacity-0")}
                                        />
                                        {data.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex w-full max-w-sm items-center rounded-r-lg">
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                    type="search"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border-0 h-10 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-lg"
                />
            </div>
        </div>
    )
}

