"use client"
import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import ModalInfo from '@/components/molecules/modal/ModalInfo'
import { Button } from '@/components/ui/button'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { cn, useDebounce } from '@/lib/utils'
import { getPaymentExternal, migratePayment } from '@/store/action/payment-method'
import { usePaymentStore } from '@/store/hooks/usePayment'
import { IParamsOutlet, OutletData } from '@/types/outletTypes'
import { PaymentMethodData } from '@/types/paymentTypes'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { TbPackageExport } from "react-icons/tb"
import ClipLoader from 'react-spinners/ClipLoader'
import { toast } from 'sonner'

function PaymentMethodsExternal() {
    const { paymentExternal } = usePaymentStore()

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>(paymentExternal?.data || [])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchInput, setSearchInput] = useState("")
    const [filter, setFilter] = useState("")
    const [openModalInfo, setOpenModalInfo] = useState(false)
    const [paymentId, setPaymentId] = useState<number[]>([])
    const [paymentName, setPaymentName] = useState("")

    const search = useDebounce(searchInput, 600)

    const [isPending, startTransition] = useTransition()

    const getExternalPayment = async () => {
        const params: IParamsOutlet = { page, limit, search, filter }
        const res = await getPaymentExternal(params)
        if (res?.pagination) {
            if (res?.pagination.total_page === 1) {
                setPage(1)
            }
        }
        setPaymentMethods(res?.data || [])
    }

    useEffect(() => {
        startTransition(() => {
            getExternalPayment()
        })
    }, [page, limit, search])

    const handleSearch = (value: string, filter: string) => {
        setSearchInput(value)
        setFilter(filter)
    }

    const handleOpenModalInfo = (id: number, name: string) => {
        if (id && name) {
            setPaymentId([id])
            setPaymentName(name)
            setOpenModalInfo(true)
        }
    }

    const hadleCloseModalInfo = () => {
        setOpenModalInfo(false)
        setPaymentId([])
        setPaymentName("")
    }

    const handleMove = () => {
        const resp = new Promise((reslove, rejects) => {
            migratePayment(paymentId)
                .then((res: any) => {
                    if (res?.status === 200) {
                        reslove(res)
                        getExternalPayment()
                        hadleCloseModalInfo()
                    } else {
                        rejects(res)
                    }
                })
        });
        toast.promise(resp, {
            loading: "Moving Payment Method...",
            success: "Payment method moved successfully",
            error: (err: any) => `Failed to move payment method: ${err?.message || 'Please try again'}`
        })
    }

    // Columns Outlet List
    const columnsOutletList: Column<OutletData>[] = [
        {
            label: "No",
            renderCell: () => null,
            className: cn("text-center justify-center"),
        },
        {
            label: "Name",
            renderCell: (row) => <p>{row.name}</p>,
            className: "w-full text-left",
        },
        {
            label: "Move",
            renderCell: ({ id, name }) => (
                <Button variant="outline" size="icon" onClick={() => handleOpenModalInfo(id, name)}>
                    <TbPackageExport />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    const memoModalInfo = useMemo(() => {
        if (openModalInfo) {
            return (
                <ModalInfo
                    open={openModalInfo}
                    onClose={setOpenModalInfo}
                    title="Moving Payment Method"
                    description={<span>Are you sure want to move <b>{paymentName}</b> to your payment method?</span>}
                    onConfirm={handleMove}
                    onCancel={hadleCloseModalInfo}
                />
            )
        }
    }, [openModalInfo])

    if (isPending) {
        return (
            <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                <ClipLoader loading={isPending} size={15} /> Getting payment method list...
            </Text>
        );
    }

    return (
        <div className="w-full space-y-7">
            {/* Search Input */}
            {/* <SearchInputGroup
                options={[{ value: "name", label: "Name" }]}
                className="rounded-md"
                onSearch={handleSearch}
            /> */}

            {/* Loading State */}
            {isPending && (
                <div className="flex justify-center items-center py-5">
                    <p className="text-gray-500">Loading data...</p>
                </div>
            )}

            {/* Table */}
            <div>
                <Tables columns={columnsOutletList} data={paymentMethods} />
            </div>
            {memoModalInfo}
        </div>
    )
}

export default PaymentMethodsExternal
