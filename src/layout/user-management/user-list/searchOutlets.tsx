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
import { LiaStoreAltSolid } from "react-icons/lia"
import { IParamsOutlet, OutletData } from "@/types/outletTypes"
import { getOutletsInternal } from "@/store/action/outlets"
import ClipLoader from "react-spinners/ClipLoader"
import Text from "@/components/ui/text"

interface ISearchOutlets {
    value: { id: number; name: string } | null
    setValue: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>
}

export function SearchOutlets({ value, setValue }: ISearchOutlets) {
    const [outlets, setOutlet] = React.useState<OutletData[]>([])
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false)

    const search = useDebounce(searchQuery, 500);

    const [_isPending, startTransition] = React.useTransition();

    const getInternalOutlets = async () => {
        setIsLoading(true);
        try {
            const params: IParamsOutlet = { page: 0, limit: 7, filter: "name", search };
            const res = await getOutletsInternal(params);
            setOutlet(res?.data || []);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (!open) return;
        startTransition(() => {
            getInternalOutlets();
        });
    }, [open, search]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-auto min-w-[290px] justify-start gap-4"
                >
                    <LiaStoreAltSolid className="opacity-50" />
                    {value ? value.name : "Choose an Outlet"}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
                <Command className="w-full">
                    <CommandInput
                        value={searchQuery}
                        placeholder="Search Outlets..."
                        className="h-9"
                        onValueChange={(query) => setSearchQuery(query)}
                    />
                    <CommandList>
                        {isLoading ? (
                            <Text variant="span" className="flex items-center gap-2 py-3 px-4">
                                <ClipLoader loading={isLoading} size={15} /> Please wait...
                            </Text>
                        ) : outlets.length === 0 ? (
                            <CommandEmpty>Outlet not found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {outlets.map((outlet: OutletData) => (
                                    <CommandItem
                                        key={outlet.id}
                                        value={outlet.name}
                                        onSelect={() => {
                                            setValue(
                                                value?.id === outlet.id ? null : { id: outlet.id, name: outlet.name }
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        {outlet.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value?.id === outlet.id ? "opacity-100" : "opacity-0"
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
