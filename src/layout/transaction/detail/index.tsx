"use client"

import { format, parseISO } from "date-fns"
import {
    Calendar,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Download,
    MapPin,
    Printer,
    ShoppingBag,
    User
} from "lucide-react"
import { useState } from "react"

import Tables from "@/components/atoms/Table/Tables"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ITransactionItem } from "@/types/transactionTypes"
import { RiUserLocationLine } from "react-icons/ri"

export default function TransactionDetails() {
    const [isProductsOpen, setIsProductsOpen] = useState(true)
    const [isPaymentOpen, setIsPaymentOpen] = useState(true)
    const [isDetailsOpen, setIsDetailsOpen] = useState(true)

    // Sample transaction data
    const transaction = {
        id: 231,
        code: "LC0535814TJVeh",
        created_at: "2025-04-02T11:13:16+07:00",
        status: 1,
        time: "11:13",
        discount: 0,
        total_price: 168000,
        money_change: 0,
        pay: 168000,
        transaction_items: [
            {
                code_item: "25",
                item_name: "BROWNIES CLASSIC",
                price: 80000,
                quantity: 1,
                discount_code: "DT24",
                quantity_discount: 1,
                discount_percentage: 0,
                discount_nominal: 30000,
                sub_total: 50000,
            },
            {
                code_item: "45",
                item_name: "BUTTERFLY CAKEE",
                price: 85000,
                quantity: 2,
                discount_code: "",
                quantity_discount: 0,
                discount_percentage: 0,
                discount_nominal: 0,
                sub_total: 170000,
            },
            {
                code_item: "136",
                item_name: "Rotii Sobek Chocoberry",
                price: 15000,
                quantity: 1,
                discount_code: "",
                quantity_discount: 0,
                discount_percentage: 0,
                discount_nominal: 0,
                sub_total: 15000,
            },
            {
                code_item: "ACSPMSK",
                item_name: "PIRING MAS KOTAK",
                price: 6000,
                quantity: 1,
                discount_code: "",
                quantity_discount: 0,
                discount_percentage: 0,
                discount_nominal: 0,
                sub_total: 6000,
            },
            {
                code_item: "ACSBA5",
                item_name: "BALON ANGKA 5",
                price: 5000,
                quantity: 1,
                discount_code: "",
                quantity_discount: 0,
                discount_percentage: 0,
                discount_nominal: 0,
                sub_total: 5000,
            },
            {
                code_item: "ACSBA1",
                item_name: "BALON ANGKA 1",
                price: 5000,
                quantity: 1,
                discount_code: "",
                quantity_discount: 0,
                discount_percentage: 0,
                discount_nominal: 0,
                sub_total: 5000,
            },
            {
                code_item: "ACSSNDK",
                item_name: "SENDOK",
                price: 2000,
                quantity: 1,
                discount_code: "",
                quantity_discount: 0,
                discount_percentage: 0,
                discount_nominal: 0,
                sub_total: 2000,
            },
        ],
        staff: {
            id: 2,
            email: "kasir1@gmail.com",
            name: "dono",
            phone_number: "089787343423",
        },
        outlet: {
            id: 1,
            name: "Regency",
            address: " Villa tangerang indah CC5 No. 3, kec periuk, kota Tangerang.",
            phone_number: "082113716706",
            migration_id: 1,
        },
        payment_method: {
            id: 1,
            name: "Cash",
        },
    }

    // Format date
    const formattedDate = format(parseISO(transaction.created_at), "dd MMMM yyyy")

    // Calculate total items
    const totalItems = transaction.transaction_items.reduce((sum, item) => sum + item.quantity, 0)

    // Calculate total discount
    const totalDiscount = transaction.transaction_items.reduce((sum, item) => sum + item.discount_nominal, 0)

    const columnsItemList: Column<ITransactionItem>[] = [
        {
            label: "No",
            renderCell: () => null,
            className: "text-center",
        },
        {
            label: "Kode Item",
            renderCell: (row) => <p>{row.code_item}</p>,
            className: "text-left",
        },
        {
            label: "Nama Item",
            renderCell: (row) => <p>{row.item_name}</p>,
            className: "text-left",
        },
        {
            label: "Harga",
            renderCell: (row) => <p>{row.price.toLocaleString("id-ID")}</p>,
            className: "text-right",
        },
        {
            label: "Qty",
            renderCell: (row) => <p>{row.quantity}</p>,
            className: "text-center",
        },
        {
            label: "Kode Diskon",
            renderCell: (row) => <p>{row.discount_code || "-"}</p>,
            className: "text-center",
        },
        {
            label: "Qty Diskon",
            renderCell: (row) => <p>{row.quantity_discount}</p>,
            className: "text-center",
        },
        {
            label: "Diskon (%)",
            renderCell: (row) => <p>{row.discount_percentage}%</p>,
            className: "text-right",
        },
        {
            label: "Diskon (Rp)",
            renderCell: (row) => <p>{row.discount_nominal.toLocaleString("id-ID")}</p>,
            className: "text-right",
        },
        {
            label: "Sub Total",
            renderCell: (row) => <p>{row.sub_total.toLocaleString("id-ID")}</p>,
            className: "text-right",
        },
    ];


    return (
        <div className="min-h-screen pb-10">
            <div className=" mx-auto space-y-5">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-primary">Transaction Details</h1>
                        <p className="text-muted-foreground">Transaction info overview</p>
                    </div>
                    <div className="flex gap-2 md:mt-0">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Printer className="h-4 w-4" />
                            <span className="hidden sm:inline">Print</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                        </Button>
                    </div>
                </div>

                {/* Transaction Summary Card */}
                <Card className="border-accent border rounded-lg shadow-none bg-white">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-bold">Transaction #{transaction.code}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formattedDate}
                                    <span className="mx-2">•</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    {transaction.time}
                                </CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Completed
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                                <p className="font-medium">{transaction.payment_method.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Items</p>
                                <p className="font-medium">{totalItems} items</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                <p className="font-medium text-lg">Rp {transaction.total_price.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Section */}
                <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
                    <Card className="border-accent border rounded-lg shadow-none bg-white overflow-hidden">
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer select-none">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                                        <CardTitle className="text-lg font-bold">Products</CardTitle>
                                    </div>
                                    {isProductsOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="p-0">
                                <Tables
                                    data={transaction.transaction_items}
                                    columns={columnsItemList}
                                />
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Payment Details */}
                <Collapsible open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <Card className="border-accent border rounded-lg shadow-none bg-white">
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer select-none">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                                        <CardTitle className="text-lg font-bold">Payment Details</CardTitle>
                                    </div>
                                    {isPaymentOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>Rp {(transaction.total_price + totalDiscount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Discount</span>
                                        <span className="text-red-500">-Rp {totalDiscount.toLocaleString()}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total</span>
                                        <span>Rp {transaction.total_price.toLocaleString()}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Payment ({transaction.payment_method.name})</span>
                                        <span>Rp {transaction.pay.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Change</span>
                                        <span>Rp {transaction.money_change.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Staff and Outlet Details */}
                <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <Card className="border-accent border rounded-lg shadow-none bg-white">
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer select-none">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <RiUserLocationLine className="h-5 w-5 mr-2 text-primary" />
                                        <CardTitle className="text-lg font-bold">Staff & Outlet Information</CardTitle>
                                    </div>
                                    {isDetailsOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-primary flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            Staff Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Name</span>
                                                <span className="font-medium">{transaction.staff.name}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Email</span>
                                                <span className="font-medium">{transaction.staff.email}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Phone</span>
                                                <span className="font-medium">{transaction.staff.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-primary flex items-center">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Outlet Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Name</span>
                                                <span className="font-medium">{transaction.outlet.name}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Address</span>
                                                <span className="font-medium">{transaction.outlet.address}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Phone</span>
                                                <span className="font-medium">{transaction.outlet.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            </div>
        </div>
    )
}
