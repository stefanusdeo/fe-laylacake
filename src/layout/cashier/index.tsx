"use client"

import Tables from "@/components/atoms/Table/Tables"
import PaymentMethodSelect from "@/components/molecules/Selects/CustomPaymentMethodSelect"
import BreadcrumbWithDropdown from "@/components/molecules/breadcrums"
import SearchMember from "@/components/molecules/searchMember"
import { Button } from "@/components/ui/button"
import { DiscountInput } from "@/components/ui/discountInput"
import { Input } from "@/components/ui/input"
import Text from "@/components/ui/text"
import { cn, formatCurrency } from "@/lib/utils"
import type { ICartItem, ICreateTransactionBody, IDiscountItem, IProductItems } from "@/types/cashierTypes"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { IoDocumentTextOutline } from "react-icons/io5"
import { PiShoppingCart } from "react-icons/pi"
import FormManual from "./modal/FormManual"
import SearchProduct from "./modal/searchProduct"
import { toast } from "sonner"
import { createTransaction, getDiscount } from "@/store/action/cashier"
import { printPDF } from "@/utils/pdfUtils"
import TransactionPDF from "@/components/template/pdf/transaction-pdf"
// Enhanced discount interface with more details
interface IDiscount {
    productId: number
    discountCode: string
    discountValue: number
}

// Payment information interface
interface IPayment {
    amount: number
    method: string
}

