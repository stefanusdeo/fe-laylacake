"use client"

import Dialog from "@/components/molecules/dialog"
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
import { cn, useDebounce } from "@/lib/utils"
import { getProductById, searchProducts } from "@/store/action/cashier"
import { ArrowDownIcon, Check } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import { toast } from "sonner"
import { IoIosArrowDown } from "react-icons/io";
import { IProductItems } from "@/types/cashierTypes"
import Text from "@/components/ui/text"

// Tipe data produk
interface ProductData {
    id: number
    name: string
    code?: string
}

// Props komponen pencarian produk
interface ISearchProductProps {
    placeholder?: string
    labelIcon?: ReactNode
    className?: string
    openModal: boolean
    onClose: (open: boolean) => void
    addProduct: (product: IProductItems) => void
}

export function SearchProduct({
    placeholder = "Product",
    labelIcon,
    className = "",
    openModal = false,
    onClose,
    addProduct
}: ISearchProductProps) {
    const [open, setOpen] = useState(false)

    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [productsList, setProductsList] = useState<ProductData[]>([])
    const [value, setValue] = useState<{ id: number; name: string } | null>(null)

    const [dataProduct, setDataProduct] = useState<IProductItems | null>(null)
    const [messageError, setMessageError] = useState<string>("");
    const [disabled, setDisabled] = useState(true)

    const search = useDebounce(searchQuery, 500)

    const searchingProduct = async (nameProduct: string, outletId: string) => {
        setIsLoading(true)
        const resp = await searchProducts({ outletId, name: nameProduct })
        if (resp.status === 200) {
            setProductsList(resp.data)
            setIsLoading(false)
        } else {
            toast.error("Product not found")
            setProductsList([])
            setIsLoading(false)
        }
    }

    const getDetailProduct = async (productId: string, outletId: string) => {
        if (!productId) {
            toast.error("Product not found")
            return
        }
        const resp = await getProductById(productId, outletId)
        if (resp.status === 200 && resp.data) {
            setDataProduct(resp.data)
            setMessageError("")
            setDisabled(false)
        } else {
            setMessageError(resp.message)
            setDisabled(true)
        }
    }

    const handleAddProduct = () => {
        if (!dataProduct) {
            toast.error("Product not found")
            return
        }
        addProduct(dataProduct)
        onClose(false)
    }
    useEffect(() => {
        const outletId = localStorage.getItem("outletId")
        if (!outletId) {
            toast.error("Please select outlet first")
            return
        }

        if (search) {
            searchingProduct(search, outletId)
        }
    }, [search])

    useEffect(() => {
        setMessageError("")
        setDisabled(true)
        const outletId = localStorage.getItem("outletId")
        if (!outletId) {
            toast.error("Please select outlet first")
            return
        }

        if (value?.id) {
            getDetailProduct(value.id.toString(), outletId)
        }
    }, [value?.id])

    useEffect(() => {
        setSearchQuery("")
        setValue(null)
        setProductsList([])
        setDataProduct(null)
        setMessageError("")
        setDisabled(true)
    }, [openModal])

    return (
        <Dialog title="Find Products" open={openModal} onClose={onClose} className="min-w-xs w-full md:max-w-3xl">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full h-14 text-sm md:text-base justify-start gap-3 font-normal ",
                            className, value ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        {labelIcon}
                        {value ? <span className="w-full flex gap-2 items-center justify-between">{value.name}<Check /></span>
                            : <span className="w-full flex gap-2 items-center justify-between">{placeholder}<IoIosArrowDown /></span>}
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="p-0 w-[78svw] sm:max-w-2xl">
                    <Command className="w-full">
                        <CommandInput
                            value={searchQuery}
                            placeholder="Enter product name"
                            className="text-sm md:text-base"
                            onValueChange={(query) => setSearchQuery(query)}
                        />
                        <CommandList>
                            {isLoading ? (
                                <div className="flex items-center gap-2 py-3 px-4 text-sm md:text-base">
                                    <ClipLoader loading={isLoading} size={15} /> Please wait...
                                </div>
                            ) : productsList.length === 0 ? (
                                <CommandEmpty className="text-sm md:text-base px-3 py-2"> Product not found.</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {productsList.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => {
                                                setValue(value?.id === product.id ? null : { id: product.id, name: product.name })
                                                setOpen(false)
                                            }}
                                            className="text-sm md:text-base"
                                        >
                                            <div className="flex flex-col">
                                                <span>{product.name}</span>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value?.id === product.id ? "opacity-100" : "opacity-0"
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
            {!!messageError && <Text variant="span" className=" text-red-500 mt-1">{messageError}</Text>}
            <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="default" disabled={disabled} onClick={handleAddProduct}>Add Cart</Button>
                <Button type="button" variant="outline" onClick={() => onClose(false)}>Close</Button>
            </div>
        </Dialog>

    )
}

export default SearchProduct
