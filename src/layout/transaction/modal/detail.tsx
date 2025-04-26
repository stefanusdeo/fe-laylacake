"use client"


import { pdf } from "@react-pdf/renderer"
import { format, parseISO } from "date-fns"
import { saveAs } from "file-saver"
import { useEffect, useState } from "react"

import Dialog from "@/components/molecules/dialog"
import TransactionPDF from "@/components/template/pdf/transaction-pdf"
import { getDetailTrx } from "@/store/action/transactions"
import { useTransactionStore } from "@/store/hooks/useTransactions"
import type { ITransactionDetail, ITransactionItem } from "@/types/transactionTypes"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Text from "@/components/ui/text"
import ClipLoader from "react-spinners/ClipLoader"
import Tables from "@/components/atoms/Table/Tables"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { Separator } from "@radix-ui/react-select"
import { printPDF, downloadPDF } from "@/utils/pdfUtils"

interface ModalDetailProps {
    open: boolean
    onClose: (open: boolean) => void
}
export default function ModalDetail({ open, onClose }: ModalDetailProps) {
    const router = useRouter()
    const { id_transaction } = useTransactionStore()

    const [loading, setLoading] = useState(false)
    const [transactionData, setTransactionData] = useState<ITransactionDetail | null>(null)
    const [trxId, setTrxId] = useState(id_transaction)
    const [isPrinting, setIsPrinting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    // Format date
    const formattedDate = transactionData ? format(parseISO(transactionData?.created_at ?? ""), "dd MMMM yyyy") : ""

    // Calculate total discount
    const totalDiscount = transactionData
        ? transactionData?.transaction_items.reduce((sum, item) => sum + item.discount_nominal, 0)
        : 0

    const columnsItemList: Column<ITransactionItem>[] = [
        {
            label: "Item Name",
            renderCell: (row) => <p>{row.item_name}</p>,
            className: "text-left",
        },
        {
            label: "Price (Rp)",
            renderCell: (row) => <p>{formatCurrency(row.price)}</p>,
            className: "text-right",
        },
        {
            label: "Qty",
            renderCell: (row) => <p>{row.quantity}</p>,
            className: "text-center",
        },
        {
            label: "Discount Code",
            renderCell: (row) => <p>{row.discount_code || "-"}</p>,
            className: "text-center",
        },
        {
            label: "Qty Diskon",
            renderCell: (row) => <p>{row.quantity_discount}</p>,
            className: "text-center",
        },
        {
            label: "Sub Total",
            renderCell: (row) => <p>{formatCurrency(row.sub_total)}</p>,
            className: "text-right",
        },
    ]

    const handlePrint = async () => {
        if (!transactionData || !trxId) {
            toast.error("Transaction not found", {
                duration: 5000,
            })
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
            toast.error("Transaction not found", {
                duration: 5000,
            })
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

    function Footer() {
        return (
            <div className="mt-5 w-full flex max-sm:flex-col flex-row-reverse gap-2 justify-start items-center">
                <Button
                    className=" max-sm:w-full flex items-center gap-1"
                    onClick={handlePrint}
                >
                    <ClipLoader loading={isPrinting} size={14} />
                    <span className="sm:inline">{isPrinting ? "Printing..." : "Print Reciept"}</span>
                </Button>
                <Button
                    variant={"ghost"}
                    className=" max-sm:w-full flex items-center gap-1"
                    onClick={() => onClose(false)}
                >
                    <ClipLoader loading={isPrinting} size={14} />
                    <span className="sm:inline text-red-500">{"Close"}</span>
                </Button>
            </div>
        )
    }

    return (
        <Dialog open={open} onClose={onClose} title={`Transaction`} className="min-w-xs w-full sm:max-w-lg md:max-w-xl" footer={loading ? "" : Footer()}>
            {loading ? (
                <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                    <ClipLoader loading={loading} size={15} /> Please wait...
                </Text>
            ) : (
                <div>
                    <div className="flex gap-4 flex-row items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">Transaction Details</h1>
                            <p className="text-muted-foreground">Transaction #{transactionData?.code ?? ""}</p>
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
                    <Text className="mt-5 mb-1">Staff: {transactionData?.staff.name ?? ""}</Text>
                    <Text>Date: {formattedDate}</Text>
                    <div className="my-5">
                        <Tables columns={columnsItemList} data={transactionData?.transaction_items ?? []} />
                    </div>
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
                </div>
            )}
        </Dialog>
    )
}
