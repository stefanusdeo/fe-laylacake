import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import ModalDelete from '@/components/molecules/modal/ModalDelete'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { cn, useDebounce } from '@/lib/utils'
import { deletedMultiplePaymentMethods, deletedSpesificPaymentMethod, getPaymentInternal } from '@/store/action/payment-method'
import { usePaymentStore } from '@/store/hooks/usePayment'
import { IParamsPayment, PaymentMethodData } from '@/types/paymentTypes'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { toast } from 'sonner'

function PaymentMethodInternal() {
    const { paymentInternal } = usePaymentStore()

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>(paymentInternal?.data || [])

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchInput, setSearchInput] = useState("")
    const [filter, setFilter] = useState("")

    const [selectedPayment, setSelectedPayment] = useState<number[]>([])

    const [paymentId, setPaymentId] = useState<number | null>(null)
    const [paymentName, setPaymentName] = useState("")

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalMultiOutlets, setOpenModalMultiOutlets] = useState(false);

    const search = useDebounce(searchInput, 600)

    const [isPending, startTransition] = useTransition()

    const getInternalPaymentMethods = async () => {
        const params: IParamsPayment = { page, limit, search, filter }
        const res = await getPaymentInternal(params)
        if (res?.pagination) {
            if (res?.pagination.total_page === 1) {
                setPage(1)
            }
        }
        setPaymentMethods(res?.data || [])
    }

    useEffect(() => {
        startTransition(() => {
            getInternalPaymentMethods()
        })
    }, [page, limit, search])

    const handleSearch = (value: string, filter: string) => {
        setSearchInput(value)
        setFilter(filter)
    }

    const handleChecked = (id: number) => {
        setSelectedPayment((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((val) => val !== id) : [...prevSelected, id],
        )
    }

    const handleSelectAll = () => {
        if (selectedPayment.length === paymentMethods.length) {
            setSelectedPayment([])
        } else {
            try {
                startTransition(async () => {
                    const res = await getPaymentInternal({ page: 0, limit: 0 })
                    const paymentAll = res?.data || []
                    setSelectedPayment(paymentAll.map((paymentMethod: PaymentMethodData) => paymentMethod.id))
                })
            } catch (error) {
                toast.error("Failed select all: missing data payment methods")
            }
        }
    }

    const handleOpenModalSpesific = (id: number, name: string) => {
        if (id && name) {
            setPaymentId(id)
            setPaymentName(name)
            setOpenModalDelete(true)
        }
    }

    const hadleCloseModalSpesific = () => {
        setOpenModalDelete(false)
        setPaymentId(null)
        setPaymentName("")
    }

    const handleMultiDelete = async () => {
        const resp = new Promise((reslove, rejects) => {
            const typeDel = selectedPayment.length === paymentMethods.length ? "all" : "partial"
            deletedMultiplePaymentMethods(selectedPayment, typeDel)
                .then((res: any) => {
                    if (res?.status === 200) {
                        reslove(res)
                        getInternalPaymentMethods()
                        setSelectedPayment([])
                        setOpenModalMultiOutlets(false)
                    } else {
                        rejects(res)
                    }
                })
        })
        toast.promise(resp, {
            loading: "Deleting Payment Methods...",
            success: "Payment methods deleted successfully",
            error: (err: any) => `Failed to delete Payment Methods: ${err?.message || 'Please try again'}`
        })
    }

    const handleDeleteSpesific = async () => {
        if (!paymentId) {
            toast.error("Failed delete: missing id payment method")
            return
        }
        const resp = new Promise((reslove, rejects) => {
            deletedSpesificPaymentMethod(paymentId).then((res: any) => {
                if (res?.status === 200) {
                    reslove(res)
                    getInternalPaymentMethods()
                    if (selectedPayment.includes(paymentId)) setSelectedPayment((prevSelected) => prevSelected.filter((val) => val !== paymentId))
                    hadleCloseModalSpesific()
                } else {
                    rejects(res)
                }
            })
        })
        toast.promise(resp, {
            loading: "Deleting payment method...",
            success: "Payment method deleted successfully",
            error: (err: any) => `Failed to delete payment method: ${err?.message || 'Please try again'}`
        })
    }

    const columnsOutletList: Column<PaymentMethodData>[] = [
        {
            label: (
                <Checkbox
                    className='size-5 mt-1 data-[state=unchecked]:bg-white border-border'
                    checked={selectedPayment.length === paymentMethods.length }
                    onCheckedChange={handleSelectAll}
                />
            ),
            renderCell: ({ id }) => (
                <div>
                    <Checkbox
                        className='size-5 mt-1 border-border'
                        value={id}
                        checked={selectedPayment.includes(id)}
                        onCheckedChange={() => handleChecked(id)}
                    />
                </div>
            ),
            className: cn("text-center justify-center"),
        },
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
            label: "Action",
            renderCell: ({ id, name }) => (
                <Button variant="outline" size="icon" onClick={() => handleOpenModalSpesific(id, name)}>
                    <Trash2 />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    // Modal Delete (menggunakan useMemo untuk optimasi)
    const memoModalDeleteSpesific = useMemo(() => {
        if (openModalDelete) {
            return (
                <ModalDelete
                    open={openModalDelete}
                    onClose={setOpenModalDelete}
                    title="Delete Payment Method"
                    description={<span>Are you sure want to delete payment method <b>{paymentName}</b>?</span>}
                    onConfirm={handleDeleteSpesific}
                    onCancel={hadleCloseModalSpesific}
                />
            );
        }
    }, [openModalDelete]);

    const memoModalDeleteMultiOutlets = useMemo(() => {
        if (openModalMultiOutlets) {
            return (
                <ModalDelete
                    open={openModalMultiOutlets}
                    onClose={setOpenModalMultiOutlets}
                    title="Delete Confirmation"
                    description={<span>Are you sure you want to delete <b>{selectedPayment.length + " Payment methods"}</b>? This action cannot be undone.</span>}
                    onConfirm={handleMultiDelete}
                    onCancel={() => setOpenModalMultiOutlets(false)}
                />
            );
        }
    }, [openModalMultiOutlets]);

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
                options={[
                    { value: "name", label: "Name" },
                ]}
                className="rounded-md"
                onSearch={handleSearch}
            /> */}

            {/* Table */}
            <div>
                {selectedPayment.length > 0 ? (
                    <div className="flex w-full py-4 px-10 rounded-t-lg bg-orange-100 justify-between items-center">
                        <Text variant="h5" className="text-orange-500">
                            Selected {selectedPayment.length} {selectedPayment.length > 1 ? "Payment Methods" : "Payment Method"}
                        </Text>
                        {selectedPayment.length > 1 && (
                            <Button size="sm" variant="outline" onClick={() => setOpenModalMultiOutlets(true)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete All
                            </Button>
                        )}
                    </div>
                ) : null}
                <Tables columns={columnsOutletList} data={paymentMethods} />
                {/* <div className="flex justify-between items-center p-4 border-slate-100 border-t-[2px]"> */}
                {/* Pagination Info */}
                {/* <PaginationInfo displayed={limit} total={paymentInternal?.pagination.total_records ?? 0} onChangeDisplayed={setLimit} className="" /> */}
                {/* Pagination */}
                {/* <TablePagination limit={limit} page={page} onPageChange={setPage} totalItems={paymentInternal?.pagination.total_records ?? 1} /> */}
                {/* </div> */}
            </div>
            {memoModalDeleteSpesific}
            {memoModalDeleteMultiOutlets}
        </div>
    )
}

export default PaymentMethodInternal
