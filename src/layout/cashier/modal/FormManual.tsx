import Tables from "@/components/atoms/Table/Tables";
import Dialog from "@/components/molecules/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from '../../../lib/utils';
import PaymentMethodSelect from "@/components/molecules/Selects/CustomPaymentMethodSelect";
import { ICreateManualTransactionBody } from "@/types/cashierTypes";
import { downloadPDF, printPDF } from "@/utils/pdfUtils";
import TransactionPDF from "@/components/template/pdf/transaction-pdf";
import { IManualTransactionDetail, ITransactionDetail } from "@/types/transactionTypes";
import { toast } from "sonner";
import { createManualTransaction } from "@/store/action/cashier";

// Tambahkan tipe data untuk produk manual
type ManualProduct = {
    id: string;
    name: string;
    price: number;
    qty: number;
    total: number;
};

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function FormManual({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) {
    const [products, setProducts] = useState<ManualProduct[]>([
        { id: generateId(), name: "", price: 0, qty: 0, total: 0 }
    ]);
    const [pay, setPay] = useState("");
    const [method, setMethod] = useState("");

    const handleProductChange = (id: string, field: string, value: any) => {
        const updated = products.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item };
                if (field === "name") {
                    updatedItem.name = value as string;
                } else if (field === "price") {
                    updatedItem.price = Number(value);
                } else if (field === "qty") {
                    updatedItem.qty = Number(value);
                }
                updatedItem.total = updatedItem.price * updatedItem.qty;
                return updatedItem;
            }
            return item;
        });
        setProducts(updated);
    };

    const handleQty = (id: string, delta: number) => {
        const updated = products.map((item) => {
            if (item.id === id) {
                const newQty = Math.max(0, item.qty + delta);
                return { ...item, qty: newQty, total: item.price * newQty };
            }
            return item;
        });
        setProducts(updated);
    };

    const handleAddRow = () =>
        setProducts([...products, { id: generateId(), name: "", price: 0, qty: 0, total: 0 }]);
    const handleRemoveRow = (id: string) =>
        setProducts(products.filter((item) => item.id !== id));

    const total = products.reduce((sum, p) => sum + p.total, 0);
    const moneyChanges = pay ? Math.max(0, Number(pay) - total) : 0;

    const disabled = !pay || !method || total === 0 || moneyChanges < 0 || products.length === 0;

    // Kolom untuk tabel manual transaction
    const columnsManual: Column<ManualProduct>[] = [
        {
            label: "No",
            renderCell: () => null,
            className: "text-center w-10",
        },
        {
            label: "Product Name",
            renderCell: (row) => (
                <Input
                    placeholder="Name"
                    value={row.name}
                    onChange={e => handleProductChange(row.id, "name", e.target.value)}
                />
            ),
            className: "min-w-52",
        },
        {
            label: "Price",
            renderCell: (row) => (
                <Input
                    type="number"
                    placeholder="price"
                    min={0}
                    value={row.price}
                    onChange={e => handleProductChange(row.id, "price", e.target.value)}
                    className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                />
            ),
            className: "min-w-40",
        },
        {
            label: "Qty",
            renderCell: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <Button type="button" size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQty(row.id, -1)}>
                        <Minus />
                    </Button>
                    <span className="w-8 text-center">{row.qty}</span>
                    <Button type="button" size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQty(row.id, 1)}>
                        <Plus />
                    </Button>
                </div>
            ),
            className: "text-center",
        },
        {
            label: "Subtotal",
            renderCell: (row) => <span className="font-medium">{formatCurrency(row.total)}</span>,
            className: "text-center",
        },
        {
            label: "",
            renderCell: (row) =>
                products.length > 1 && (
                    <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleRemoveRow(row.id)}>
                        x
                    </Button>
                ),
            className: "text-center",
        },
    ];

    const handleCheckout = async () => {
        // Lakukan proses checkout
        const outletId = localStorage.getItem("outletId");

        if (!outletId) {
            toast.error("Please select an outlet", { duration: 5000 })
            return;
        }

        const bodyRequest: ICreateManualTransactionBody = {
            payment_method: Number(method),
            pay: Number(pay),
            product: products.map((product) => (
                {
                    name: product.name,
                    price: product.price,
                    quantity: product.qty,
                }
            )),
            outlet_id: Number(outletId),
        }

        try {
            const response = await createManualTransaction(bodyRequest);
            if (response.status === 200) {
                await downloadPDF(
                    <TransactionPDF transaction={response.data} />,
                    `receipt-${response.data.code}.pdf`,
                    () => {
                        toast.success("Receipt downloaded successfully", { duration: 5000 })
                        setPay("");
                        setMethod("");
                        setProducts([{ id: generateId(), name: "", price: 0, qty: 0, total: 0 }]);
                        onClose(false);
                    },
                    (error) => {
                        toast.error("Failed to download receipt", { duration: 5000 })
                        console.error("Print error:", error)
                    }
                )
            } else {
                toast.error(response.message || "Failed to create transaction", { duration: 5000 })
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            toast.error("Failed to create transaction", { duration: 5000 })
        }
    };

    function Footer() {
        return (
            <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => onClose(false)}>Close</Button>
                <Button type="button" variant="default" disabled={disabled} onClick={handleCheckout}>Create</Button>
            </div>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} title="Form Add Manual Transaction" footer={Footer()} className="min-w-xs w-full md:max-w-3xl lg:max-w-5xl">
            <div className="w-full">
                <Tables columns={columnsManual} data={products} />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Total.</span>
                    <span className="text-lg font-bold">{formatCurrency(total)}</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <Button type="button" variant="outline" onClick={handleAddRow} className="w-fit">+ Add Product</Button>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <Input
                            type="number"
                            placeholder="Pay"
                            min={0}
                            value={pay}
                            onChange={e => setPay(e.target.value)}
                            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                        />
                        <PaymentMethodSelect
                            placeholder='Payment Method'
                            value={method}
                            onChange={setMethod}
                            className="w-full"
                            label="Payment"
                        />
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Money changes</span>
                            <span className="font-bold text-green-600">{formatCurrency(moneyChanges)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default FormManual;