import Tables from '@/components/atoms/Table/Tables'
import PaymentMethodSelect from '@/components/molecules/Selects/CustomPaymentMethodSelect'
import BreadcrumbWithDropdown from '@/components/molecules/breadcrums'
import SearchMember from '@/components/molecules/searchMember'
import { Button } from '@/components/ui/button'
import { DiscountInput } from '@/components/ui/discountInput'
import { Input } from '@/components/ui/input'
import Text from '@/components/ui/text'
import { cn, formatCurrency } from '@/lib/utils'
import { ICartItem, IProductItems } from '@/types/cashierTypes'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { PiShoppingCart } from "react-icons/pi"
import FormManual from './modal/FormManual'

function Cashier() {
    const [cartItems, setCartItems] = useState<ICartItem[]>([])
    const [products, setProducts] = useState<IProductItems[]>([
        {
            id: 101,
            unique_id: "1001",
            code: "ACSSNDK",
            slug: "sendok",
            name: "SENDOK",
            description: "Sendok plastik kecil",
            price: 2000,
            stock: 120,
        },
        {
            id: 102,
            unique_id: "1002",
            code: "ACSGRP",
            slug: "garpu",
            name: "GARPU",
            description: "Garpu plastik kecil",
            price: 2000,
            stock: 142,
        },
        {
            id: 103,
            unique_id: "1003",
            code: "ACSBA1",
            slug: "balon-angka-1",
            name: "BALON ANGKA 1",
            description: "Balon bentuk angka satu",
            price: 5000,
            stock: 50,
        },
        {
            id: 104,
            unique_id: "1004",
            code: "ACSPMSK",
            slug: "piring-kotak",
            name: "PIRING MAS KOTAK",
            description: "Piring kecil bentuk kotak",
            price: 6000,
            stock: 80,
        }
    ])
    const [discountCode, setDiscountCode] = useState("")
    const [methodSelect, setMethodSelect] = useState("")
    const [selectedMember, setSelectedMember] = useState<{ id: number, name: string } | null>(null)
    const [openManualModal, setOpenManualModal] = useState(false)

    const handleApplyDiscount = (code: string) => {
        console.log("Applying discount code:", code)
        // Add your discount application logic here
    }

    const columnsPaymentList: Column<IProductItems>[] = [
        {
            label: "Product Name",
            renderCell: ({ name }) => <p>{name}</p>,
            className: "",
        },
        {
            label: "Price",
            renderCell: ({ price }) => <p>{formatCurrency(price)}</p>,
            className: "",
        },
        {
            label: "Quantity",
            renderCell: ({ stock }) => (
                <div className="col-span-2 md:col-span-2 md:flex md:flex-col md:items-center">
                    <div className="flex items-center gap-2 justify-end md:justify-center">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-md border-gray-200"
                            onClick={() => null}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center font-medium">{1}</span>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-md border-gray-200"
                            onClick={() => null}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className=" text-xs text-gray-400 text-right md:text-end mt-1">
                        available: {stock}
                    </div>
                </div>
            ),
            className: cn("text-center justify-center"),
        },
        {
            label: "Code Discount",
            renderCell: () => <DiscountInput
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                onApply={handleApplyDiscount}
            />,
            className: cn("text-center justify-center "),
        },
        {
            label: "Total",
            renderCell: ({ price }) => (
                <div className="w-full py-1.5">
                    <Text variant='h6' className='text-right'>{formatCurrency(price)}</Text>
                    <Text variant='span' className="text-xs text-red-500 flex items-center justify-end gap-1">
                        {/* <Percent className="h-3 w-3" /> */}
                        - {formatCurrency(price)}
                    </Text>
                </div>),
            className: " flex items-center justify-center",
        },
        {
            label: "",
            renderCell: ({ id, name }) => (
                <Button variant="outline" size="icon">
                    <Trash2 />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-wrap justify-between items-center gap-5 select-none'>
                <div className='flex flex-col gap-3'>
                    <Text variant='h2' className=' max-sm:text-2xl'>Create Transaction</Text>
                    <BreadcrumbWithDropdown />
                </div>
                <Button onClick={() => setOpenManualModal(true)} className='max-sm:w-full'><Plus /> <span className=''>Manual Transaction</span></Button>
            </div>
            <div className='flex flex-col gap-6 mb-10'>
                <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg space-y-7">
                    <div className='flex flex-wrap justify-between gap-4 md:gap-8 border-b border-accent p-2.5 md:px-5 md:py-5'>
                        <div className='flex items-center gap-2'>
                            <Text variant='h5' className='flex items-center gap-2'><PiShoppingCart /><span> Cart</span></Text>
                            <Text variant='p' className='text-slate-400'>{`(0 item)`}</Text>
                        </div>
                        <Button variant={"outline"} onClick={() => null} className=' flex items-center gap-2'>
                            <Plus />
                            <span className='flex items-center gap-1'><p className='max-sm:hidden'>Add</p> Product</span>
                        </Button>
                    </div>
                    <div className='px-2.5 md:px-5'>
                        {products.length > 0 ? <Tables columns={columnsPaymentList} data={products} />
                            : (
                                <div className='w-full min-h-60 px-1 flex flex-col items-center justify-center gap-2'>
                                    <Text variant='h4'>Your cart is empty</Text>
                                    <Text variant='span' className='text-slate-400 max-w-md text-center'>Looks like you haven't added any items to your cart yet. Start adding products to proceed with your transaction.</Text>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg p-2.5 md:p-5 space-y-7">
                    <Text variant='h5' className='flex items-center gap-2'><IoDocumentTextOutline /><span> Order Summary</span></Text>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sub Total</span>
                            <span className="font-medium">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span className="font-medium">-</span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span className="font-medium">Total</span>
                            <span className="font-medium text-orange-500">{formatCurrency(0)}</span>
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-5'>
                        <DiscountInput
                            className='h-12'
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            onApply={handleApplyDiscount}
                        />
                        <SearchMember
                            value={selectedMember}
                            setValue={setSelectedMember}
                            className='!h-12 !w-full px-2.5 font-normal !text-sm hover:bg-transparent hover:text-gray-500'
                        />
                        <PaymentMethodSelect
                            value={methodSelect}
                            onChange={setMethodSelect}
                            className="!h-12 w-full"
                            placeholder='Payment Method'
                        />
                        <Input placeholder='Pay' />
                        <div className="flex justify-between">
                            <span className="font-medium">Money Changes</span>
                            <span className="font-medium text-orange-500">{formatCurrency(0)}</span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => null} className='w-full h-12 mx-auto'>
                    <span className='flex items-center gap-1'>
                        <p>Check Out</p>
                    </span>
                </Button>
            </div>
            <FormManual open={openManualModal} onClose={setOpenManualModal} />
        </div>
    )
}

export default Cashier
