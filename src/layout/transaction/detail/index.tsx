"use client"

import type React from "react"

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
    User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"

import Tables from "@/components/atoms/Table/Tables"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import Text from "@/components/ui/text"
import { getDetailTrx } from "@/store/action/transactions"
import { useTransactionStore } from "@/store/hooks/useTransactions"
import type { ITransactionDetail, ITransactionItem } from "@/types/transactionTypes"
import { useRouter } from "next/navigation"
import { RiUserLocationLine } from "react-icons/ri"
import ClipLoader from "react-spinners/ClipLoader"
import { toast } from "sonner"
import TransactionPDF from "@/components/template/pdf/transaction-pdf"
import Badge from "@/components/atoms/Badge"
import { printPDF, downloadPDF } from "@/utils/pdfUtils"

interface Column<T> {
    label: string
    renderCell: (row: T) => React.ReactNode
    className?: string
}

export default function TransactionDetails() {
    const router = useRouter()
    const { id_transaction } = useTransactionStore()

    const [loading, setLoading] = useState(false)
    const [transactionData, setTransactionData] = useState<ITransactionDetail | null>(null)
    const [trxId, setTrxId] = useState(id_transaction)
    const [isPrinting, setIsPrinting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const [isProductsOpen, setIsProductsOpen] = useState(true)
    const [isPaymentOpen, setIsPaymentOpen] = useState(true)
    const [isDetailsOpen, setIsDetailsOpen] = useState(true)

    // Format date
    const formattedDate = transactionData ? format(parseISO(transactionData?.created_at ?? ""), "dd MMMM yyyy") : ""

    // Calculate total items
    const totalItems = transactionData
        ? transactionData?.transaction_items.reduce((sum, item) => sum + item.quantity, 0)
        : 0

    // Calculate total discount
    const totalDiscount = transactionData
        ? transactionData?.transaction_items.reduce((sum, item) => sum + item.discount_nominal, 0)
        : 0

    const columnsItemList: Column<ITransactionItem>[] = [
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
    ]

    const handlePrint = async () => {
        if (!transactionData || !trxId) {
            toast.error("Transaction not found", { duration: 5000 })
            return
        }
        setIsPrinting(true)
        await printPDF(
            <TransactionPDF transaction={transactionData} />,
            () => {
                setIsPrinting(false)
                toast.success("Transaction sent to printer successfully", { duration: 5000 })
            },
            (error) => {
                setIsPrinting(false)
                toast.error("Failed to print transaction", { duration: 5000 })
                console.error("Print error:", error)
            }
        )
    }

    const handleDownload = async () => {
        if (!transactionData) {
            toast.error("Transaction not found", { duration: 5000 })
            return
        }
        setIsDownloading(true)
        await downloadPDF(
            <TransactionPDF transaction={transactionData} />,
            `receipt-${transactionData.code}.pdf`,
            () => {
                setIsDownloading(false)
                toast.success("Receipt downloaded successfully", { duration: 5000 })
            },
            (error) => {
                setIsDownloading(false)
                toast.error("Failed to download receipt", { duration: 5000 })
                console.error("Download error:", error)
            }
        )
    }

    useEffect(() => {
        setLoading(true)
        if (id_transaction) {
            setTrxId(id_transaction)
            const getDetail = async () => {
                try {
                    const res = await getDetailTrx(id_transaction)
                    if (res?.status === 200) {
                        setTransactionData(res.data)
                    }
                } catch (error) {
                    toast.error("Transaction record could not be found.", {
                        duration: 5000,
                    })
                    setLoading(false)
                } finally {
                    setLoading(false)
                }
            }
            getDetail()
        } else {
            toast.error("Transaction not found", {
                description: "Redirecting to the previous page...",
                duration: 5000,
            })

            router.back()
        }
    }, [id_transaction])

    // Handle print media change to reset state after printing
    useEffect(() => {
        const mediaQueryList = window.matchMedia("print")

        const handlePrintChange = (mql: MediaQueryListEvent) => {
            if (!mql.matches && isPrinting) {
                // Print dialog was closed
                setIsPrinting(false)
            }
        }

        mediaQueryList.addEventListener("change", handlePrintChange)

        return () => {
            mediaQueryList.removeEventListener("change", handlePrintChange)
        }
    }, [isPrinting])

    return (
        <div className="min-h-screen pb-10">
            {loading ? (
                <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                    <ClipLoader loading={loading} size={15} /> Please wait...
                </Text>
            ) : (
                <div className=" mx-auto space-y-5">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary">Transaction Details</h1>
                            <p className="text-muted-foreground">Transaction info overview</p>
                        </div>
                        <div className="flex gap-2 md:mt-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={handlePrint}
                                disabled={isPrinting || !transactionData}
                            >
                                {isPrinting ? <ClipLoader loading={true} size={14} /> : <Printer className="h-4 w-4" />}
                                <span className="hidden sm:inline">{isPrinting ? "Printing..." : "Print"}</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={handleDownload}
                                disabled={isDownloading || !transactionData}
                            >
                                {isDownloading ? <ClipLoader loading={true} size={14} /> : <Download className="h-4 w-4" />}
                                <span className="hidden sm:inline">{isDownloading ? "Downloading..." : "Download"}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Transaction Summary Card */}
                    <Card className="border-accent border rounded-lg shadow-none bg-white">
                        <CardHeader className="pb-2">
                            <div className="flex flex-wrap justify-between gap-3 items-center">
                                <div className="space-y-2">
                                    <CardTitle className="text-xl font-bold">Transaction #{transactionData?.code}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {formattedDate}
                                        <span className="mx-2">•</span>
                                        <Clock className="h-4 w-4 mr-1" />
                                        {transactionData?.time}
                                    </CardDescription>
                                </div>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1" label={"Completed"} icon={<Check className="h-3.5 w-3.5 mr-1" />} iconSide="left" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                                    <p className="font-medium">{transactionData?.payment_method.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Items</p>
                                    <p className="font-medium">{totalItems} items</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="font-medium text-lg">Rp {transactionData?.total_price.toLocaleString()}</p>
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
                                    <Tables data={transactionData?.transaction_items ?? []} columns={columnsItemList} />
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
                                            <span>Rp {(transactionData?.total_price ?? 0 + totalDiscount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Discount</span>
                                            <span className="text-red-500">-Rp {totalDiscount.toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center font-bold">
                                            <span>Total</span>
                                            <span>Rp {transactionData?.total_price.toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Payment ({transactionData?.payment_method.name})</span>
                                            <span>Rp {transactionData?.pay.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Change</span>
                                            <span>Rp {transactionData?.money_change.toLocaleString()}</span>
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
                                                    <span className="font-medium capitalize">{transactionData?.staff.name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-muted-foreground">Email</span>
                                                    <span className="font-medium">{transactionData?.staff.email}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-muted-foreground">Phone</span>
                                                    <span className="font-medium">{transactionData?.staff.phone_number}</span>
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
                                                    <span className="font-medium capitalize">{transactionData?.outlet.name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-muted-foreground">Address</span>
                                                    <span className="font-medium">{transactionData?.outlet.address}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-muted-foreground">Phone</span>
                                                    <span className="font-medium">{transactionData?.outlet.phone_number}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                </div>
            )}
        </div>
    )
}