function Cashier() {
    const [openManualModal, setOpenManualModal] = useState(false)
    const [openModalProduct, setOpenModalProduct] = useState(false)

    const [cart, setCart] = useState<ICartItem[]>([])
    const [cartItems, setCartItems] = useState<IProductItems[]>([])

    // Enhanced discount management
    const [productDiscounts, setProductDiscounts] = useState<IDiscount[]>([])
    const [cartDiscountCode, setCartDiscountCode] = useState("")
    const [cartDiscount, setCartDiscount] = useState<IDiscount | null>(null)
    const [tempDiscountCode, setTempDiscountCode] = useState("")

    // Payment information
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentAmount, setPaymentAmount] = useState<number>(0)
    const [selectedMember, setSelectedMember] = useState<{ id: number; name: string } | null>(null)

    // Apply discount to a specific product
    const handleApplyProductDiscount = async (productId: number) => {
        const codeDiscountProduct = productDiscounts.find((discount) => discount.productId === productId)?.discountCode || ""
        if (!codeDiscountProduct) {
            setProductDiscounts(productDiscounts.filter((discount) => discount.productId !== productId))
            setCart(cart.map((item) => (item.product_id === productId ? { ...item, discount_code: "" } : item)))
            toast.success("Discount removed")
            return
        }

        const outletId = localStorage.getItem("outletId")
        if (!outletId) {
            toast.error("Please select outlet first")
            return
        }

        try {
            const response = await getDiscount(codeDiscountProduct, Number(outletId))

            if (response.status === 200) {
                const discountData: IDiscountItem = response.data

                // Create new discount object with enhanced information
                const newDiscount: IDiscount = {
                    productId,
                    discountCode: discountData.code,
                    discountValue: discountData.nominal,
                }

                // Remove any existing discount for this product
                const updatedDiscounts = productDiscounts.filter((discount) => discount.productId !== productId)

                // Add the new discount
                setProductDiscounts([...updatedDiscounts, newDiscount])

                // Update cart item with discount code
                setCart(
                    cart.map((item) => (item.product_id === productId ? { ...item, discount_code: discountData.code } : item)),
                )

                toast.success("Discount applied successfully")
            } else {
                toast.error(response.message || "Invalid discount code")
            }
        } catch (error) {
            toast.error("Error applying discount")
        }
    }

    // Apply discount to the entire cart
    const handleApplyCartDiscount = async () => {
        if (!cartDiscountCode) {
            setCartDiscount(null)
            toast.success("Cart discount removed")
            return
        }

        const outletId = localStorage.getItem("outletId")
        if (!outletId) {
            toast.error("Please select outlet first")
            return
        }

        try {
            const response = await getDiscount(cartDiscountCode, Number(outletId))

            if (response.status === 200) {
                const discountData: IDiscountItem = response.data

                // Create cart discount object
                const newCartDiscount: IDiscount = {
                    productId: 0, // 0 indicates cart-level discount
                    discountCode: discountData.code,
                    discountValue: discountData.percentage,
                }

                setCartDiscount(newCartDiscount)
                toast.success("Cart discount applied successfully")
            } else {
                toast.error(response.message || "Invalid discount code")
            }
        } catch (error) {
            toast.error("Error applying cart discount")
        }
    }

    const handleAddProductToCart = (product: IProductItems) => {
        if (!product) {
            toast.error("Product not found, please add product again")
            return
        }
        const existingProduct = cartItems.find((item: IProductItems) => item.id === product.id)
        if (existingProduct) {
            toast.warning("Product already in cart")
            return
        }
        const productCart: ICartItem = {
            product_id: product.id,
            quantity: 1,
            discount_code: "",
        }
        setCartItems([...cartItems, product])
        setCart([...cart, productCart])
        toast.success("Product added to cart")
    }

    const handleDeleteProduct = (productId: number) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== productId)
        const updateCart = cart.filter((item) => item.product_id !== productId)

        const updatedDiscounts = productDiscounts.filter((discount) => discount.productId !== productId)

        setProductDiscounts(updatedDiscounts)
        setCartItems(updatedCartItems)
        setCart(updateCart)
        toast.success("Product deleted from cart")
    }

    const updateQuantity = (id: number, newQuantity: number) => {
        const stock = cartItems.find((item) => item.id === id)?.stock || 0

        if (newQuantity < 1) {
            toast.error("Quantity cannot be less than 1")
            return
        }

        if (newQuantity > stock) {
            toast.error(`Only ${stock} items available in stock`)
            return
        }

        setCart(cart.map((item) => (item.product_id === id ? { ...item, quantity: newQuantity } : item)))
    }

    // Calculate discount amount for a specific product
    const calculateProductDiscountAmount = (productId: number, price: number, quantity: number): number => {
        const discount = productDiscounts.find((d) => d.productId === productId)

        if (!discount) return 0
        return discount.discountValue * quantity
    }

    const handleCheckout = async () => {
        const outletId = localStorage.getItem("outletId")
        if (!outletId) {
            toast.error("Please select outlet first")
            return
        }

        if (cartItems.length === 0) {
            toast.error("Cart is empty")
            return
        }

        if (!paymentMethod) {
            toast.error("Please select payment method")
            return
        }

        const bodyRequest: ICreateTransactionBody = {
            outlet_id: Number(outletId),
            payment_method: Number(paymentMethod),
            pay: paymentAmount,
            discount_code: cartDiscountCode,
            carts: cart,
        }

        try {
            const resp = await createTransaction(bodyRequest)
            if (resp.status === 200) {
                toast.success("Transaction created successfully")
                // Process print the transaction PDF
                await printPDF(
                    <TransactionPDF transaction={resp.data} />,
                    () => {
                        toast.success("Transaction sent to printer successfully", { duration: 5000 })
                        setCart([])
                        setCartItems([])
                        setProductDiscounts([])
                        setCartDiscount(null)
                        setPaymentMethod("")
                        setPaymentAmount(0)
                        setSelectedMember(null)
                        setCartDiscountCode("")
                    },
                    (error) => {
                        toast.error("Failed to print transaction", { duration: 5000 })
                        console.error("Print error:", error)
                    }
                )
            } else {
                toast.error(resp.message || "Error creating transaction")
            }
        } catch (error) {
            toast.error("Error creating transaction")
        }
    }

    // Calculate subtotal (before any discounts)
    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const product = cartItems.find((p) => p.id === item.product_id)
            if (product) {
                return total + product.price * item.quantity
            }
            return total
        }, 0)
    }, [cart, cartItems])

    // Calculate total product discounts
    const totalProductDiscounts = useMemo(() => {
        return cart.reduce((total, item) => {
            const product = cartItems.find((p) => p.id === item.product_id)
            if (product) {
                const discountAmount = calculateProductDiscountAmount(item.product_id, product.price, item.quantity)
                return total + discountAmount
            }
            return total
        }, 0)
    }, [cart, cartItems, productDiscounts])

    // Calculate cart discount
    const cartDiscountAmount = useMemo(() => {
        if (!cartDiscount) return 0

        const discountableAmount = subtotal - totalProductDiscounts

        const discountAmount = (cartDiscount.discountValue / 100) * discountableAmount

        return Math.min(discountAmount, discountableAmount)
    }, [subtotal, totalProductDiscounts, cartDiscount])


    // Calculate total discount (product discounts + cart discount)
    const totalDiscount = useMemo(() => {
        return totalProductDiscounts + cartDiscountAmount
    }, [totalProductDiscounts, cartDiscountAmount])

    // Calculate final total
    const total = useMemo(() => {
        return subtotal - totalDiscount
    }, [subtotal, totalDiscount])

    // Calculate change amount
    const changeAmount = useMemo(() => {
        return Math.max(0, paymentAmount - total)
    }, [paymentAmount, total])

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
            renderCell: ({ stock, id }) => (
                <div className="col-span-2 md:col-span-2 md:flex md:flex-col md:items-center">
                    <div className="flex items-center gap-2 justify-end md:justify-center">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-md border-gray-200"
                            onClick={() => {
                                const currentQuantity = cart.find((item) => item.product_id === id)?.quantity ?? 0
                                updateQuantity(id, currentQuantity - 1)
                            }}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center font-medium">
                            {cart.find((item) => item.product_id === id)?.quantity || 0}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-md border-gray-200"
                            onClick={() => {
                                const currentQuantity = cart.find((item) => item.product_id === id)?.quantity ?? 0
                                updateQuantity(id, currentQuantity + 1)
                            }}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="text-xs text-gray-400 text-right md:text-end mt-1">available: {stock}</div>
                </div>
            ),
            className: cn("text-center justify-center"),
        },
        {
            label: "Code Discount",
            renderCell: ({ id }) => {
                // Get existing discount for this product if any
                const existingDiscount = productDiscounts.find((d) => d.productId === id)
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (existingDiscount) {
                        setProductDiscounts(productDiscounts.map((discount) => (discount.productId === id ? { ...discount, discountCode: e.target.value } : discount)))
                    } else {
                        setProductDiscounts([...productDiscounts, { productId: id, discountCode: e.target.value, discountValue: 0 }])
                    }
                }
                return (
                    <DiscountInput
                        className=" min-w-40"
                        value={existingDiscount?.discountCode || tempDiscountCode}
                        onChange={(e) => handleChange(e)}
                        onApply={() => handleApplyProductDiscount(id)}
                    />
                )
            },
            className: cn("text-center justify-center"),
        },
        {
            label: "Total",
            renderCell: ({ id, price }) => {
                const item = cart.find((item) => item.product_id === id)
                if (!item) return <p>-</p>

                const quantity = item.quantity
                const itemSubtotal = price * quantity
                const discountAmount = calculateProductDiscountAmount(id, price, quantity)
                const itemTotal = itemSubtotal - discountAmount

                return (
                    <div className="w-full py-1.5">
                        <Text variant="h6" className="text-right">
                            {formatCurrency(itemTotal)}
                        </Text>
                        {discountAmount > 0 && (
                            <Text variant="span" className="text-xs text-red-500 flex items-center justify-end gap-1">
                                - {formatCurrency(discountAmount)}
                            </Text>
                        )}
                    </div>
                )
            },
            className: "text-center",
        },
        {
            label: "",
            renderCell: ({ id }) => (
                <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(id)}>
                    <Trash2 />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    const memoModalFormManual = useMemo(() => {
        if (openManualModal) {
            return <FormManual open={openManualModal} onClose={setOpenManualModal} />
        }
    }, [openManualModal])

    const memoModalSearchProduct = useMemo(() => {
        if (openModalProduct) {
            return (
                <SearchProduct addProduct={handleAddProductToCart} openModal={openModalProduct} onClose={setOpenModalProduct} />
            )
        }
    }, [openModalProduct])

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap justify-between items-center gap-5 select-none">
                <div className="flex flex-col gap-3">
                    <Text variant="h2" className="max-sm:text-2xl">
                        Create Transaction
                    </Text>
                    <BreadcrumbWithDropdown />
                </div>
                <Button onClick={() => setOpenManualModal(true)} className="max-sm:w-full">
                    <Plus /> <span>Manual Transaction</span>
                </Button>
            </div>
            <div className="flex flex-col gap-6 mb-10">
                <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg space-y-7">
                    <div className="flex flex-wrap justify-between gap-4 md:gap-8 border-b border-accent p-2.5 md:px-5 md:py-5">
                        <div className="flex items-center gap-2">
                            <Text variant="h5" className="flex items-center gap-2">
                                <PiShoppingCart />
                                <span> Cart</span>
                            </Text>
                            <Text variant="p" className="text-slate-400">{`(${cartItems.length} item)`}</Text>
                        </div>
                        <Button variant="outline" onClick={() => setOpenModalProduct(true)} className="flex items-center gap-2">
                            <Plus />
                            <span className="flex items-center gap-1">
                                <p className="max-sm:hidden">Add</p> Product
                            </span>
                        </Button>
                    </div>
                    <div className="px-2.5 md:px-5">
                        {cartItems.length > 0 ? (
                            <Tables columns={columnsPaymentList} data={cartItems} />
                        ) : (
                            <div className="w-full min-h-60 px-1 flex flex-col items-center justify-center gap-2">
                                <Text variant="h4">Your cart is empty</Text>
                                <Text variant="span" className="text-slate-400 max-w-md text-center">
                                    Looks like you haven't added any items to your cart yet. Start adding products to proceed with your
                                    transaction.
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg p-2.5 md:p-5 space-y-7">
                    <Text variant="h5" className="flex items-center gap-2">
                        <IoDocumentTextOutline />
                        <span> Order Summary</span>
                    </Text>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sub Total</span>
                            <span className="font-medium">{totalProductDiscounts > 0 ? formatCurrency(subtotal - totalProductDiscounts) : formatCurrency(subtotal)}</span>
                        </div>

                        {cartDiscountAmount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="font-medium text-red-500">-{formatCurrency(cartDiscountAmount)}</span>
                            </div>
                        )}

                        <hr />
                        <div className="flex justify-between">
                            <span className="font-medium">Total</span>
                            <span className="font-medium text-green-600">{formatCurrency(total)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-5">
                        <DiscountInput
                            className="h-12"
                            value={cartDiscountCode}
                            onChange={(e) => setCartDiscountCode(e.target.value)}
                            onApply={handleApplyCartDiscount}
                            placeholder="Cart discount code"
                        />
                        <SearchMember
                            value={selectedMember}
                            setValue={setSelectedMember}
                            className="!h-12 !w-full px-2.5 font-normal !text-sm hover:bg-transparent hover:text-gray-500"
                        />
                        <PaymentMethodSelect
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                            className="!h-12 w-full"
                            placeholder="Payment Method"
                        />
                        <Input
                            placeholder="Payment Amount"
                            type="number"
                            min={0}
                            value={paymentAmount || ""}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                        />
                        <div className="flex justify-between pb-4">
                            <span className="font-medium">Money Changes</span>
                            <span className="font-medium text-green-600">{formatCurrency(changeAmount)}</span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleCheckout}
                    className="w-full h-12 mx-auto"
                    disabled={cart.length === 0 || paymentAmount < total}
                >
                    <span className="flex items-center gap-1">
                        <p>Check Out • {formatCurrency(total)}</p>
                    </span>
                </Button>
            </div>
            {memoModalFormManual}
            {memoModalSearchProduct}
        </div>
    )
}

export default Cashier
