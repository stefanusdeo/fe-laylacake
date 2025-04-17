import { format, parseISO } from "date-fns"
import type { ITransactionDetail } from "@/types/transactionTypes"

interface PrintReceiptProps {
    transaction: ITransactionDetail | null
}

const PrintReceipt = ({ transaction }: PrintReceiptProps) => {
    if (!transaction) return null

    // Format date
    const formattedDate = format(parseISO(transaction.created_at), "dd MMM yyyy")

    // Calculate total discount
    const totalDiscount = transaction.transaction_items.reduce((sum, item) => sum + item.discount_nominal, 0)

    // Calculate total items
    const totalItems = transaction.transaction_items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="print-only hidden">
            <div className="p-3 max-w-[80mm] mx-auto text-sm font-sans">
                {/* Header */}
                <div className="text-center mb-3">
                    <h1 className="font-bold text-base uppercase tracking-wide">{transaction.outlet.name}</h1>
                    <p className="text-xs mt-1">{transaction.outlet.address}</p>
                </div>

                {/* Transaction Info */}
                <div className="border-t border-b border-dashed py-2 mb-3 text-xs">
                    <div className="grid grid-cols-2 gap-1">
                        <span className="text-left">Receipt:</span>
                        <span className="text-right font-medium">{transaction.code}</span>

                        <span className="text-left">Date:</span>
                        <span className="text-right">{formattedDate}</span>

                        <span className="text-left">Time:</span>
                        <span className="text-right">{transaction.time}</span>

                        <span className="text-left">Cashier:</span>
                        <span className="text-right">{transaction.staff.name}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-3">
                    <div className="text-xs font-medium mb-1 uppercase tracking-wide">Items</div>

                    {transaction.transaction_items.map((item, index) => (
                        <div key={index} className="text-xs mb-2">
                            <div className="flex justify-between">
                                <div>
                                    <div className="font-medium">{item.item_name}</div>
                                    <div>{item.sub_total.toLocaleString("id-ID")}</div>
                                </div>
                                <div className="text-right">
                                    {item.quantity} x {item.price.toLocaleString("id-ID")}
                                </div>
                            </div>
                            {item.discount_nominal > 0 && (
                                <div className="text-[10px] text-gray-600 pl-2">
                                    Discount: -{item.discount_nominal.toLocaleString("id-ID")}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="border-t border-dashed pt-2 mb-3 text-xs">
                    <div className="grid grid-cols-2 gap-1">
                        <span className="text-left">Items:</span>
                        <span className="text-right">{totalItems}</span>

                        <span className="text-left">Subtotal:</span>
                        <span className="text-right">{(transaction.total_price + totalDiscount).toLocaleString("id-ID")}</span>

                        {totalDiscount > 0 && (
                            <>
                                <span className="text-left">Discount:</span>
                                <span className="text-right">-{totalDiscount.toLocaleString("id-ID")}</span>
                            </>
                        )}
                    </div>

                    <div className="border-t border-b border-dashed my-1.5 py-1">
                        <div className="flex justify-between font-bold">
                            <span>TOTAL</span>
                            <span>Rp {transaction.total_price.toLocaleString("id-ID")}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                        <span className="text-left">{transaction.payment_method.name}:</span>
                        <span className="text-right">{transaction.pay.toLocaleString("id-ID")}</span>

                        <span className="text-left">Change:</span>
                        <span className="text-right">{transaction.money_change.toLocaleString("id-ID")}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs pt-2 border-t border-dashed">
                    <p className="font-medium">Thank you for your purchase</p>
                    <p className="text-[10px] mt-1">* Please keep this receipt for returns *</p>
                </div>
            </div>
        </div>
    )
}

export default PrintReceipt
