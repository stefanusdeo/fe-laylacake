"use client"
import { CustomSelect, SelectOption } from '@/components/atoms/Selects'
import { CustomCalendar } from '@/components/molecules/customCalendar'
import Dialog from '@/components/molecules/dialog'
import { Button } from '@/components/ui/button'
import { getOutletsExternal, getOutletsInternal } from '@/store/action/outlets'
import { getPaymentInternal } from '@/store/action/payment-method'
import { useOutletStore } from '@/store/hooks/useOutlets'
import { usePaymentStore } from '@/store/hooks/usePayment'
import { OutletData } from '@/types/outletTypes'
import { PaymentMethodData } from '@/types/paymentTypes'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { HiOutlineSwitchVertical } from "react-icons/hi";

interface ModalMigrateProps {
    open: boolean
    onClose: (open: boolean) => void
}

export default function ModalMigrate({ open, onClose }: ModalMigrateProps) {
    const { outletInternal, outletExternal } = useOutletStore()
    const { paymentInternal } = usePaymentStore()

    const [dateRange, setDateRange] = useState<DateRange | any>("")

    const [outletSelect, setOutletSelect] = useState<string>("")
    const [outletOptions, setOutletOptions] = useState<SelectOption[]>(outletExternal?.data?.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })) ?? [])
    const [isLoadingOutlet, setIsLoadingOutlet] = useState(false)

    const [outletDestinationSelect, setOutletDestinationSelect] = useState<string>("")
    const [outletDestinationOptions, setOutletDestinationOptions] = useState<SelectOption[]>(outletInternal?.data?.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })) ?? [])
    const [isLoadingOutletDestination, setIsLoadingOutletDestination] = useState(false)

    const [methodSelect, setMethodSelect] = useState<string>("")
    const [methodOptions, setMethodOptions] = useState<SelectOption[]>(paymentInternal?.data?.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })) ?? [])
    const [isLoadingMethod, setIsLoadingMethod] = useState(false)

    const fetchOutletExternal = async () => {
        setIsLoadingOutlet(true)
        try {
            const res = await getOutletsExternal({ page: 0, limit: 0 })
            setOutletOptions(res.data.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })))
            setIsLoadingOutlet(false)
        }
        catch (err) {
            setIsLoadingOutlet(false)
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

    useEffect(() => {
        if (outletExternal?.data?.length === 0 || !outletExternal?.data || outletOptions.length === 0 || !outletOptions) {
            fetchOutletExternal()
        }
        if (outletInternal?.data?.length === 0 ||!outletInternal?.data || outletDestinationOptions.length === 0 ||!outletDestinationOptions) {
            fetchOutletDestination() 
        }

        if (paymentInternal?.data?.length === 0 || !paymentInternal?.data || methodOptions.length === 0 || !methodOptions) {
            fetchMethod()
        }
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
                                options={outletOptions}
                                label="Outlet"
                                placeholder={outletOptions.length > 0 ? "Select a outlet" : "No data available"}
                                isLoading={isLoadingOutlet}
                                value={outletSelect}
                                onChange={setOutletSelect}
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
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center gap-1.5 text-primary my-2'>
                <div className='h-0.5 w-full bg-accent' /><HiOutlineSwitchVertical size={30} /><div className='h-0.5 w-full bg-accent' />
            </div>
            <div className='border-accent border rounded-lg px-3 py-3'>
                <div className='w-full'>
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
                <div className='w-full mt-2'>
                    <span className='block mb-1 text-xs font-medium text-gray-900 dark:text-white'>Note:</span>
                    <p className='text-xs text-red-500'>* Transactions from the selected outlet and payment method will be moved to the new outlet you’ve selected above.</p>
                </div>
            </div>
            <Button
                className='mt-4 w-full'
                disabled={!dateRange || !outletSelect || !methodSelect || !outletDestinationSelect}
            >
                Transfer Transactions
            </Button>
        </Dialog>
    )
}
