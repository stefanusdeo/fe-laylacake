"use client"
import { CustomSelect, SelectOption } from '@/components/atoms/Selects'
import { CustomCalendar } from '@/components/molecules/customCalendar'
import Dialog from '@/components/molecules/dialog'
import { Button } from '@/components/ui/button'
import { getOutletsExternal, getOutletsInternal } from '@/store/action/outlets'
import { getPaymentInternal } from '@/store/action/payment-method'
import { migrateTransactions } from '@/store/action/transactions'
import { useTransactionStore } from '@/store/hooks/useTransactions'
import { OutletData } from '@/types/outletTypes'
import { PaymentMethodData } from '@/types/paymentTypes'
import { IMigrateTransactionBody } from '@/types/transactionTypes'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { HiOutlineSwitchVertical } from "react-icons/hi"
import { toast } from 'sonner'

interface ModalMigrateProps {
    open: boolean
    onClose: (open: boolean) => void
}

export default function ModalMigrate({ open, onClose }: ModalMigrateProps) {
    const [dateRange, setDateRange] = useState<DateRange | any>("")

    const [outletSourceSelect, setOutletSourceSelect] = useState<string>("")
    const [outletSourceOptions, setOutletSourceOptions] = useState<SelectOption[]>([])
    const [isLoadingOutletSource, setIsLoadingOutletSource] = useState(false)

    const [outletDestinationSelect, setOutletDestinationSelect] = useState<string>("")
    const [outletDestinationOptions, setOutletDestinationOptions] = useState<SelectOption[]>([])
    const [isLoadingOutletDestination, setIsLoadingOutletDestination] = useState(false)

    // const [paymentSelect, setPaymentSelect] = useState<string>("")
    // const [paymentOptions, setPaymentOptions] = useState<SelectOption[]>(paymentExternal?.data?.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })) ?? [])
    // const [isLoadingPayment, setIsLoadingPayment] = useState(false)

    const [methodSelect, setMethodSelect] = useState<string>("")
    const [methodOptions, setMethodOptions] = useState<SelectOption[]>([])
    const [isLoadingMethod, setIsLoadingMethod] = useState(false)

    const fetchOutletSource = async () => {
        setIsLoadingOutletSource(true)
        try {
            const res = await getOutletsExternal({ page: 0, limit: 0 })
            setOutletSourceOptions(res.data.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })))
            setIsLoadingOutletSource(false)
        }
        catch (err) {
            setIsLoadingOutletSource(false)
        }
    }

    const fetchOutletDestination = async () => {
        setIsLoadingOutletDestination(true)
        try {
            const res = await getOutletsInternal({ page: 0, limit: 0 })
            setOutletDestinationOptions(res.data.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })))
            setIsLoadingOutletDestination(false)
        }
        catch (err) {
            setIsLoadingOutletDestination(false)
        }
    }
    
    //external
    // const fetchPayment = async () => {
    //     setIsLoadingPayment(true)
    //     try {
    //         const res = await getPaymentExternal({ page: 0, limit: 0 })
    //         setPaymentOptions(res.data.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })))
    //         setIsLoadingPayment(false)
    //     } catch (err) {
    //         setIsLoadingPayment(false)
    //     }
    // }
    
    // internal  
    const fetchMethod = async () => {
        setIsLoadingMethod(true)
        try {
            const res = await getPaymentInternal({ page: 0, limit: 0 })
            setMethodOptions(res.data.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })))
            setIsLoadingMethod(false)
        } catch (err) {
            setIsLoadingMethod(false)
        }
    }

    const handleMigrate = async () => {
        const resp = new Promise((resolve, reject) => {
            const body: IMigrateTransactionBody = {
                start_date: dateRange?.from?.toISOString() || "",
                end_date: dateRange?.to?.toISOString() || "",
                from_outlet: Number(outletSourceSelect),
                to_outlet: Number(outletDestinationSelect),
                payment_method: methodSelect ? Number(methodSelect) : 0,
            }
            migrateTransactions(body)
                .then((res) => {
                    if (res?.status === 200) {
                        resolve(res)
                        useTransactionStore.getState().setStatusMigration(true)
                        onClose(false)
                    } else {
                        // Properly format the error object before rejecting
                        const errorMessage = res?.message || 'Unknown error occurred'
                        reject({ message: errorMessage, originalResponse: res })
                    }
                })
                .catch((err) => {
                    // Handle network or unexpected errors
                    const errorMessage = err?.message || 'Transaction transfer failed: Please try again'
                    reject({ message: errorMessage, originalError: err })
                })
        })

        toast.promise(resp, {
            loading: "Processing transaction transfer...",
            success: "Transfer request sent successfully, now being processed...",
            error: (err: any) => `${err?.message || 'Transaction transfer failed: Please try again.'}`
        });
    }

    useEffect(() => {
        fetchOutletSource()
        fetchOutletDestination()
        fetchMethod()
        //fetchPayment()
    }, [])

    return (
        <Dialog title='Form Transaction' onClose={onClose} open={open} className='min-w-xs w-full max-w-sm p-4'>
            <div className='border-accent border rounded-lg px-3 py-3'>
                <div className='flex flex-wrap gap-4'>
                    <div className='w-full '>
                        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Transaction Date</label>
                        <CustomCalendar
                            className='w-full'
                            mode="range"
                            placeholder="Chose a date range"
                            onDateChange={(range) => setDateRange(range as DateRange)}
                            defaultValue={dateRange}
                        />
                    </div>
                    <div className='grid md:grid-cols-2 gap-4 w-full'>
                        <div className='w-full'>
                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>From Outlet</label>
                            <CustomSelect
                                options={outletSourceOptions}
                                label="Transactions Outlet"
                                placeholder={outletSourceOptions.length > 0 ? "Select a outlet" : "No data available"}
                                isLoading={isLoadingOutletSource}
                                value={outletSourceSelect}
                                onChange={setOutletSourceSelect}
                                className='!h-10 !w-full'
                            />
                        </div>
                        <div className='w-full'>
                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Payment Method</label>
                            <CustomSelect
                                options={methodOptions}
                                label="Method"
                                placeholder={methodOptions.length > 0 ? "Select a method" : "No data available"}
                                isLoading={isLoadingMethod}
                                value={methodSelect}
                                onChange={setMethodSelect}
                                className='!h-10 !w-full'
                            />
                        </div>
                        {/* <div className='w-full'>
                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Payment Method</label>
                            <CustomSelect
                                options={paymentOptions}
                                label="Transaction Method"
                                placeholder={paymentOptions.length > 0 ? "Select a method" : "No data available"}
                                isLoading={isLoadingPayment}
                                value={paymentSelect}
                                onChange={setPaymentSelect}
                                className='!h-10 !w-full'
                            />
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center gap-1.5 text-primary my-2'>
                <div className='h-0.5 w-full bg-accent' /><HiOutlineSwitchVertical size={30} /><div className='h-0.5 w-full bg-accent' />
            </div>
            <div className='border-accent border rounded-lg px-3 py-3'>
                <div className='grid md:grid-cols-2 gap-4 w-full'>
                    <div className='w-full col-span-2'>
                        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>To Outlet</label>
                        <CustomSelect
                            options={outletDestinationOptions}
                            label="Outlet Destination"
                            placeholder={outletDestinationOptions.length > 0 ? "Select a outlet" : "No data available"}
                            isLoading={isLoadingOutletDestination}
                            value={outletDestinationSelect}
                            onChange={setOutletDestinationSelect}
                            className='!h-10 !w-full'
                        />
                    </div>

                </div>
                <div className='w-full mt-2'>
                    <div className='block mb-1 text-xs font-medium text-gray-900 dark:text-white'>Note:</div>
                    <div className='text-xs text-red-500 tracking-wide'>* Transactions within the selected date range will be transferred to the outlet and payment method you’ve selected above.</div>
                </div>
            </div>
            <Button
                onClick={handleMigrate}
                className='mt-4 w-full'
                disabled={!dateRange || !methodSelect || !outletDestinationSelect || !outletSourceSelect}
            >
                Transfer Transactions
            </Button>
        </Dialog>
    )
}
