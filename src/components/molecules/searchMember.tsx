"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn, useDebounce } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ClipLoader from "react-spinners/ClipLoader"

interface MemberData {
    id: number
    name: string
    email?: string
}

interface ISearchMemberProps {
    value: { id: number; name: string } | null
    setValue: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>
    placeholder?: string
    labelIcon?: React.ReactNode
    className?: string
}

const dummyMembers: MemberData[] = []

export function SearchMember({
    value,
    setValue,
    placeholder = "Member",
    labelIcon,
    className = "",
}: ISearchMemberProps) {
    const [members, setMembers] = React.useState<MemberData[]>(dummyMembers)
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const search = useDebounce(searchQuery, 500)

    React.useEffect(() => {
        if (!open) return
        setIsLoading(true)

        // Simulasi pencarian data (filter dummy)
        setTimeout(() => {
            if (search) {
                setMembers(
                    dummyMembers.filter((member) =>
                        member.name.toLowerCase().includes(search.toLowerCase())
                    )
                )
            } else {
                setMembers(dummyMembers)
            }
            setIsLoading(false)
        }, 1000)
    }, [open, search])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full sm:w-auto min-w-[240px] max-w-full text-sm md:text-base justify-start gap-3",
                        className, value? "text-accent": "text-muted-foreground"
                    )}
                >
                    {labelIcon}
                    {value ? value.name : placeholder}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0 w-[80vw] sm:w-[300px]">
                <Command className="w-full">
                    <CommandInput
                        value={searchQuery}
                        placeholder="Search Member..."
                        className="h-9 text-sm md:text-base"
                        onValueChange={(query) => setSearchQuery(query)}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center gap-2 py-3 px-4 text-sm md:text-base">
                                <ClipLoader loading={isLoading} size={15} /> Please wait...
                            </div>
                        ) : members.length === 0 ? (
                            <CommandEmpty className="text-sm md:text-base p-3">Member not found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {members.map((member) => (
                                    <CommandItem
                                        key={member.id}
                                        value={member.name}
                                        onSelect={() => {
                                            setValue(value?.id === member.id ? null : { id: member.id, name: member.name })
                                            setOpen(false)
                                        }}
                                        className="text-sm md:text-base"
                                    >
                                        <div className="flex flex-col">
                                            <span>{member.name}</span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value?.id === member.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default SearchMember